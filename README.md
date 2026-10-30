# The Last Login 🕯️

> **Tagline:** Your memories. Your wishes. Your control.  
> **Concept:** A Private AI Digital Estate Planner.

**The Last Login** is a polished, production-quality, open-source application designed to help people organize their digital belongings, document their wishes, preserve meaningful family memories, and prepare a secure, encrypted digital legacy archive for those they choose.

It treats the digital estate not as a cold transactional task or a creepy synthetic resurrection tool, but as a **Digital Ofrenda** — a sacred, warm, human space where technology meets memory, privacy, and reverence.

---

## Visual Identity: The Digital Ofrenda

Inspired by the warmth, reverence, and sensory memories of Día de los Muertos ofrendas:

- **Midnight Olive (`#18251F`):** Grounding, solemn, and editorial navigation surfaces.
- **Warm Parchment (`#F5EFE3`):** Tactile paper surfaces for reading letters and reflections.
- **Marigold (`#D99A35`):** Golden cempasúchil amber for primary actions, subtle glow, and guidance.
- **Terracotta (`#B96F54`):** Warm clay tones for boundary management, letting go, and exorcisms.
- **Sage (`#8C9A7A`):** Soft heritage green for archival preservation and progress bars.
- **Typography:** Newsreader (editorial serif), DM Sans (interface), and JetBrains Mono (cryptographic hashes).

---

## Core Product Features

1. **The Digital Ofrenda Landing Page (`/`):**
   - Atmospheric welcome celebrating memory, privacy, and human connection.
   - Core principle: **AI assists. The user decides.**
   - 1-click launch for the **Marisol Hernandez** fictional estate scenario.

2. **My Legacy Dashboard (`/dashboard`):**
   - High-level estate metrics: Total items, KEEP items, RELEASE items, EXORCISE items.
   - Readiness progress meter (inspired by Legacy Vault).
   - Recommended next actions and recent activity audit feed.

3. **Life Inventory (`/inventory`):**
   - Explicit file selection (photos, family recipes, documents, voice notes, code).
   - Full-text search and category filtering.
   - Local storage status and SHA-256 integrity checksums.
   - Zero silent background scanning of user hardware.

4. **Living Séance (`/seance`):**
   - Guided, private reflective interview experience.
   - One thoughtful question at a time to uncover oral histories and culinary secrets.
   - Local answer persistence, editing, skipping, and AI contextual reflection.
   - Strictly no impersonation of deceased individuals.

5. **Keep / Release / Exorcise (`/decisions`):**
   - Tactile 3-folder triage interface (Keep, Maybe/Release, Let Go/Exorcise).
   - Recipient assignment and decision rationale tracking.
   - Safe pending staging queue for items marked for exclusion/deletion.

6. **Legacy Letters (`/letters`):**
   - AI-assisted compassionate drafting workspace.
   - Support for family stories, recipe histories, and open-source project handovers.
   - Explicit user approval required before inclusion into the sealed archive.

7. **Sealed Ofrenda (`/sealed-ofrenda`):**
   - Authenticated AES-256-GCM encryption with PBKDF2-SHA256 key derivation.
   - Export and download verifiable `.ofrenda` container packages.
   - Test decryption and SHA-256 checksum integrity verification.
   - Printable Emergency Key Recovery Sheet for physical safe storage.

8. **Memorial Preview (`/memorial-preview`):**
   - Curated tribute space with interactive candlelight glow.
   - Only displays explicitly approved KEEP & RELEASE memories.
   - Strictly excludes exorcised items, private journals, and temporary files.

9. **Settings & Privacy (`/settings`):**
   - Local Ollama endpoint and model selector (`gemma2`, `llama3`, `qwen2.5`).
   - Embedded offline heuristic engine toggle.
   - Zero-cloud telemetry audit report.
   - 1-click fictional demo reload and workspace reset.

---

## Quick Start & Installation

### Prerequisites
- **Node.js** v20+ or v24+
- **NPM** v10+
- Optional: **Ollama** running locally (`ollama serve`)

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/your-username/the-last-login.git
cd the-last-login

# Install all monorepo dependencies
npm install

# Build shared package
npm run build:shared

# Run both Server (port 3001) and Client (port 5173) concurrently
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

### Running Tests
```bash
npm run test --workspace=@the-last-login/server
```

---

## Architecture & Tech Stack

```text
the-last-login/
├── apps/
│   ├── client/       # React 19, TypeScript, Vite, Tailwind CSS, Lucide
│   └── server/       # Node.js, Express, better-sqlite3, AES-256-GCM crypto
├── packages/
│   └── shared/       # Zod schemas, domain types, and interfaces
├── docs/             # Cryptography, key recovery, and local AI guides
├── .env.example
├── README.md
└── package.json
```

---

## Privacy & Security Manifesto

1. **Local by Default:** All files and databases reside on the user's computer.
2. **Zero Cloud AI Egress:** Ollama connects only to `127.0.0.1`. Offline heuristics require zero internet.
3. **Zero-Knowledge Encryption:** AES-256-GCM derived via PBKDF2 (100,000 iterations). No backdoors.
4. **Human Autonomy:** AI assists. The user decides.
