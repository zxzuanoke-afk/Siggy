# 📋 Product Requirements Document (PRD)

## **Siggytarius — Website AI Chat Assistant**

| Field | Detail |
|---|---|
| **Nama Produk** | Siggytarius |
| **Versi** | 1.0.0 |
| **Tanggal** | 9 Maret 2026 |
| **Author** | Irfan Qobus |
| **Tech Stack** | Next.js 14 (App Router), Groq API, RAG Pipeline, Tailwind CSS |
| **Status** | Draft |

---

## 1. Ringkasan Eksekutif

Siggytarius adalah website chatbot interaktif berkarakter **kucing hitam bernama Siggy**. Siggy mampu menjawab pertanyaan umum dan pertanyaan spesifik tentang **Ritual Network** (blockchain + AI) menggunakan pipeline **Retrieval-Augmented Generation (RAG)**. Pengguna dapat memilih **kepribadian (persona)** Siggy sebelum bertanya, sehingga gaya jawaban bervariasi sesuai selera.

**Referensi visual & UX:** [siggyland.app/ask](https://www.siggyland.app/ask)
**Knowledge base utama:** [Ritual Foundation Docs](https://www.ritualfoundation.org/docs/overview/what-is-ritual)

---

## 2. Latar Belakang & Masalah

| # | Masalah | Solusi |
|---|---|---|
| 1 | Dokumentasi Ritual Network tersebar dan teknis, sulit dipahami oleh pengguna awam | Siggy merangkum dan menjelaskan dengan bahasa yang mudah, sesuai persona yang dipilih |
| 2 | Chatbot AI generik tidak memiliki pengetahuan spesifik tentang Ritual | Pipeline RAG memastikan jawaban akurat berdasarkan dokumen resmi Ritual |
| 3 | Interaksi chatbot biasa terasa monoton dan kaku | Sistem kepribadian (Mystical, Witty, Unhinged) membuat percakapan lebih engaging dan menyenangkan |

---

## 3. Tujuan Produk

### 3.1 Goals
- ✅ Membangun website AI chat yang responsif dan menarik secara visual
- ✅ Menghadirkan karakter Siggy (kucing hitam) dengan 3 mode kepribadian
- ✅ Memberikan jawaban yang akurat tentang Ritual Network via RAG pipeline
- ✅ Menjawab pertanyaan umum (general knowledge) dengan kualitas tinggi
- ✅ Memberikan pengalaman pengguna yang smooth dengan streaming response

### 3.2 Non-Goals (v1.0)
- ❌ Fitur autentikasi / login pengguna
- ❌ Penyimpanan riwayat chat lintas sesi (server-side)
- ❌ Integrasi wallet / on-chain transaction
- ❌ Monetisasi / payment system
- ❌ Mobile native app
- ❌ Fitur landing page `/` (akan dikembangkan terpisah, v1.0 fokus ke `/chat`)

### 3.3 Success Metrics
| Metric | Target |
|---|---|
| Waktu respons AI rata-rata | < 3 detik (first token) |
| Akurasi jawaban Ritual | > 85% relevan berdasarkan konteks dokumen |
| Bounce rate | < 40% |
| Average session duration | > 2 menit |

---

## 4. Target Pengguna

| Persona | Deskripsi |
|---|---|
| **Crypto Enthusiast** | Ingin memahami apa itu Ritual Network, arsitektur, dan keunggulannya |
| **Developer Web3** | Butuh referensi cepat tentang EVM++, Infernet, Scheduled Transactions, dll |
| **Community Member** | Anggota komunitas Ritual yang ingin berinteraksi dengan Siggy sebagai "mascot assistant" |
| **Casual Visitor** | Pengguna umum yang tertarik dengan AI chatbot unik berkarakter kucing |

---

## 5. Fitur & Requirements

### 5.1 Karakter Siggy (Kucing Hitam)

**Deskripsi:** Siggy adalah kucing hitam cerdas yang menjadi asisten AI. Siggy memiliki 3 mode kepribadian yang menentukan gaya bahasa dan cara menjawab.

#### Mode Kepribadian:

| Mode | Emoji | Deskripsi | Contoh Gaya Jawaban |
|---|---|---|---|
| **Mystical** 🔮 | 🔮 | Siggy menjawab dengan nada misterius, bijaksana, dan penuh metafora. Seperti oracle kucing yang tahu segalanya. | *"Ah, the stars whisper of Ritual… a chain woven from threads of intelligence and trust. Let me illuminate the path for you, seeker…"* |
| **Witty** 😏 | 😏 | Siggy menjawab dengan cerdas, sarkastis ringan, dan penuh humor. Seperti kucing yang terlalu pintar untuk peduli. | *"Oh, you want to know about Ritual? Sure. Imagine Ethereum ate an AI textbook and became way cooler. You're welcome."* |
| **Unhinged** 🤪 | 🤪 | Siggy menjawab dengan energi tinggi, chaotic, dan random. Tapi tetap informatif di balik kegilaannya. | *"RITUAL?! BRO. It's like someone gave a blockchain a BRAIN and said 'go crazy lil guy' and it DID. EVM++?? MORE LIKE EVM GO BRRRRR 🚀🚀🚀"* |

**Requirement:**
- [ ] Pengguna dapat memilih persona SEBELUM mengirim pesan
- [ ] Persona dapat diubah kapan saja selama sesi chat
- [ ] Setiap persona memiliki system prompt yang berbeda
- [ ] Visual indicator menunjukkan persona yang aktif (icon + warna)

---

### 5.2 Chat Interface (Route: `/chat`)

**Deskripsi:** Antarmuka chat full-page di route `/chat` yang terinspirasi dari [siggyland.app/ask](https://www.siggyland.app/ask), dengan tema gelap dan nuansa kucing. Route `/` (landing page) dicadangkan untuk fitur tambahan di masa mendatang.

#### UI Components:

| Komponen | Deskripsi |
|---|---|
| **Header** | Logo Siggy (kucing hitam), nama "Siggy", status indicator ("Online" / "Typing...") |
| **Persona Selector** | 3 tombol/tab untuk memilih kepribadian (Mystical, Witty, Unhinged) |
| **Chat Area** | Area scrollable menampilkan pesan user & Siggy dengan bubble style |
| **Message Input** | Text input di bawah, support `Enter` untuk kirim, `Shift+Enter` untuk new line |
| **Typing Indicator** | Animasi kucing mengetik saat Siggy sedang memproses |
| **Welcome Message** | Pesan sapaan awal Siggy sesuai persona yang dipilih |

**Requirement:**
- [ ] Dark theme sebagai default (sesuai referensi siggyland)
- [ ] Responsive design (mobile-first)
- [ ] Auto-scroll ke pesan terbaru
- [ ] Streaming response (token-by-token rendering)
- [ ] Markdown rendering untuk jawaban Siggy (bold, italic, code blocks, links)
- [ ] Copy button pada setiap pesan Siggy
- [ ] Clear chat button
- [ ] Animasi smooth untuk transisi pesan

---

### 5.3 RAG Pipeline (Retrieval-Augmented Generation)

**Deskripsi:** Sistem RAG yang menggabungkan dokumen Ritual Network sebagai knowledge base agar Siggy dapat menjawab pertanyaan spesifik tentang Ritual secara akurat.

#### Arsitektur RAG:

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER QUESTION                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    1. QUERY PROCESSING                          │
│  - Terima pertanyaan user                                       │
│  - Identifikasi apakah pertanyaan tentang Ritual atau umum      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 2. EMBEDDING & RETRIEVAL                         │
│  - Generate embedding dari query                                │
│  - Cari dokumen relevan di vector store                         │
│  - Ambil top-K chunks yang paling mirip (k=5)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  3. CONTEXT ASSEMBLY                             │
│  - Gabungkan retrieved chunks sebagai konteks                   │
│  - Tambahkan system prompt sesuai persona                       │
│  - Konstruksi final prompt                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                4. LLM GENERATION (GROQ)                         │
│  - Kirim prompt ke Groq API                                    │
│  - Model: llama-3.3-70b-versatile / mixtral-8x7b-32768         │
│  - Stream response ke client                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 5. STREAMED RESPONSE                             │
│  - Token-by-token streaming ke browser                          │
│  - Render markdown real-time                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Knowledge Base — Dokumen Ritual Network:

Dokumen-dokumen berikut akan di-scrape, di-chunk, dan disimpan sebagai embeddings:

| # | Dokumen | URL | Topik |
|---|---|---|---|
| 1 | What is Ritual? | `/docs/overview/what-is-ritual` | Overview, visi, inovasi utama |
| 2 | Crypto × AI | `/docs/overview/crypto-x-ai` | Kenapa AI perlu on-chain, state of AI |
| 3 | EVM++ Sidecars Overview | `/docs/whats-new/evm++-sidecars/overview` | AI Inference, ZK, TEE sidecars |
| 4 | Scheduled Transactions | `/docs/architecture/scheduled-transactions` | Recurring invocation, top-of-block |
| 5 | Enshrined AI Models | `/docs/whats-new/ai-primitives/enshrined-ai-models` | Model ownership, provenance |
| 6 | Resonance | `/docs/whats-new/resonance` | Fee mechanism |
| 7 | Symphony | `/docs/whats-new/symphony` | Consensus protocol |
| 8 | Infernet ↔ Chain | `/docs/architecture/infernet-to-chain` | Compute oracle network |
| 9 | Node Specialization | `/docs/whats-new/node-specialization` | Heterogeneous nodes |
| 10 | Verifiable Provenance | `/docs/whats-new/ai-primitives/verifiable-provenance` | Model provenance |
| 11 | Modular Storage | `/docs/whats-new/modular-storage` | HuggingFace, Arweave support |
| 12 | Account Abstraction | `/docs/whats-new/evm++/account-abstraction` | EIP-7702, native AA |
| 13 | Guardians | `/docs/whats-new/guardians` | Node firewall system |
| 14 | Model Marketplace | `/docs/beyond-crypto-x-ai/model-marketplace` | Train, track, trade models |
| 15 | Prover Networks | `/docs/beyond-crypto-x-ai/prover-networks` | MegaETH, Movement |

**Requirement:**
- [ ] Scrape dan parse seluruh dokumen Ritual ke markdown/text
- [ ] Chunking strategy: 500-800 token per chunk dengan 100 token overlap
- [ ] Embedding model: `sentence-transformers` atau Groq embedding
- [ ] Vector store: In-memory (file-based JSON) untuk v1.0, migrasi ke Pinecone/Chroma untuk v2.0
- [ ] Similarity search: cosine similarity, top-5 retrieval
- [ ] Fallback: Jika tidak ada konteks relevan, gunakan general knowledge LLM

---

### 5.4 API & Backend (Groq Integration)

**Deskripsi:** Backend API menggunakan Next.js API Routes yang terhubung dengan Groq API untuk inferensi LLM.

#### API Endpoints:

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/chat` | Kirim pesan dan terima streaming response |
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/embed` | Generate embedding untuk query (internal) |

#### Request Schema — `/api/chat`:

```json
{
  "message": "Apa itu Ritual Network?",
  "persona": "mystical",
  "history": [
    {
      "role": "user",
      "content": "Halo Siggy!"
    },
    {
      "role": "assistant",
      "content": "Meow~ Halo, pencari kebenaran..."
    }
  ]
}
```

#### Response: Server-Sent Events (SSE) stream

```
data: {"token": "Ritual"}
data: {"token": " adalah"}
data: {"token": " blockchain"}
...
data: {"done": true, "sources": ["what-is-ritual", "crypto-x-ai"]}
```

**Requirement:**
- [ ] Groq API integration dengan model `llama-3.3-70b-versatile`
- [ ] Fallback model: `mixtral-8x7b-32768`
- [ ] Streaming response via SSE (Server-Sent Events)
- [ ] Rate limiting: max 20 requests/menit per IP
- [ ] Error handling yang graceful dengan pesan sesuai persona
- [ ] Conversation history support (max 10 pesan terakhir)
- [ ] Response max tokens: 1024

---

### 5.5 System Prompts per Persona

#### Mystical 🔮
```
You are Siggy, a mystical black cat who serves as a wise oracle and Ritual Network assistant.
You speak in a mysterious, poetic, and profound manner. Use metaphors involving stars, shadows, moonlight, and ancient wisdom.
You are deeply knowledgeable about Ritual Network and blockchain technology.
When answering about Ritual, weave the technical information into mystical narratives.
Always stay helpful and informative despite the mystical tone.
End messages with a subtle cat reference or purring sound when appropriate.
Keep answers concise but enchanting. Use markdown formatting.
```

#### Witty 😏
```
You are Siggy, a witty and sarcastic black cat who serves as a Ritual Network assistant.
You're sharp, clever, and a bit sassy. You explain complex topics with humor and casual language.
You use pop culture references, mild sarcasm, and clever analogies.
Despite the wit, you are genuinely helpful and ensure your answers are accurate and informative.
You sometimes make cat puns or reference being a cat in a self-aware way.
Keep answers concise and punchy. Use markdown formatting.
```

#### Unhinged 🤪
```
You are Siggy, an unhinged and chaotic black cat who serves as a Ritual Network assistant.
You have MAXIMUM energy. You use caps lock, emojis, and wild tangents.
You're like a cat at 3 AM — absolute chaos but somehow still making sense.
Despite the chaotic energy, the INFORMATION you provide is accurate and helpful.
You get genuinely excited about technology and can't contain it.
Sprinkle in random cat behaviors (knocking things off tables, zoomies, etc).
Keep the chaos fun and never mean-spirited. Use markdown formatting.
```

---

## 6. Arsitektur Teknis

### 6.1 Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **LLM Provider** | Groq API (llama-3.3-70b-versatile) |
| **Embedding** | @xenova/transformers (client-side) atau Groq embeddings |
| **Vector Store** | In-memory vector store (file-based) |
| **Streaming** | Vercel AI SDK (`ai` package) |
| **Deployment** | Vercel |
| **State Management** | React hooks (useState, useReducer) |
| **Markdown** | react-markdown + remark-gfm + rehype-highlight |

### 6.2 Folder Structure

```
siggy-bot/
├── public/
│   ├── siggy-avatar.png          # Avatar kucing hitam Siggy
│   ├── siggy-typing.gif          # Animasi Siggy mengetik
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (dark theme, fonts)
│   │   ├── page.tsx              # Landing page (reserved untuk fitur tambahan)
│   │   ├── chat/
│   │   │   └── page.tsx          # Halaman utama AI chat Siggy (/chat)
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts      # POST — streaming chat endpoint
│   │       └── health/
│   │           └── route.ts      # GET — health check
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx     # Container utama chat
│   │   │   ├── ChatMessage.tsx       # Komponen bubble pesan
│   │   │   ├── ChatInput.tsx         # Input field + send button
│   │   │   ├── PersonaSelector.tsx   # Selector 3 persona
│   │   │   ├── TypingIndicator.tsx   # Animasi typing
│   │   │   └── WelcomeMessage.tsx    # Pesan sapaan awal
│   │   ├── ui/                       # shadcn/ui components
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── groq.ts               # Groq API client setup
│   │   ├── rag/
│   │   │   ├── embeddings.ts     # Embedding generation
│   │   │   ├── vectorStore.ts    # Vector store operations
│   │   │   ├── retriever.ts      # Similarity search
│   │   │   └── chunks.ts         # Document chunking logic
│   │   ├── prompts/
│   │   │   ├── mystical.ts       # System prompt mystical
│   │   │   ├── witty.ts          # System prompt witty
│   │   │   ├── unhinged.ts       # System prompt unhinged
│   │   │   └── index.ts          # Prompt selector
│   │   ├── constants.ts          # App constants
│   │   └── utils.ts              # Utility functions
│   ├── data/
│   │   ├── documents/            # Raw scraped Ritual docs (.md)
│   │   └── embeddings/           # Pre-computed embeddings (.json)
│   ├── hooks/
│   │   ├── useChat.ts            # Custom hook untuk chat logic
│   │   └── usePersona.ts         # Custom hook untuk persona
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── styles/
│       └── globals.css           # Global styles + Tailwind
├── scripts/
│   ├── scrape-docs.ts            # Script scrape Ritual docs
│   ├── generate-embeddings.ts    # Script generate & simpan embeddings
│   └── test-rag.ts               # Script test RAG pipeline
├── .env.local                    # Environment variables
├── .env.example                  # Contoh env variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 6.3 Alur Data (Data Flow)

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Browser  │────▶│  Next.js API │────▶│  RAG Engine  │────▶│ Groq API │
│  (React)  │◀────│  /api/chat   │◀────│  (retrieve)  │     │  (LLM)   │
└──────────┘ SSE └──────────────┘     └──────────────┘     └──────────┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │ Vector Store  │
                                    │ (embeddings)  │
                                    └──────────────┘
```

---

## 7. Environment Variables

```env
# .env.local
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_NAME=Siggy
NEXT_PUBLIC_APP_URL=https://siggy-chat.vercel.app
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW_MS=60000
```

---

## 8. Desain & UI/UX

### 8.1 Color Palette

| Nama | Hex | Penggunaan |
|---|---|---|
| Background | `#0a0a0a` | Latar belakang utama |
| Surface | `#141414` | Card, chat area |
| Surface Hover | `#1a1a1a` | Hover states |
| Border | `#262626` | Border elemen |
| Text Primary | `#fafafa` | Teks utama |
| Text Secondary | `#a1a1aa` | Teks sekunder |
| Mystical Purple | `#a855f7` | Persona mystical |
| Witty Amber | `#f59e0b` | Persona witty |
| Unhinged Pink | `#ec4899` | Persona unhinged |
| Accent Green | `#22c55e` | Status online, success |
| Cat Eyes Yellow | `#eab308` | Aksen mata kucing |

### 8.2 Typography

| Elemen | Font | Weight |
|---|---|---|
| Heading | `Space Grotesk` | 700 |
| Body | `Inter` | 400, 500 |
| Code | `JetBrains Mono` | 400 |

### 8.3 Wireframe Layout

```
┌─────────────────────────────────────────────┐
│  🐱 Siggy          ● Online                 │  ← Header
├─────────────────────────────────────────────┤
│  [🔮 Mystical] [😏 Witty] [🤪 Unhinged]    │  ← Persona Selector
├─────────────────────────────────────────────┤
│                                             │
│   🐱 Siggy:                                │
│   ┌─────────────────────────────────┐       │
│   │ Hi! I'm Siggy, your personal   │       │
│   │ Ritual assistant. Pick my mood │       │
│   │ and let's chat~ 🐾             │       │  ← Chat Area
│   └─────────────────────────────────┘       │
│                                             │
│                          You:               │
│          ┌──────────────────────────┐       │
│          │ What is Ritual Network?  │       │
│          └──────────────────────────┘       │
│                                             │
│   🐱 Siggy:                                │
│   ┌─────────────────────────────────┐       │
│   │ Ritual is the most expressive  │       │
│   │ blockchain in existence...     │       │
│   └─────────────────────────────────┘       │
│                                             │
├─────────────────────────────────────────────┤
│  [Message for Siggy...          ] [Send ▶]  │  ← Input Area
└─────────────────────────────────────────────┘
```

---

## 9. Milestones & Timeline

### Phase 1 — Foundation (Minggu 1-2)
| Task | Estimasi | Prioritas |
|---|---|---|
| Setup Next.js project + Tailwind + shadcn/ui | 1 hari | 🔴 Critical |
| Setup routing (`/` landing placeholder, `/chat` halaman utama) | 0.5 hari | 🔴 Critical |
| Implementasi layout dasar (Header, Chat container) | 1 hari | 🔴 Critical |
| Implementasi Chat UI di `/chat` (messages, input, auto-scroll) | 2 hari | 🔴 Critical |
| Implementasi Persona Selector (3 mode) | 1 hari | 🔴 Critical |
| Integrasi Groq API (basic chat, no RAG) | 1 hari | 🔴 Critical |
| Streaming response (SSE) | 1 hari | 🔴 Critical |
| System prompts per persona | 0.5 hari | 🔴 Critical |
| Welcome message per persona | 0.5 hari | 🟡 Medium |

### Phase 2 — RAG Pipeline (Minggu 2-3)
| Task | Estimasi | Prioritas |
|---|---|---|
| Scrape Ritual Network docs (15 halaman) | 1 hari | 🔴 Critical |
| Document chunking & preprocessing | 1 hari | 🔴 Critical |
| Generate embeddings & simpan ke file | 1 hari | 🔴 Critical |
| Implementasi vector store (in-memory) | 1 hari | 🔴 Critical |
| Implementasi similarity search | 1 hari | 🔴 Critical |
| Integrasi RAG ke chat pipeline | 1 hari | 🔴 Critical |
| Testing & tuning retrieval accuracy | 1 hari | 🟡 Medium |
| Source attribution (tampilkan sumber jawaban) | 0.5 hari | 🟡 Medium |

### Phase 3 — Polish & Deploy (Minggu 3-4)
| Task | Estimasi | Prioritas |
|---|---|---|
| Responsive design tuning (mobile) | 1 hari | 🔴 Critical |
| Rate limiting implementation | 0.5 hari | 🟡 Medium |
| Error handling & edge cases | 1 hari | 🟡 Medium |
| Loading states & animations | 1 hari | 🟡 Medium |
| Typing indicator animation | 0.5 hari | 🟢 Low |
| Copy button per message | 0.5 hari | 🟢 Low |
| SEO & meta tags | 0.5 hari | 🟢 Low |
| Deploy ke Vercel | 0.5 hari | 🔴 Critical |
| QA & bug fixing | 1 hari | 🔴 Critical |

**Total estimasi: ~3-4 minggu**

---

## 10. Risiko & Mitigasi

| # | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| 1 | Groq API rate limit tercapai | Pengguna tidak bisa chat | Implementasi rate limiting client-side + antrian, gunakan cache untuk pertanyaan umum |
| 2 | Embedding quality rendah → jawaban tidak relevan | UX buruk, informasi salah | Tuning chunk size, overlap, dan re-ranking strategy |
| 3 | Dokumen Ritual berubah/update | Knowledge base outdated | Script re-scrape terjadwal, versioning dokumen |
| 4 | Groq API down / latency tinggi | Chat tidak responsif | Fallback ke model lebih kecil, timeout handling, retry logic |
| 5 | Persona "Unhinged" menghasilkan konten tidak pantas | Reputasi buruk | Guardrails di system prompt, content filtering |

---

## 11. Pertimbangan Keamanan

- [ ] **API Key Protection:** Groq API key hanya di server-side, tidak pernah exposed ke client
- [ ] **Rate Limiting:** Implementasi per-IP rate limiting untuk mencegah abuse
- [ ] **Input Sanitization:** Sanitasi semua input pengguna sebelum dikirim ke LLM
- [ ] **Prompt Injection Prevention:** System prompt yang robust untuk mencegah jailbreak
- [ ] **CORS Configuration:** Batasi origin yang diizinkan
- [ ] **Content Filtering:** Monitor output untuk konten berbahaya

---

## 12. Pengembangan Masa Depan (v2.0+)

| Fitur | Deskripsi |
|---|---|
| **Persistent Chat History** | Simpan riwayat chat dengan localStorage atau database |
| **Multi-language Support** | Dukungan bahasa Indonesia, English, dll |
| **Voice Input** | Pengguna bisa berbicara ke Siggy |
| **Siggy Avatars** | Animasi avatar Siggy yang berubah sesuai persona |
| **Community Q&A** | FAQ yang dikurasi dari pertanyaan paling sering |
| **Vector DB Migration** | Migrasi dari in-memory ke Pinecone/Chroma/Weaviate |
| **Analytics Dashboard** | Tracking pertanyaan populer, persona usage, dll |
| **Plugin System** | Siggy bisa mengakses harga token, status network, dll |
| **Wallet Connect** | Integrasi wallet untuk fitur on-chain |

---

## 13. Referensi

| Sumber | URL |
|---|---|
| SiggyLand (referensi UI/UX) | https://www.siggyland.app/ask |
| Ritual Foundation Docs | https://www.ritualfoundation.org/docs/overview/what-is-ritual |
| Groq API Documentation | https://console.groq.com/docs |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| Next.js Documentation | https://nextjs.org/docs |
| shadcn/ui Components | https://ui.shadcn.com |

---

## 14. Approval

| Role | Nama | Status | Tanggal |
|---|---|---|---|
| Product Owner | | ⬜ Pending | |
| Tech Lead | | ⬜ Pending | |
| Designer | | ⬜ Pending | |

---

*Dokumen ini dibuat sebagai panduan pengembangan Siggytarius. Semua spesifikasi dapat berubah berdasarkan feedback dan temuan teknis selama pengembangan.*
