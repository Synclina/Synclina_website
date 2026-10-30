export const OPEN_AGENT_EVENT = "synclina:open-agent";

/** Opens the floating Synclina AI widget, optionally sending a first question. */
export const openAgent = (question?: unknown) => {
  const detail = typeof question === "string" ? { question } : {};
  window.dispatchEvent(new CustomEvent(OPEN_AGENT_EVENT, { detail }));
};
