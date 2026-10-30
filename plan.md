# 🚀 SYNCLINA — Website Master Plan

> **"Ideas in Sync."**
> A next-generation, immersive website for Synclina — an AI-first technology brand building products that solve real-world problems.

---

## 📋 Table of Contents

1. [Brand Analysis & Understanding](#1-brand-analysis--understanding)
2. [Design Philosophy & Inspiration](#2-design-philosophy--inspiration)
3. [Technology Stack](#3-technology-stack)
4. [Architecture & Project Structure](#4-architecture--project-structure)
5. [Page-by-Page Design Blueprint](#5-page-by-page-design-blueprint)
6. [3D Animations & Visual Effects](#6-3d-animations--visual-effects)
7. [Agentic AI Integration](#7-agentic-ai-integration)
8. [GitHub Repos & Resources to Leverage](#8-github-repos--resources-to-leverage)
9. [Performance Optimization Strategy](#9-performance-optimization-strategy)
10. [SEO & Analytics Strategy](#10-seo--analytics-strategy)
11. [Phased Implementation Timeline](#11-phased-implementation-timeline)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)

---

## 1. Brand Analysis & Understanding

### What is Synclina?

**Synclina** is an AI-first technology brand/lab/studio that builds practical, real-world products solving everyday problems through intelligent technology. The tagline **"Ideas in Sync"** captures the philosophy of synchronizing innovative ideas into tangible products.

### Brand Identity (from Logo Analysis)

| Element | Detail |
|---------|--------|
| **Logo Mark** | A stylized intertwined "S" — representing connection, flow, and synchronization |
| **Primary Gradient** | Deep violet/indigo (#5B21B6) to Electric purple/magenta (#C026D3) |
| **Typography** | Clean, geometric sans-serif with wide letter-spacing — modern and technical |
| **Light Mode** | White background, dark text, purple gradient mark |
| **Dark Mode** | Pure black background, white text, glowing purple gradient mark |
| **Tagline** | "IDEAS IN **SYNC**." — with "SYNC" in the brand purple |
| **Variants** | Icon-only (social/favicon), horizontal wordmark, wordmark + tagline — 8 total |

### Brand Personality
- **Ambitious yet accessible** — Not corporate, not too casual
- **Technical depth** — AI, automation, smart systems
- **Community-driven** — Open to ideas, collaboration, feedback
- **Early-stage energy** — "Just getting started. A lot more to come."

### The Product Portfolio (Under Synclina)

| Product | Domain | Description | Tech Stack | Status |
|---------|--------|-------------|------------|--------|
| **FuelSense** | Automotive / Mobility | AI-powered smart vehicle economy & management app. Digital cockpit, ride tracking, fuel analytics, OBD integration, community rides, emergency safety, AI copilot | Flutter + Dart, Firebase, Cloudflare Workers, SQLite | Advanced (V2.0, 38 wireframes, 700+ tests) |
| **InstaGro** | Social Media / Marketing | Instagram automation & analytics platform. Keyword-based comment/DM auto-replies, content insights, engagement analytics | Flutter + Node.js/TypeScript, Fastify, Instagram Graph API | Early (Phase 0 complete) |
| **TripSync** | Travel / Lifestyle | Smart travel planner + road-trip buddy platform. AI itineraries, hidden spots discovery, expense splitting, companion matching, safety verification | React + Vite, Python backend, Firebase Data Connect | In Progress |

### What These Products Reveal About Synclina's DNA
1. **AI at the core** — Every product has intelligent automation (FuelSense's AI Copilot, InstaGro's keyword automation engine, TripSync's AI-driven itineraries)
2. **Solves real, everyday problems** — Vehicle costs, social media growth, travel planning
3. **Privacy-first** — FuelSense has extensive privacy rules; data stays on-device
4. **Multi-platform** — Mobile (Flutter) + Web (React) + Backend (Node/Python)
5. **Community-centric** — All products have social/community features
6. **Free-first, Pro later** — Safety features are never behind paywalls

---

## 2. Design Philosophy & Inspiration

### Design DNA — "The Synclina Aesthetic"

The website must feel like the intersection of:
- **Linear's** meticulous dark-mode precision
- **Vercel's** technical grid storytelling
- **Apple's** scroll-driven 3D product reveals
- **Stripe's** gradient elegance
- **Lusion's** immersive WebGL artistry

### Core Design Principles

1. **Dark-First**: Deep charcoal/black canvas (#050508 to #0a0a0f) — not flat black, but layered with subtle gradients
2. **The Synclina Purple**: Gradient from #6D28D9 to #A855F7 to #D946EF — used as accent on dark, never overwhelming
3. **Glassmorphism with Restraint**: Frosted glass panels over the 3D particle background — backdrop-filter blur(16px), translucent borders with purple glow
4. **Typography as Identity**:
   - Headlines: **"Outfit"** or **"Space Grotesk"** — geometric, clean, wide
   - Body: **"Inter"** — crisp readability
   - Code/Technical: **"JetBrains Mono"** — for any technical showcases
5. **Motion with Purpose**: Every animation tells a story — particles react to scroll, products reveal on approach, the AI agent pulses with intelligence
6. **Grid Precision**: Ultra-fine dot-matrix or grid-line backgrounds (the "Vercel grid") communicating engineering rigor

### Color System

```css
/* Core */
--bg-primary:      #050508;    /* Near-black canvas */
--bg-secondary:    #0a0a0f;    /* Elevated surface */
--bg-card:         #12121a;    /* Card surface */
--bg-glass:        rgba(18, 18, 26, 0.6);  /* Glass panels */

/* Brand Gradient */
--gradient-start:  #6D28D9;    /* Deep violet */
--gradient-mid:    #A855F7;    /* Medium purple */
--gradient-end:    #D946EF;    /* Electric magenta */

/* Text */
--text-primary:    #F8FAFC;    /* Near-white */
--text-secondary:  #94A3B8;    /* Muted slate */
--text-muted:      #475569;    /* Very muted */

/* Accents */
--accent-glow:     rgba(168, 85, 247, 0.15);  /* Purple ambient glow */
--border-glass:    rgba(168, 85, 247, 0.2);    /* Glass border */
--border-subtle:   rgba(255, 255, 255, 0.06);  /* Hairline dividers */

/* Status (product-specific accents) */
--fuelsense:       #3B82F6;    /* Blue (automotive) */
--instagro:        #F472B6;    /* Pink (Instagram) */
--tripsync:        #10B981;    /* Green (travel) */
```

---

## 3. Technology Stack

### Core Framework

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **Next.js 15** (App Router) | SSR + SSG for SEO, React Server Components for performance, file-based routing |
| **3D Engine** | **React Three Fiber (R3F)** + **Drei** | React-native 3D — component-driven Three.js, seamless state integration |
| **Animation Engine** | **GSAP** + **ScrollTrigger** | Industry-standard timeline animations, scroll-driven storytelling, completely free |
| **Smooth Scroll** | **Lenis** | Buttery-smooth scroll locomotion, syncs with GSAP ticker |
| **UI Motion** | **Motion** (formerly Framer Motion) | Declarative React animations, layout transitions, gesture handling |
| **Styling** | **Vanilla CSS** (CSS Modules + Custom Properties) | Maximum control, no framework dependency, performant |
| **Typography** | **Google Fonts** (Outfit / Space Grotesk + Inter + JetBrains Mono) | Premium, modern typefaces |
| **AI Agent** | **assistant-ui** or **@openchatwidget/sdk** | Open-source agentic AI chat widget with streaming, tool-calling, and multi-step reasoning |
| **AI Backend** | **Vercel AI SDK** + **Google Gemini API** | Streaming responses, function calling, multi-model support |
| **3D Design Tool** | **Spline** (export to React) | Visual 3D scene design, embeddable components |
| **Icons** | **Lucide React** | Consistent, lightweight icon set |
| **Deployment** | **Vercel** | Zero-config Next.js deployment, edge functions, analytics |

### Key NPM Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "@react-three/fiber": "^9.x",
    "@react-three/drei": "^10.x",
    "three": "^0.170.x",
    "gsap": "^3.12.x",
    "lenis": "^1.x",
    "motion": "^12.x",
    "@splinetool/react-spline": "^4.x",
    "lucide-react": "^0.450.x",
    "ai": "^4.x",
    "@google/generative-ai": "^0.x"
  }
}
```

---

## 4. Architecture & Project Structure

```
synclina-website/
|-- public/
|   |-- fonts/                    # Self-hosted font files
|   |-- images/
|   |   |-- logos/                # Synclina logo variants (from SYNCLINA_LOGOS)
|   |   |-- products/            # Product screenshots and mockups
|   |   |-- og/                  # Open Graph images
|   |-- models/                  # .glb/.gltf 3D models
|   |-- favicon.ico
|
|-- src/
|   |-- app/                     # Next.js App Router pages
|   |   |-- layout.tsx           # Root layout (Lenis, ThreeBackground, nav, footer)
|   |   |-- page.tsx             # Landing / Home page
|   |   |-- products/
|   |   |   |-- page.tsx         # Products overview
|   |   |   |-- fuelsense/page.tsx
|   |   |   |-- instagro/page.tsx
|   |   |   |-- tripsync/page.tsx
|   |   |-- about/page.tsx       # About Synclina / Vision
|   |   |-- contact/page.tsx     # Contact form
|   |   |-- blog/page.tsx        # Blog / Updates (future)
|   |   |-- api/
|   |       |-- chat/route.ts    # AI Agent API route (Gemini)
|   |
|   |-- components/
|   |   |-- layout/
|   |   |   |-- Navbar.tsx       # Glassmorphic sticky navbar
|   |   |   |-- Footer.tsx       # Detailed footer
|   |   |   |-- PageTransition.tsx
|   |   |
|   |   |-- three/               # 3D / WebGL components
|   |   |   |-- ParticleField.tsx     # Ambient background particles
|   |   |   |-- LogoOrb.tsx           # Animated 3D logo sphere
|   |   |   |-- ProductShowcase.tsx   # 3D product device mockups
|   |   |   |-- NeuralNetwork.tsx     # AI neural network visualization
|   |   |   |-- ScrollCamera.tsx      # Scroll-linked camera movements
|   |   |
|   |   |-- sections/            # Page section components
|   |   |   |-- HeroSection.tsx       # Cinematic hero with 3D
|   |   |   |-- ProductsSection.tsx   # Product showcase cards
|   |   |   |-- VisionSection.tsx     # "Ideas in Sync" narrative
|   |   |   |-- TechStackSection.tsx  # Technology showcase
|   |   |   |-- TimelineSection.tsx   # Journey / roadmap
|   |   |   |-- CTASection.tsx        # Call-to-action
|   |   |   |-- TestimonialsSection.tsx
|   |   |
|   |   |-- ui/                  # Reusable UI primitives
|   |   |   |-- GlassCard.tsx
|   |   |   |-- GradientText.tsx
|   |   |   |-- MagneticButton.tsx    # Cursor-attracted buttons
|   |   |   |-- AnimatedCounter.tsx
|   |   |   |-- TypewriterText.tsx
|   |   |   |-- GridBackground.tsx    # Dot-matrix / grid pattern
|   |   |   |-- GlowOrb.tsx          # Ambient glow effects
|   |   |
|   |   |-- ai/                  # AI Agent components
|   |       |-- AgentWidget.tsx       # Floating AI chat widget
|   |       |-- AgentMessages.tsx     # Message rendering
|   |       |-- AgentTrigger.tsx      # Fab button trigger
|   |
|   |-- hooks/                   # Custom React hooks
|   |   |-- useScrollProgress.ts
|   |   |-- useSmoothScroll.ts
|   |   |-- useMousePosition.ts
|   |   |-- useInView.ts
|   |
|   |-- lib/                     # Utilities
|   |   |-- constants.ts
|   |   |-- animations.ts        # GSAP timeline presets
|   |   |-- ai.ts                # AI SDK configuration
|   |
|   |-- styles/
|       |-- globals.css          # Design system tokens + resets
|       |-- typography.css       # Font declarations + scale
|       |-- animations.css       # Keyframe definitions
|
|-- next.config.ts
|-- tsconfig.json
|-- package.json
|-- README.md
```

---

## 5. Page-by-Page Design Blueprint

### 5.1 — Landing Page (Home) "/"

The landing page is the showpiece. It must immediately communicate: **"This is a serious, ambitious technology brand."**

#### Section 1: Cinematic Hero (100vh)

- Full-viewport 3D particle field (R3F) — 5000+ particles in Synclina purple gradient, reacting to mouse position
- The Synclina logo "S" mark renders as a **glowing 3D wireframe orb** that slowly rotates, made of connected nodes (like a neural network)
- Text enters with staggered GSAP reveal — each letter fades up from below
- A **custom cursor** — a soft purple glow that follows the mouse
- Subtle grid-line overlay (1px rgba(255,255,255,0.03))
- Smooth Lenis scroll pulls you into the next section
- Two CTAs: **"Explore Our Products"** and **"Meet the AI"**
- Scroll indicator arrow at the bottom

#### Section 2: "Ideas in Sync" — Vision Statement (scroll-driven)

- GSAP ScrollTrigger pins the section, each word fades from opacity 0.1 to 1 as scroll progresses
- Text: "We don't just build apps. We build intelligent systems that understand your world and make it better."
- Behind the text, a Three.js neural network visualization shows nodes connecting — representing "ideas coming into sync"
- Purple gradient line traces form between nodes as you scroll deeper

#### Section 3: Products Showcase (the flagship section)

- Each product card is a **glassmorphic panel** with a subtle border glow in the product's accent color
- 3D phone mockups created in Spline or as CSS 3D transforms — showing actual app wireframe screenshots
- Cards **float up** from below as they enter the viewport (GSAP ScrollTrigger + stagger)
- Hover effect: card lifts (translateZ), border glow intensifies, phone mockup tilts toward cursor (parallax-fx style)
- Product-specific accent colors: FuelSense = blue glow, InstaGro = pink glow, TripSync = green glow
- Each card has: icon, product name, tagline, brief description, "Learn More" link

#### Section 4: Technology & AI DNA

- Tech capability cards with icon animations — each icon morphs/pulses on hover
- Four pillars: AI Copilot, Automation Engine, Real-time Analytics, Privacy First
- Animated counters: "3 Products", "50K+ Lines of Code", "700+ Tests", "0 Paid APIs"
- Numbers roll up when section enters viewport
- Behind: faint circuit-board pattern or flowing data streams

#### Section 5: Journey / Timeline

- Vertical timeline with a glowing purple progress line that fills as you scroll
- Milestones: Synclina Founded, FuelSense V2.0, InstaGro Development, TripSync In Progress, "More to come..."
- Each milestone node pulses with a subtle glow animation
- Timeline line draws itself (SVG path animation) via GSAP

#### Section 6: CTA + AI Agent Teaser

- "Have an idea? Let's build it together."
- Glassmorphic card teasing the AI agent: "Talk to Synclina AI — Ask about our products, technology, or vision."
- "Start a conversation" button opens the floating AI widget
- Secondary CTAs: Contact Us, Follow on Instagram

#### Section 7: Footer

- Full-width dark footer with grid layout
- Logo + tagline, quick links (Products, About, Contact, Blog), social links, product links
- "Built with love by Synclina" + copyright
- Subtle particle animation continues into footer

---

### 5.2 — Product Detail Pages (e.g., /products/fuelsense)

Each product gets its own immersive page:

**Hero:** Full-width 3D phone mockup or Spline scene showing the app's flagship screen with animations

**Feature Showcase (scroll-driven, alternating layout):**
- FuelSense: Digital Cockpit (gauges), Smart Analytics (charts), Safety System (emergency UI), AI Copilot (chat), Community (feed cards)
- InstaGro: Automation Workflow (flowchart), Analytics Dashboard (graphs), DM Auto-Replies (chat bubbles)
- TripSync: AI Trip Planner (itinerary cards), Hidden Spots (map pins), Buddy Finder (profile cards), Expense Tracker (split view)

**Wireframe Gallery:** Auto-scrolling horizontal carousel of actual wireframe screenshots from the project

**CTA:** "Download Coming Soon" / "View on GitHub" / "Get Notified"

Each product page uses its own accent color for glow effects.

---

### 5.3 — About Page (/about)
- Founder's story (personal, authentic — from the "Hey guys!" message energy)
- Vision and mission statement
- Values (Privacy, AI Ethics, Community, Open Ideas)
- "Join the Journey" CTA

### 5.4 — Contact Page (/contact)
- Glassmorphic contact form (name, email, message, category dropdown)
- Social media links (Instagram, GitHub, LinkedIn, Twitter/X)
- "Or just talk to our AI" — opens the agent widget

---

## 6. 3D Animations & Visual Effects

### 6.1 — Background Particle Field (Always Present)

- **Technology:** React Three Fiber + Custom Shader
- **Location:** Fixed behind all page content (z-index: 0)
- 5000 particles using GPU-optimized BufferGeometry
- Colors: Synclina purple gradient (violet to magenta)
- Additive blending for ethereal glow
- Particles slowly drift and rotate
- React to mouse position (subtle attraction)
- Scroll position influences particle density/speed
- Reduces count on mobile (2000 particles, lower DPR)

### 6.2 — Hero Logo Orb

- **Technology:** R3F + Custom Geometry
- **Location:** Hero section center
- A sphere made of connected nodes and edges — like a neural network
- Slowly rotates on Y and X axes
- Nodes pulse with purple glow
- Edges shimmer with traveling light
- On scroll down, the orb dissolves into the particle field
- On hover, rotation speed increases slightly

### 6.3 — Neural Network Visualization (Vision Section)

- **Technology:** R3F + GSAP ScrollTrigger
- Starts as scattered, disconnected nodes
- As user scrolls, nodes attract toward each other
- Connections (edges) form progressively
- At full scroll: a complete connected graph
- Represents "ideas coming into sync"

### 6.4 — Product Phone Mockups

- **Technology:** Spline (exported to React) OR CSS 3D transforms
- Floating phone devices showing actual app screenshots
- Float with subtle sine-wave bobbing
- Tilt toward cursor on hover (parallax)
- Rotate slightly on scroll (reveal different angles)
- Glow with product-specific accent color

### 6.5 — Scroll-Driven Text Reveals

- **Technology:** GSAP ScrollTrigger + SplitText
- Words/characters fade from dim (0.1 opacity) to full brightness
- Staggered character-by-character or word-by-word
- Creates a "reading spotlight" effect

### 6.6 — Magnetic Cursor & Buttons

- **Technology:** Custom hook (useMousePosition) + GSAP
- Custom purple glow cursor replaces default
- Buttons attract toward cursor when nearby (magnetic effect)
- Cursor morphs shape on hover (circle to rounded square)

### 6.7 — Page Transitions

- **Technology:** Motion (AnimatePresence) + Next.js
- Pages transition with a purple gradient wipe
- Content fades and slides simultaneously
- 3D canvas persists across routes (no re-mount)

### 6.8 — Ambient Glow Orbs

- **Technology:** CSS radial-gradient + animation
- Large, soft, blurred orbs of purple/blue scattered behind sections
- Slowly drift and pulse
- Parallax movement (move slower than scroll)
- Creates depth without GPU cost

---

## 7. Agentic AI Integration

### The "Synclina AI" — An Intelligent Brand Assistant

This is not a basic chatbot. It's an **agentic AI** that understands Synclina's products, vision, and technology deeply.

### Architecture

```
FRONTEND
  |
  |-- AI Agent Widget (assistant-ui / custom)
  |     - Floating FAB (bottom-right)
  |     - Glassmorphic chat panel
  |     - Streaming markdown responses
  |     - Typing indicators
  |     - Suggested questions
  |     - Rich cards for products
  |
  |-- Streaming API call
  |
  v
  
  Next.js API Route (/api/chat/route.ts)
    - Vercel AI SDK
    - System prompt with brand context + product knowledge
    - Google Gemini API (Gemini 2.0 Flash)
    - Streaming responses
    - Rate limiting
```

### What Synclina AI Can Do:

1. **Answer questions about products**: "What is FuelSense?" — Detailed, accurate response about the vehicle management app
2. **Explain technology choices**: "Why Flutter?" — Contextual answer about cross-platform strategy
3. **Discuss the vision**: "What is Synclina's mission?" — Passionate, authentic response
4. **Guide navigation**: "Show me your products" — Links to product pages with rich cards
5. **Handle collaboration inquiries**: "I have a product idea" — Routes to contact or collects the idea
6. **Technical Q&A**: "What AI models do you use?" — Detailed breakdown

### System Prompt (Knowledge Base):

The AI agent receives a comprehensive system prompt containing:
- Full brand story and tagline
- Detailed descriptions of all 3 products (FuelSense, InstaGro, TripSync)
- Technology stack information
- Privacy and ethics stance
- Founder's personality (enthusiastic, community-driven, ambitious)
- Instructions to be helpful but honest about early-stage status

### Widget Design:

- Glassmorphic header with Synclina AI branding and the purple "S" icon
- Welcome message with greeting and capability overview
- Three suggested question pills: "What is FuelSense?", "Tell me about Synclina", "I have a project idea"
- Text input with send button at the bottom
- Streaming responses with markdown rendering
- Expandable/collapsible via floating action button

---

## 8. GitHub Repos & Resources to Leverage

### 3D & WebGL
| Repo / Tool | Purpose |
|-------------|---------|
| **pmndrs/react-three-fiber** | React renderer for Three.js — core 3D engine |
| **pmndrs/drei** | Pre-built R3F components (Text, Effects, Controls) |
| **pmndrs/postprocessing** | GPU-efficient post-processing effects (bloom, chromatic aberration) |
| **splinetool/react-spline** | Import Spline 3D scenes directly into React |
| **theatre-dev/theatre** | Visual keyframe animation editor for 3D scenes |

### Animation & Scroll
| Repo / Tool | Purpose |
|-------------|---------|
| **gsap/gsap** | Timeline animations + ScrollTrigger (free for all uses!) |
| **darkroomengineering/lenis** | Smooth scroll locomotion synced with GSAP |
| **motiondivision/motion** | Declarative React animations, layout transitions, exit animations |

### UI & Effects
| Repo / Tool | Purpose |
|-------------|---------|
| **tristanjung1006/glintkit** | WebGL-ready UI components with glassmorphism |
| **studygeorge/parallax-fx** | Zero-dep parallax + tilt effects for product cards |
| **volkansah/ai-hub** | Obsidian Glass UI design system reference for dark glassmorphism |

### AI Agent
| Repo / Tool | Purpose |
|-------------|---------|
| **Yonom/assistant-ui** | Premier open-source AI agent frontend library for React |
| **openchatwidget/sdk** | Embeddable AI chat widget with MCP + tool-calling support |
| **vercel/ai** | Vercel AI SDK for streaming AI responses |

### Fonts
| Font | Usage | Source |
|------|-------|--------|
| **Outfit** | Headlines, hero text | Google Fonts |
| **Space Grotesk** | Alternative headlines | Google Fonts |
| **Inter** | Body text | Google Fonts |
| **JetBrains Mono** | Code, technical details | Google Fonts |

---

## 9. Performance Optimization Strategy

### Critical Performance Rules

1. **Unified RAF Loop**: Lenis, GSAP, and Three.js share a single requestAnimationFrame via GSAP's ticker — no competing loops
2. **Dynamic DPR Capping**: dpr={[1, 2]} on R3F Canvas — prevents 4x rendering on Retina displays
3. **Particle Count Scaling**: Desktop = 5000, Tablet = 3000, Mobile = 1500
4. **Lazy 3D Loading**: Three.js Canvas components are next/dynamic with ssr: false
5. **Viewport Culling**: Pause Three.js render loop when canvas is not visible (IntersectionObserver)
6. **CSS-only where possible**: Ambient glow orbs, grid backgrounds, and simple hover effects use CSS transforms/opacity only — no JS
7. **Image Optimization**: All images through next/image with WebP/AVIF, responsive srcsets
8. **Font Loading**: font-display: swap, preload critical fonts, subset to used characters
9. **Code Splitting**: Each product page is a separate route chunk, R3F components are dynamic imports
10. **GSAP Cleanup**: All ScrollTrigger instances are properly killed on unmount via useGSAP hook

### Target Metrics
| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |

---

## 10. SEO & Analytics Strategy

### On-Page SEO
- **Title Tags**: "Synclina — Ideas in Sync | AI-Powered Products for Everyday Life"
- **Meta Descriptions**: Unique per page, compelling, under 155 chars
- **Structured Data**: Organization, Product, SoftwareApplication schemas
- **Heading Hierarchy**: Single h1 per page, logical h2 through h6 structure
- **Semantic HTML**: header, main, section, article, footer elements
- **Open Graph + Twitter Cards**: Custom OG images per page (generated)
- **Sitemap**: Auto-generated via Next.js next-sitemap
- **Robots.txt**: Allow all crawlers
- **Canonical URLs**: Self-referencing canonicals on every page

### Analytics
- **Vercel Analytics**: Built-in Web Vitals + page views
- **Vercel Speed Insights**: Real-user performance monitoring
- **Google Search Console**: Index monitoring, search performance

---

## 11. Phased Implementation Timeline

### Phase 1: Foundation (Days 1-2)
> **Goal**: Project setup, design system, and core infrastructure

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Set up CSS design system (tokens, colors, typography, spacing)
- [ ] Configure Google Fonts (Outfit, Inter, JetBrains Mono)
- [ ] Create root layout with Lenis smooth scroll integration
- [ ] Build GridBackground component (dot-matrix pattern)
- [ ] Build GlassCard, GradientText, MagneticButton primitives
- [ ] Set up GSAP + ScrollTrigger with Lenis synchronization
- [ ] Create responsive navigation (glassmorphic Navbar)
- [ ] Create Footer component

### Phase 2: 3D & Visual Layer (Days 3-4)
> **Goal**: Three.js background, hero animations, visual effects

- [ ] Set up R3F Canvas as persistent background layer
- [ ] Build ParticleField component (5000 particles, mouse reactive)
- [ ] Build LogoOrb component (neural network sphere)
- [ ] Create ambient GlowOrb CSS components
- [ ] Build scroll-driven text reveal system (GSAP SplitText)
- [ ] Implement custom cursor with magnetic effect
- [ ] Create page transition animations (Motion AnimatePresence)
- [ ] Mobile fallbacks (reduced particles, no cursor effects)

### Phase 3: Landing Page Sections (Days 5-7)
> **Goal**: Complete home page with all sections

- [ ] Build HeroSection with 3D logo orb + particle field + text reveals
- [ ] Build VisionSection with neural network graph visualization
- [ ] Build ProductsSection with glass cards + hover parallax effects
- [ ] Generate product mockup images for showcase cards
- [ ] Build TechStackSection with animated counters + capability cards
- [ ] Build TimelineSection with scroll-drawing progress line
- [ ] Build CTASection with AI agent teaser
- [ ] Wire up full scroll narrative (GSAP timeline chaining)

### Phase 4: Product Pages (Days 8-10)
> **Goal**: Individual product detail pages with immersive showcases

- [ ] Create shared ProductPage layout component
- [ ] Build FuelSense detail page
  - [ ] Wireframe gallery (auto-scroll carousel of actual wireframes)
  - [ ] Feature sections with parallax mockups
  - [ ] Animated stats (38 screens, 700+ tests, etc.)
- [ ] Build InstaGro detail page
  - [ ] Automation workflow visualization
  - [ ] Instagram-style feature showcase
- [ ] Build TripSync detail page
  - [ ] Trip planning flow visualization
  - [ ] Map-style interface showcase
- [ ] Spline 3D scenes for product heroes (or CSS 3D phone mockups)

### Phase 5: AI Agent Integration (Days 11-12)
> **Goal**: Functional agentic AI chatbot on the website

- [ ] Set up Gemini API / Vercel AI SDK in Next.js API route
- [ ] Write comprehensive system prompt with full brand + product knowledge
- [ ] Build glassmorphic AI chat widget (floating FAB to expandable panel)
- [ ] Implement streaming message rendering
- [ ] Add suggested questions carousel
- [ ] Add rich card responses for product queries
- [ ] Rate limiting and error handling
- [ ] Mobile-responsive chat panel

### Phase 6: About & Contact Pages (Day 13)
> **Goal**: Supporting pages

- [ ] Build About page (founder story, vision, values)
- [ ] Build Contact page (glassmorphic form, social links)
- [ ] Connect contact form to email service or API

### Phase 7: Polish & Optimization (Days 14-15)
> **Goal**: Performance, SEO, accessibility, and final touches

- [ ] Lighthouse audit and performance optimization
- [ ] SEO implementation (meta tags, structured data, sitemap)
- [ ] Accessibility audit (keyboard nav, screen readers, contrast)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness audit (320px to 1920px+)
- [ ] Reduce-motion media query support (respect user preferences)
- [ ] OG image generation for social sharing
- [ ] Final content review and copywriting polish
- [ ] Loading states and skeleton screens

### Phase 8: Deployment & Launch (Day 16)
> **Goal**: Ship it!

- [ ] Deploy to Vercel
- [ ] Configure custom domain (if available)
- [ ] Set up Vercel Analytics + Speed Insights
- [ ] Submit to Google Search Console
- [ ] Social media launch assets
- [ ] Final smoke test on production

---

## 12. Deployment & Infrastructure

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Hosting, CDN, Edge Functions, Analytics | Free (Hobby) / $20/mo (Pro) |
| **Google Gemini API** | AI Agent backend (Gemini 2.0 Flash) | Free tier (60 RPM) |
| **Google Fonts** | Typography | Free |
| **Spline** | 3D scene design + export | Free tier available |
| **GitHub** | Source code, CI/CD (Vercel auto-deploy on push) | Free |

### Environment Variables
```
GOOGLE_GENERATIVE_AI_API_KEY=  # Gemini API for the AI agent
NEXT_PUBLIC_SITE_URL=          # Production URL
```

---

## Summary

The Synclina website will be a **cinematic, immersive experience** that:

1. **Opens with a breathtaking 3D particle field** and glowing neural-network logo orb
2. **Tells the brand story through scroll-driven animations** — text reveals, connecting nodes, timeline progress
3. **Showcases 3 flagship products** with glassmorphic cards, parallax phone mockups, and deep-dive detail pages
4. **Features an intelligent AI agent** that visitors can talk to about products, technology, and collaboration
5. **Runs at 60fps** with optimized Three.js rendering, Lenis smooth scroll, and GSAP-driven choreography
6. **Ranks well on Google** with full SSR, semantic HTML, and structured data
7. **Reflects the brand perfectly** — purple gradient identity, "Ideas in Sync" philosophy, ambitious-yet-authentic energy

> **This is not a landing page. This is a statement.**
> *"Just getting started. A lot more to come."*
