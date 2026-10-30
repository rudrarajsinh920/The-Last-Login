import {
  InventoryItem,
  SeanceTurn,
  LegacyLetter,
  VaultArchive,
  DashboardMetrics,
  ActivityLogEntry
} from '@the-last-login/shared';

const API_BASE = '/api';

export const api = {
  // Metrics & Activity
  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const data = await res.json();
    return data.metrics;
  },

  async getActivity(): Promise<ActivityLogEntry[]> {
    const res = await fetch(`${API_BASE}/activity`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    const data = await res.json();
    return data.activity;
  },

  async loadMarisolDemo(): Promise<void> {
    const res = await fetch(`${API_BASE}/demo/marisol`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load demo');
  },

  async resetWorkspace(): Promise<void> {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset workspace');
  },

  // Inventory
  async getInventory(params?: { category?: string; triageStatus?: string; search?: string }): Promise<InventoryItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.triageStatus) query.set('triageStatus', params.triageStatus);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/inventory?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    const data = await res.json();
    return data.items;
  },

  async getItem(id: string): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory/${id}`);
    if (!res.ok) throw new Error('Failed to fetch item');
    const data = await res.json();
    return data.item;
  },

  async createItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    const data = await res.json();
    return data.item;
  },

  async uploadFile(formData: FormData): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload file');
    const data = await res.json();
    return data.item;
  },

  async triageItem(id: string, triageStatus: string, decisionReason?: string, recipient?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/inventory/${id}/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triageStatus, decisionReason, recipient }),
    });
    if (!res.ok) throw new Error('Failed to update decision');
  },

  async confirmExorcise(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/inventory/${id}/confirm-exorcise`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to confirm exorcism');
  },

  async restoreExorcise(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/inventory/${id}/restore-exorcise`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to restore item');
  },

  async reanalyzeItem(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/inventory/${id}/analyze`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to analyze item');
    return res.json();
  },

  // Living Séance
  async getSeanceTurns(): Promise<SeanceTurn[]> {
    const res = await fetch(`${API_BASE}/seance`);
    if (!res.ok) throw new Error('Failed to fetch seance turns');
    const data = await res.json();
    return data.turns;
  },

  async askSeanceQuestion(itemId?: string): Promise<SeanceTurn> {
    const res = await fetch(`${API_BASE}/seance/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });
    if (!res.ok) throw new Error('Failed to generate question');
    const data = await res.json();
    return data.turn;
  },

  async answerSeanceQuestion(id: string, answer: string): Promise<SeanceTurn> {
    const res = await fetch(`${API_BASE}/seance/${id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    if (!res.ok) throw new Error('Failed to save answer');
    const data = await res.json();
    return data.turn;
  },

  async skipSeanceQuestion(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/seance/${id}/skip`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to skip question');
  },

  async editSeanceAnswer(id: string, answer: string): Promise<void> {
    const res = await fetch(`${API_BASE}/seance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    if (!res.ok) throw new Error('Failed to edit answer');
  },

  async deleteSeanceTurn(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/seance/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete turn');
  },

  // Legacy Letters
  async getLetters(): Promise<LegacyLetter[]> {
    const res = await fetch(`${API_BASE}/letters`);
    if (!res.ok) throw new Error('Failed to fetch letters');
    const data = await res.json();
    return data.letters;
  },

  async getLetter(id: string): Promise<LegacyLetter> {
    const res = await fetch(`${API_BASE}/letters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch letter');
    const data = await res.json();
    return data.letter;
  },

  async createLetter(letter: Partial<LegacyLetter>): Promise<LegacyLetter> {
    const res = await fetch(`${API_BASE}/letters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter),
    });
    if (!res.ok) throw new Error('Failed to create letter');
    const data = await res.json();
    return data.letter;
  },

  async updateLetter(id: string, letter: Partial<LegacyLetter>): Promise<void> {
    const res = await fetch(`${API_BASE}/letters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter),
    });
    if (!res.ok) throw new Error('Failed to update letter');
  },

  async approveLetter(id: string, isApproved: boolean): Promise<void> {
    const res = await fetch(`${API_BASE}/letters/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved }),
    });
    if (!res.ok) throw new Error('Failed to approve letter');
  },

  async deleteLetter(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/letters/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete letter');
  },

  async assistLetter(params: {
    recipient: string;
    type: string;
    tone: string;
    promptAction: string;
    currentContent?: string;
  }): Promise<{ content: string; notes: string }> {
    const res = await fetch(`${API_BASE}/letters/assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to request AI letter assistance');
    return res.json();
  },

  // Archive & Cryptography
  async getArchiveStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/archive/status`);
    if (!res.ok) throw new Error('Failed to fetch archive status');
    return res.json();
  },

  async sealArchive(passphrase: string, ownerName?: string): Promise<{
    success: boolean;
    archive: VaultArchive;
    fileName: string;
    downloadUrl: string;
  }> {
    const res = await fetch(`${API_BASE}/archive/seal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase, ownerName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to seal archive');
    }
    return res.json();
  },

  async verifyArchive(archiveData: any, passphrase: string): Promise<any> {
    const res = await fetch(`${API_BASE}/archive/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archiveData, passphrase }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },

  // Memorial
  async getMemorial(): Promise<any> {
    const res = await fetch(`${API_BASE}/memorial`);
    if (!res.ok) throw new Error('Failed to fetch memorial tribute');
    const data = await res.json();
    return data.memorial;
  },

  // Settings & Local AI
  async getSettings(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(config: any): Promise<void> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update settings');
  },

  async testAI(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/ai/test`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to test local AI');
    return res.json();
  }
};
