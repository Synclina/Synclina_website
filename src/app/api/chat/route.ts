import { SYSTEM_PROMPT, localAnswer, type ChatMessage } from "@/lib/ai";

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const LIMIT = 12; // requests per IP per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

/** Streams a string out in small chunks so the offline mode still "types". */
function streamText(text: string) {
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,6}/gs) ?? []) {
        controller.enqueue(enc.encode(chunk));
        await new Promise((r) => setTimeout(r, 14));
      }
      controller.close();
    },
  });
}

async function streamGemini(messages: ChatMessage[], key: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    },
  );
  if (!res.ok || !res.body) throw new Error(`Gemini ${res.status}`);

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buffer = "";
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += dec.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const ev of events) {
        const line = ev.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        try {
          const json = JSON.parse(line.slice(5));
          const text = json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
          if (text) controller.enqueue(enc.encode(text));
        } catch {
          /* partial or keep-alive event */
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return new Response("You're sending messages a little fast — give me a moment and try again.", { status: 429 });
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = (body.messages as ChatMessage[])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!messages.length || messages[messages.length - 1].role !== "user") throw new Error();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const question = messages[messages.length - 1].content;

  if (key) {
    try {
      return new Response(await streamGemini(messages, key), { headers });
    } catch (err) {
      console.error("[chat] Gemini failed, using local answers:", err);
    }
  }
  return new Response(streamText(localAnswer(question)), { headers });
}
