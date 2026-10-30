# The Last Login — System Architecture

**Tagline:** Your memories. Your wishes. Your control.  
**Concept:** A Private AI Digital Estate Planner.

---

## 1. Core Architecture Overview

```
                      +---------------------------------------+
                      |         The Digital Ofrenda UI        |
                      |    (React 19, Tailwind CSS, Vite)     |
                      +---------------------------------------+
                                          |
                                          | REST API (Localhost only)
                                          v
                      +---------------------------------------+
                      |            Express Backend            |
                      |       (Node.js v24, TypeScript)       |
                      +---------------------------------------+
                        /                 |                 \
                       /                  |                  \
                      v                   v                   v
      +----------------------+ +--------------------+ +--------------------+
      |    SQLite Database   | |     Local Ollama   | |   Crypto Vault     |
      |   (better-sqlite3)   | |  (Zero Cloud Egress| | (AES-256-GCM       |
      |  FTS5 Local Search   | |  Heuristic fallback| |  PBKDF2-SHA256)    |
      +----------------------+ +--------------------+ +--------------------+
```

---

## 2. Monorepo Structure

- **`apps/client`**: Production React 19 application utilizing Tailwind CSS, Lucide icons, and responsive layouts inspired by the Digital Ofrenda, Legacy Vault, and Kindred design systems.
- **`apps/server`**: Express API server with SQLite persistence, file upload verification, local Ollama integration, and authenticated cryptographic vault packaging.
- **`packages/shared`**: Shared Zod schemas, TypeScript types, and domain models guaranteeing type safety across both frontend and backend.
- **`docs/`**: Cryptographic specifications, key recovery procedures, and local AI setup guides.

---

## 3. Privacy & Zero-Cloud Guarantee

1. **Local by Default:** All files, journals, recipes, and letters reside locally on disk in `apps/server/data/uploads` and `the_last_login.db`.
2. **Zero Cloud AI Leaks:** Ollama inference connects strictly to `http://localhost:11434`. When Ollama is offline, the system seamlessly transitions to the local deterministic heuristic engine without transmitting any bytes across the Internet.
3. **No Silent Scanning:** Never touches files or folders without explicit user selection.
4. **No Digital Resurrection:** Strictly forbids synthetic personality imitation or simulated messages from deceased individuals.
