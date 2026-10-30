# Local AI Guide & Inference Configuration

## 1. Local AI Philosophy

The Last Login is designed around the core principle:  
**"AI assists. The user decides."**

- AI provides advisory triage classifications (KEEP, RELEASE, EXORCISE) with confidence ratings and rationales.
- AI provides compassionate prompt questions in Living Séance to help uncover stories.
- AI helps draft and polish legacy letters.
- **The user retains 100% decision authority** over every action, deletion, and letter approval.

---

## 2. Using with Ollama

The system natively connects to local Ollama installations.

1. **Install Ollama:** Download and install from [ollama.com](https://ollama.com).
2. **Pull an open-weight model:**
   ```bash
   ollama pull gemma2:latest
   # or
   ollama pull qwen2.5:latest
   # or
   ollama pull llama3:latest
   ```
3. **Start Ollama:**
   ```bash
   ollama serve
   ```
4. **Configure in The Last Login:**
   - Navigate to `/settings`
   - Set endpoint: `http://localhost:11434`
   - Set model: `gemma2:latest`
   - Click **"Test Connection"** to verify.

---

## 3. Embedded Offline Heuristic Engine

If Ollama is not installed or the local machine does not have a GPU, The Last Login includes a deterministic, culturally empathetic offline heuristic engine:
- Never makes external network calls.
- Provides intelligent classifications, questions, and letter drafting offline.
- Guarantees complete application functionality on any hardware without installing gigabytes of model weights.
