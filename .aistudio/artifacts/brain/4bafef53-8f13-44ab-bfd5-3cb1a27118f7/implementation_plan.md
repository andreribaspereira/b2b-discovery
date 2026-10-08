# B2B Sales Intelligence & Discovery Briefing Generator

A specialized sales intelligence workspace for B2B Closers and Account Executives that generates executive discovery briefings, SPIN-framework cold emails, and tailored LinkedIn outreach messages, backed by persistent local storage to review and manage previous briefings.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following confirmed decisions guide the implementation of the briefing engine and storage workflow:

- **Confirmed Decision 1: Persistent Local Storage (User Request)**: Every generated briefing will be automatically preserved in browser `localStorage` with full metadata (timestamp, lead name, company, role, theme, and full outputs #1, #2, and #3), complete with a dedicated saved briefings drawer/sidebar, search filter, and 1-click restore/delete actions.
- **Confirmed Decision 2: Strict 3-Stage Pipeline Compliance (Updated with Section D Objection Handling)**:
  - **Output #1 (Relatório Estratégico de Discovery)**:
    - **A. Perfil da Empresa**: Setor, tamanho estimado, principais produtos/serviços e posicionamento de mercado.
    - **B. Análise de Dores Prováveis**: 3 maiores desafios enfrentados pelo Lead e empresa com base no cargo, setor e tema.
    - **C. Insights sobre o Lead**: Esfera de influência na tomada de decisão (Influenciador, Decisor, Técnico ou Campeão) e justificativa comportamental.
    - **D. "The Elephant in the Room" & Resposta à Objeção**:
      - Identificação do ponto cego crítico ou objeção oculta ao contratar solução externa relacionada ao tema.
      - **Resposta Estratégica à Objeção**: Argumento e técnica consultiva de alta performance para desarmar e reenquadrar a objeção durante a reunião de Discovery.
    - **E. 3 Perguntas de Poder**: Perguntas abertas e provocativas para o roteiro de Discovery que evidenciam o custo da inação.
  - **Output #2 (Email SPIN Estratégico)**: Strict formatting (`**Assunto:** ...` and `**Email:** ...`), SPIN reasoning (Situação/Problema, Implicação, Necessidade), consultive and humanized tone, under 200 words, Portuguese (BR).
  - **Output #3 (Mensagem LinkedIn)**: Direct, consultative, under 500 characters (~100 words), low-friction CTA, positioned immediately following Output #2.
- **Confirmed Decision 3: Server-Side Gemini 3.8 Flash Intelligence**: Secure server endpoint (`/api/generate-briefing`) utilizing `@google/genai` on Node.js/Express with real-time web search enrichment to identify market trends, current challenges, and company positioning.
- **Confirmed Decision 4: Rapid Presets & Productivity**: Pre-configured test cases (e.g. Fintech CTO, SaaS VP of Sales, Retail Supply Chain Director) for instant testing, along with 1-click clipboard copy (with animated feedback) and Markdown export.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms four mandatory lead inputs (`Lead Name`, `Company / Website`, `Lead Role`, and `Theme / Product Offered`) into an actionable, high-performance sales preparation dossier and outreach assets.
- **Target Audience / Persona**: High-ticket B2B Closers, Account Executives (AEs), Sales Development Reps (SDRs), and Sales Directors preparing for crucial discovery calls and personalized prospecting.
- **Key Value**: Eliminates 45+ minutes of manual pre-call research per prospect, surfaces hidden psychological objections before the call along with ready-to-use objection turnaround answers, and drafts ready-to-send omnichannel outreach (email + LinkedIn) aligned with SPIN selling principles.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Intake & Validation**: User inputs the 4 mandatory fields. Real-time validation checks for completeness. One-click preset buttons allow quick loading of realistic enterprise prospect scenarios.
2. **Analysis & Generation**: Visual status stepper reveals progress:
   - Step 1: Company Intelligence & Market Context Enrichment
   - Step 2: Discovery Briefing, Objection Diagnosis & Power Questions Synthesis
   - Step 3: SPIN Email & LinkedIn Outreach Generation
3. **Executive Dossier View**: Clean, high-contrast tabbed presentation:
   - **Tab 1: Relatório de Discovery (Output #1)**:
     - Company Profile matrix (Sector, Size, Value Prop, Market Stance).
     - 3 Core Probable Pains breakdown.
     - Sphere of Influence badge & behavioral analysis.
     - **"Elephant in the Room" Card**: Displays the hidden friction/objection alongside an actionable "Como Responder e Reenquadrar" (consultative pivot script).
     - 3 Power Questions on Cost of Inaction.
   - **Tab 2: Email Comercial SPIN (Output #2)** — Formatted subject and body with word counter indicator (guaranteed < 200 words) and 1-click copy.
   - **Tab 3: Mensagem LinkedIn (Output #3)** — Character-counted display (guaranteed < 500 chars) with 1-click copy.
   - **Tab 4: Visão Unificada / Markdown Completo** — Full briefing formatted in Markdown for CRM pasting or exporting.
4. **Saved Briefings Library (LocalStorage Drawer)**:
   - Floating/sidebar drawer listing past briefings sorted by date.
   - Quick search by lead name, company, or role.
   - Instant restore to inspect or copy past outreach materials.
   - Export all briefings as JSON or delete individual entries.

#### Visual Identity & Theme
- **Domain Aesthetic**: Refined B2B Executive Sales Intelligence workspace. Slate and obsidian background (`#090D16` to `#0F172A`), crisp hairline borders (`border-slate-800`), and warm amber/emerald accents for key discovery levers.
- **Zero-Pill Discipline**: Metadata rendered with clean unboxed typographic separators (`Lead · VP de Vendas · Empresa`). No pill badge sandwiches.
- **Tabular Figures**: Word counts, character meters, and timestamps formatted with tabular numbers (`tabular-nums font-mono`).
- **Responsive Layout**: Desktop 1440px multi-column layout (intake sidebar + briefing canvas + saved history drawer) that gracefully adapts to mobile touch devices.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side LocalStorage with Resilient State Sync**
  - *Chosen Approach*: Store briefings in browser `localStorage` under a versioned schema (`lead_briefings_v1`), backed by React state and custom storage hooks.
  - *Why*: Instant offline retrieval, zero latency, privacy for confidential lead notes, and direct alignment with the user's explicit request.
  - *Alternatives Considered*: Cloud database was not requested and would require authentication friction.
- **Decision 2: Server-Side Gemini Execution via Express/Vite Integration**
  - *Chosen Approach*: Secure server-side endpoint `/api/generate-briefing` powered by `@google/genai` and `gemini-3.8-flash` with web search capability for context enrichment.
  - *Why*: Complies with AI Studio security rules (never expose API keys on the client) and handles complex multi-turn prompting in a single reliable request.
- **Decision 3: Strict Template Enforcement via Structured Schema**
  - *Chosen Approach*: The server prompt directs Gemini to produce structured JSON matching all required sections (A-E with both Objection diagnosis and strategic counter-response, Email subject/body, LinkedIn text), which the client renders with tailored UI cards while maintaining raw copy-paste Markdown compatibility.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Frontend (React 19)                              │
│                                                                             │
│  ┌───────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │ Lead Intake Form      │  │ Executive Dossier   │  │ Saved History     │  │
│  │ - 4 Mandatory Fields  │  │ - Output #1 Report  │  │ - LocalStorage    │  │
│  │ - Scenario Presets    │  │   (Inc. Resposta D) │  │ - Search & Filter │  │
│  │ - Validation Watcher  │  │ - Output #2 Email   │  │ - 1-Click Restore │  │
│  └───────────┬───────────┘  │ - Output #3 LinkedIn│  └─────────▲─────────┘  │
│              │              └──────────▲──────────┘            │            │
│              │                         │                       │            │
│              │ POST /api/generate-briefing                     │            │
│              ▼                         │                       │            │
│  ┌─────────────────────────────────────┴───────────────────────┴──────────┐  │
│  │                    useBriefingStorage Hook (localStorage)             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ HTTP
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Node.js / Express Backend Proxy                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Endpoint: POST /api/generate-briefing                                 │  │
│  │ - Validates: leadName, company, role, theme                           │  │
│  │ - Calls: @google/genai (model: gemini-3.8-flash)                      │  │
│  │ - Tools: googleSearch for real-time context enrichment                │  │
│  │ - Generates: Report (A-E incl. Elephant & Resposta) + Email + LinkedIn │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Data Model (`BriefingItem`)
```typescript
interface BriefingItem {
  id: string;
  createdAt: string;
  inputs: {
    leadName: string;
    company: string;
    role: string;
    theme: string;
  };
  output1: {
    empresaPerfil: {
      setor: string;
      tamanhoEstimado: string;
      principaisProdutos: string;
      posicionamento: string;
    };
    doresProvaveis: string[]; // 3 maiores desafios
    insightsLead: {
      esferaInfluencia: 'Influenciador' | 'Decisor' | 'Técnico' | 'Campeão';
      justificativa: string;
    };
    elephantInTheRoom: {
      objecaoPontoCego: string; // Ponto cego / objeção oculta comum
      respostaEstrategica: string; // Argumento de desarmamento e reenquadramento consultivo
    };
    perguntasDePoder: string[]; // 3 perguntas abertas sobre custo da inação
  };
  output2: {
    assunto: string;
    corpoEmail: string; // <= 200 palavras, formato estrito
    spinAnalysis: {
      situacaoProblema: string;
      implicacao: string;
      necessidadeSolucao: string;
    };
    wordCount: number;
  };
  output3: {
    mensagemLinkedin: string; // < 500 caracteres
    charCount: number;
  };
  rawMarkdown: string; // Versão completa para exportação
}
```
