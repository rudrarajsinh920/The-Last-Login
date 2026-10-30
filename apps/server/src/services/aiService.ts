import { db } from '../db/database';
import { InventoryItem, LetterTone, LetterType } from '@the-last-login/shared';

export interface AIStatus {
  connected: boolean;
  endpoint: string;
  model: string;
  mode: 'ollama' | 'local_heuristic';
  availableModels: string[];
  message: string;
}

export class AIService {
  private getSettings() {
    const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('config') as { value: string } | undefined;
    if (row) {
      try {
        return JSON.parse(row.value);
      } catch (e) {
        // fallback
      }
    }
    return {
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma2:latest',
      enableLocalHeuristics: true
    };
  }

  async checkStatus(): Promise<AIStatus> {
    const settings = this.getSettings();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${settings.ollamaEndpoint}/api/tags`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as { models?: Array<{ name: string }> };
        const models = (data.models || []).map(m => m.name);
        return {
          connected: true,
          endpoint: settings.ollamaEndpoint,
          model: settings.ollamaModel,
          mode: 'ollama',
          availableModels: models,
          message: `Connected to local Ollama (${models.length} local models detected). Zero cloud egress.`
        };
      }
    } catch (err) {
      // Ollama not reachable
    }

    return {
      connected: false,
      endpoint: settings.ollamaEndpoint,
      model: settings.ollamaModel,
      mode: 'local_heuristic',
      availableModels: [],
      message: 'Local Ollama not detected. Running on embedded offline heuristic engine. Completely private and offline.'
    };
  }

  async suggestItemClassification(item: Partial<InventoryItem>): Promise<{
    suggestedStatus: 'keep' | 'release' | 'exorcise';
    confidence: number;
    rationale: string;
  }> {
    const status = await this.checkStatus();
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const cat = item.category || 'other';

    if (status.mode === 'ollama') {
      try {
        const prompt = `You are an AI assistant in 'The Last Login' digital estate planning suite.
The user is evaluating this digital possession:
Title: "${item.title}"
Category: "${item.category}"
Description: "${item.description || 'None'}"
File Type: "${item.fileType}"

Recommend one of these three decisions:
- KEEP (preserve in personal digital legacy archive)
- RELEASE (prepare to be transferred or gifted to a designated recipient or family member)
- EXORCISE (mark for safe permanent exclusion or deletion to protect privacy)

Respond ONLY in valid JSON format:
{
  "suggestedStatus": "keep" | "release" | "exorcise",
  "confidence": 0.85,
  "rationale": "One thoughtful sentence explaining your suggestion."
}`;

        const res = await fetch(`${status.endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: status.model,
            prompt,
            stream: false,
            format: 'json'
          })
        });

        if (res.ok) {
          const body = (await res.json()) as { response: string };
          const parsed = JSON.parse(body.response);
          if (['keep', 'release', 'exorcise'].includes(parsed.suggestedStatus)) {
            return {
              suggestedStatus: parsed.suggestedStatus,
              confidence: Number(parsed.confidence) || 0.85,
              rationale: parsed.rationale || 'Suggested based on emotional and generational significance.'
            };
          }
        }
      } catch (err) {
        console.warn('Ollama generate failed, falling back to local heuristic:', err);
      }
    }

    // High-quality local offline heuristic
    if (
      title.includes('journal') ||
      title.includes('diary') ||
      title.includes('private') ||
      title.includes('secret') ||
      title.includes('temp') ||
      title.includes('draft notes') ||
      desc.includes('raw thoughts') ||
      desc.includes('grief')
    ) {
      return {
        suggestedStatus: 'exorcise',
        confidence: 0.88,
        rationale: 'Contains private personal reflections or temporary cathartic notes; recommended for exclusion to preserve your boundaries.'
      };
    }

    if (
      cat === 'recipes' ||
      title.includes('recipe') ||
      title.includes('deed') ||
      title.includes('will') ||
      title.includes('account') ||
      title.includes('handover') ||
      desc.includes('for elena') ||
      desc.includes('for mateo') ||
      desc.includes('family heirloom')
    ) {
      return {
        suggestedStatus: 'release',
        confidence: 0.94,
        rationale: 'Carries immediate generational or practical value intended for your designated loved ones.'
      };
    }

    if (
      cat === 'creative' ||
      title.includes('catalog') ||
      title.includes('project') ||
      title.includes('open source') ||
      title.includes('repository')
    ) {
      return {
        suggestedStatus: 'keep',
        confidence: 0.91,
        rationale: 'Represents your enduring creative legacy and public body of work.'
      };
    }

    // Default to KEEP
    return {
      suggestedStatus: 'keep',
      confidence: 0.82,
      rationale: 'Meaningful archival asset representing a key chapter of your digital life.'
    };
  }

  async generateSeanceQuestion(itemTitle?: string, category?: string): Promise<{
    question: string;
    category: string;
    aiPromptContext: string;
  }> {
    if (itemTitle) {
      return {
        question: `When you look at "${itemTitle}", what memory or feeling surfaces first — and what do you want the recipient to understand about it?`,
        category: category || 'Memory Reflection',
        aiPromptContext: `Focused on specific inventory possession: ${itemTitle}`
      };
    }

    const questions = [
      {
        question: "Is there a story behind a family recipe or gathering that was never written down?",
        category: "Generational Wisdom",
        aiPromptContext: "Oral histories & culinary traditions"
      },
      {
        question: "Which of your digital projects or creative works would you like preserved for future curiosity?",
        category: "Creative Legacy",
        aiPromptContext: "Code, art, and intellectual projects"
      },
      {
        question: "Are there files or personal writings you feel should be gently laid to rest rather than passed on?",
        category: "Privacy & Boundaries",
        aiPromptContext: "Closure, catharsis, and intentional exclusion"
      },
      {
        question: "If you could leave one piece of unvarnished advice to those you care about most, what would it be?",
        category: "Guiding Principles",
        aiPromptContext: "Values and philosophy"
      }
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }

  async generateSeanceReflection(question: string, answer: string): Promise<string> {
    const status = await this.checkStatus();
    if (status.mode === 'ollama') {
      try {
        const prompt = `You are the respectful AI companion in 'The Last Login' (Living Séance mode).
Question: "${question}"
User's reflection: "${answer}"

Write a concise, 1-to-2 sentence empathetic reflection highlighting the heart of what was shared. Never impersonate anyone deceased or pretend supernatural knowledge. Be warm, grounded, and respectful.`;

        const res = await fetch(`${status.endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: status.model,
            prompt,
            stream: false
          })
        });

        if (res.ok) {
          const body = (await res.json()) as { response: string };
          if (body.response?.trim()) {
            return body.response.trim();
          }
        }
      } catch (err) {
        // Fall back
      }
    }

    // Heuristic empathetic reflection
    if (answer.toLowerCase().includes('abuela') || answer.toLowerCase().includes('family') || answer.toLowerCase().includes('love')) {
      return "This speaks to a profound bridge of tenderness across generations. Documenting this keeps that living hearth glowing.";
    }
    if (answer.toLowerCase().includes('fire') || answer.toLowerCase().includes('private') || answer.toLowerCase().includes('grief')) {
      return "Honoring your boundary to let this go is just as sacred as preserving what stays. Privacy is an act of self-respect.";
    }

    return "Thank you for documenting this memory. Capturing the human story behind the file transforms data into an enduring inheritance.";
  }

  async assistLetterWriting(params: {
    recipient: string;
    type: LetterType;
    tone: LetterTone;
    promptAction: 'draft_opening' | 'deepen_memory' | 'polish_tone' | 'create_full_draft';
    currentContent?: string;
  }): Promise<{ content: string; notes: string }> {
    const { recipient, type, tone, promptAction, currentContent } = params;
    const status = await this.checkStatus();

    if (status.mode === 'ollama') {
      try {
        const prompt = `You are a thoughtful estate writing companion in 'The Last Login'.
Task: ${promptAction}
Recipient: ${recipient}
Letter Type: ${type}
Tone: ${tone}
Current draft: "${currentContent || 'None yet'}"

Instructions:
- Write thoughtful, genuine words.
- Do not use corporate clichés.
- Honor human connection, memory, and dignity.
- AI assists, but the human user retains all decision authority.`;

        const res = await fetch(`${status.endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: status.model,
            prompt,
            stream: false
          })
        });

        if (res.ok) {
          const body = (await res.json()) as { response: string };
          if (body.response?.trim()) {
            return {
              content: body.response.trim(),
              notes: `Generated by local Ollama (${status.model}) with ${tone} tone.`
            };
          }
        }
      } catch (err) {
        // Fall back
      }
    }

    // Heuristic generator
    if (type === 'recipe_history') {
      return {
        content: `Dear ${recipient},\n\nEvery time you smell toasted ancho chiles and Mexican chocolate melting together, remember that our kitchen was where our family learned to laugh through hard years.\n\nAbuela taught me that a recipe is never just quantities of salt or spices—it is patience. Do not rush the simmering pot. When you prepare this for those you love, know that you carry our hands alongside yours.\n\nWith all my love and blessings.`,
        notes: 'Offline legacy template personalized for culinary heirlooms.'
      };
    }

    if (type === 'project_handover') {
      return {
        content: `To ${recipient},\n\nI have gathered the source code, botanical archives, and documentation in this legacy package. It was built with care and an open heart for the community.\n\nYou have permission to fork, archive, or steward this work forward in whatever way serves people best. All keys and licenses are documented in the accompanying README.\n\nThank you for looking after this corner of the digital garden.`,
        notes: 'Offline template structured for open-source and creative project stewardship.'
      };
    }

    return {
      content: `Dear ${recipient},\n\nIf you are reading this, know that I took the time to write these words with a calm heart and clear mind.\n\nThere is so much we shared that doesn't fit into legal paperwork or inventory lists. What I leave you most of all is gratitude for the laughter, the quiet evenings, and the kindness you brought into my life.\n\nTake care of one another, be gentle with your own hearts, and keep our stories alive.`,
      notes: 'Thoughtful offline legacy letter draft.'
    };
  }
}

export const aiService = new AIService();
