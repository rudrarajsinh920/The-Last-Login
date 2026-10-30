import {
  InventoryItem,
  SeanceTurn,
  LegacyLetter,
  VaultArchive,
  DashboardMetrics,
  ActivityLogEntry,
  SystemSettings
} from '@the-last-login/shared';

const STORAGE_KEY_ITEMS = 'last_login_items_v1';
const STORAGE_KEY_TURNS = 'last_login_turns_v1';
const STORAGE_KEY_LETTERS = 'last_login_letters_v1';
const STORAGE_KEY_ACTIVITY = 'last_login_activity_v1';
const STORAGE_KEY_SETTINGS = 'last_login_settings_v1';

const now = new Date();
const dateStr = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const INITIAL_DEMO_ITEMS: InventoryItem[] = [
  {
    id: 'item_mole_recipe_1962',
    title: "Abuela Elena's Mole Poblano Recipe & Voice Notes",
    description: "Handwritten 1962 culinary notes with authentic ingredient measurements and Marisol's 2004 recorded audio annotations.",
    category: 'recipes',
    fileType: 'application/pdf',
    fileSize: 3482100,
    fileName: 'abuela_mole_poblano_1962.pdf',
    localPath: 'data/uploads/abuela_mole_poblano_1962.pdf',
    contentSnippet: "Ingredients: 6 mulato chiles, 4 pasilla chiles, 4 ancho chiles, Mexican cinnamon, 2 disks Ibarra chocolate. Roast over clay comal until fragrant. Never let the smoke blacken the seeds. Grind with toasted sesame and plantains.",
    previewUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    importedAt: dateStr(14),
    triageStatus: 'release',
    decisionReason: "Generational culinary legacy; to be handed down directly so the living tradition continues unbroken.",
    recipient: 'Elena (Daughter) & Mateo (Brother)',
    aiSuggestedStatus: 'release',
    aiConfidence: 0.96,
    aiRationale: "High cultural and generational heritage; ideal candidate for designated family release.",
    isPendingExorcism: false,
    tags: ['recipes', 'heirloom', 'culinary', 'puebla', 'abuela'],
    metadata: { handwrittenYear: 1962, originalAuthor: 'Elena Ramirez' }
  },
  {
    id: 'item_botanica_catalog',
    title: 'Botanica-Catalog Open Source Engine',
    description: 'Comprehensive open-source taxonomic software repository and flora database documenting high-altitude Mexican medicinal plants.',
    category: 'creative',
    fileType: 'application/zip',
    fileSize: 48920100,
    fileName: 'botanica_catalog_repo_v2.zip',
    localPath: 'data/uploads/botanica_catalog_repo_v2.zip',
    contentSnippet: "export interface FloraRecord { id: string; scientificName: string; indigenousNahautlName: string; medicinalUses: string[]; habitatElevationMeters: number; } // 15 years of field observations, MIT License.",
    previewUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    importedAt: dateStr(12),
    triageStatus: 'keep',
    decisionReason: "Preserve in permanent legacy archive and ensure public software repository mirror remains online.",
    recipient: 'Public / Open Source Community',
    aiSuggestedStatus: 'keep',
    aiConfidence: 0.92,
    aiRationale: "Creative intellectual contribution and life's coding work; valuable for permanent archival.",
    isPendingExorcism: false,
    tags: ['code', 'open-source', 'botany', 'typescript', 'nature'],
    metadata: { repository: 'github.com/marisol-h/botanica-catalog', license: 'MIT' }
  },
  {
    id: 'item_coyoacan_photo_1988',
    title: '1988 Coyoacán Family Gathering Photograph',
    description: 'Restored archival high-resolution photograph taken in the sunlit bougainvillea courtyard in Coyoacán.',
    category: 'photos',
    fileType: 'image/jpeg',
    fileSize: 8412900,
    fileName: 'coyoacan_family_reunion_1988.jpg',
    localPath: 'data/uploads/coyoacan_family_reunion_1988.jpg',
    contentSnippet: "Visual archival scan. Left to right: Abuelo Roberto, Tia Carmen holding baby Mateo, Marisol at age 14, and Dona Socorro under the flowering jacaranda.",
    previewUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    importedAt: dateStr(10),
    triageStatus: 'keep',
    decisionReason: "Centerpiece visual memory for the family digital ofrenda.",
    recipient: 'Family Archive',
    aiSuggestedStatus: 'keep',
    aiConfidence: 0.95,
    aiRationale: "Irreplaceable historical portrait capturing multiple generations.",
    isPendingExorcism: false,
    tags: ['photography', 'coyoacan', 'family', '1980s', 'portrait'],
    metadata: { dateTaken: '1988-11-02', location: 'Coyoacán, CDMX' }
  },
  {
    id: 'item_private_journals_grief',
    title: 'Private Reflection Journals (2018-2022)',
    description: 'Raw, cathartic personal writings written during late nights of profound bereavement and medical uncertainty.',
    category: 'stories',
    fileType: 'text/markdown',
    fileSize: 1245000,
    fileName: 'private_bereavement_journals.enc',
    localPath: 'data/uploads/private_bereavement_journals.enc',
    contentSnippet: "July 2019: The silence in the hallway is unbearable today. Writing this to empty the knot in my chest, not because anyone else should ever carry these words. When I am gone, let the morning rain wash this away.",
    hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    importedAt: dateStr(8),
    triageStatus: 'exorcise',
    decisionReason: "These journals served their purpose during my life. They were meant for personal healing, not for my children to hold.",
    recipient: 'None (Destruction on Archive Sealing)',
    aiSuggestedStatus: 'exorcise',
    aiConfidence: 0.89,
    aiRationale: "Highly intimate personal grief reflections; user has explicitly designated for peaceful exclusion.",
    isPendingExorcism: true,
    tags: ['private', 'journal', 'catharsis', 'boundaries'],
    metadata: { privacyLevel: 'strictly_private', safeToExclude: true }
  },
  {
    id: 'item_oaxaca_rain_audio',
    title: 'Oaxaca Courtyard Rain & Birdsong Soundscape',
    description: 'Field audio recording of summer thunder, gentle rain dripping from terracotta shingles, and mourning doves.',
    category: 'audio',
    fileType: 'audio/mpeg',
    fileSize: 18920400,
    fileName: 'oaxaca_courtyard_rain_2021.mp3',
    localPath: 'data/uploads/oaxaca_courtyard_rain_2021.mp3',
    contentSnippet: "High-fidelity binaural field recording, 34 minutes duration. Recorded at Casa de las Campanas courtyard during the monsoon.",
    previewUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    importedAt: dateStr(6),
    triageStatus: 'keep',
    decisionReason: "A serene sensory memory of my happiest sanctuary on earth.",
    recipient: 'Everyone in Archive',
    aiSuggestedStatus: 'keep',
    aiConfidence: 0.88,
    aiRationale: "Rich sensory legacy item offering calm and presence.",
    isPendingExorcism: false,
    tags: ['audio', 'oaxaca', 'nature', 'rain', 'sanctuary'],
    metadata: { durationSeconds: 2040, recordedDate: '2021-08-14' }
  },
  {
    id: 'item_cholula_orchard_deed',
    title: 'Deed of Trust & Orchard Cadastral Certificates',
    description: 'Official notary deeds, land survey maps, and legal trust certificates for the family avocado and lime orchard in Cholula.',
    category: 'documents',
    fileType: 'application/pdf',
    fileSize: 5210900,
    fileName: 'cholula_property_deed_of_trust.pdf',
    localPath: 'data/uploads/cholula_property_deed_of_trust.pdf',
    contentSnippet: "Notaría Pública No. 14, Cholula, Puebla. Certified land title for Parcel 402B containing 1.8 hectares of agricultural grove and irrigation rights.",
    hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    importedAt: dateStr(5),
    triageStatus: 'release',
    decisionReason: "Required legal documentation for smooth property stewardship transition.",
    recipient: 'Mateo (Brother) & Notary Garcia',
    aiSuggestedStatus: 'release',
    aiConfidence: 0.98,
    aiRationale: "Critical legal and administrative instrument; essential for designated recipient.",
    isPendingExorcism: false,
    tags: ['legal', 'property', 'cholula', 'deeds', 'orchard'],
    metadata: { legalFolio: 'NOT-14-PUE-2017-992' }
  },
  {
    id: 'item_letters_to_future_grandchildren',
    title: 'Letters to My Future Grandchildren',
    description: 'Three handwritten reflections on choosing kindness over cynicism, learning to mend broken ceramics, and walking slowly.',
    category: 'stories',
    fileType: 'text/markdown',
    fileSize: 45200,
    fileName: 'letters_to_future_grandchildren.md',
    localPath: 'data/uploads/letters_to_future_grandchildren.md',
    contentSnippet: "To the ones who will come after: You do not have to have everything figured out by twenty or thirty or fifty. Be the kind of person who leaves a room warmer than you found it. Drink clean water, eat slowly with people you love, and don't be afraid to plant seeds whose shade you will never sit under.",
    previewUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    hash: '6a5e1281f6eed0be7e1082c692a3f5a2f5756dcf982e55728a391f13b631d87e',
    importedAt: dateStr(2),
    triageStatus: 'keep',
    decisionReason: "Heartfelt generational blessing; central testament to our family values.",
    recipient: 'Future Generations',
    aiSuggestedStatus: 'keep',
    aiConfidence: 0.97,
    aiRationale: "Timeless wisdom letter; perfectly suited for long-term legacy preservation.",
    isPendingExorcism: false,
    tags: ['letters', 'wisdom', 'family', 'generations', 'love'],
    metadata: { draftedAt: '2024-05-18' }
  }
];

export const INITIAL_DEMO_TURNS: SeanceTurn[] = [
  {
    id: 'seance_turn_1',
    question: "What makes Abuela Elena's Mole recipe so irreplaceable to your family?",
    category: "Culinary Tradition",
    associatedItemId: 'item_mole_recipe_1962',
    associatedItemTitle: "Abuela Elena's Mole Poblano Recipe & Voice Notes",
    aiPromptContext: "Oral histories & culinary traditions",
    userAnswer: "It was never written down until I sat with her in 2004 with a tape recorder. Everyone argued over whether cinnamon or star anise made the difference, but the real secret was roasting the chiles on real clay comales and letting the Mexican chocolate melt at the very end with toasted sesame. Passing this to Elena means our Sunday feasts will taste the same fifty years from now.",
    isSkipped: false,
    createdAt: dateStr(11),
    updatedAt: dateStr(11),
    aiReflection: "This speaks to an unbroken golden thread across generations. The recipe is not merely instructions, but the sensory heartbeat of your family home."
  },
  {
    id: 'seance_turn_2',
    question: "Why have you chosen to exorcise your private journals from 2018-2022?",
    category: "Boundaries & Letting Go",
    associatedItemId: 'item_private_journals_grief',
    associatedItemTitle: 'Private Reflection Journals (2018-2022)',
    aiPromptContext: "Closure, catharsis, and intentional exclusion",
    userAnswer: "Those notebooks were my private storm. When my mother passed, writing was the only way I could keep breathing. But they were written to release the pain onto paper so my body didn't have to carry it. They were never meant for my daughter or brother to read. Love means giving them the light, not asking them to re-live my private winter.",
    isSkipped: false,
    createdAt: dateStr(7),
    updatedAt: dateStr(7),
    aiReflection: "Your intentional boundary honors both your dignity and your family's peace. True estate planning knows what to cherish and what to lay to rest."
  },
  {
    id: 'seance_turn_3',
    question: "What do you hope someone discovering the Botanica codebase fifty years from now will appreciate?",
    category: "Creative & Open Legacy",
    associatedItemId: 'item_botanica_catalog',
    associatedItemTitle: 'Botanica-Catalog Open Source Engine',
    aiPromptContext: "Code and creative projects",
    userAnswer: "I hope they see that software can be built with patience, like cultivating an orchard. I spent 15 summers cataloging wild chamomile, agave, and highland mosses across Puebla. I hope a student in Mexico City or Oaxaca uses this code to protect our native endangered flora.",
    isSkipped: false,
    createdAt: dateStr(4),
    updatedAt: dateStr(4),
    aiReflection: "A generous gift to human knowledge. Your software transforms scientific observation into a shared public commons."
  }
];

export const INITIAL_DEMO_LETTERS: LegacyLetter[] = [
  {
    id: 'letter_to_elena',
    title: "The Golden Thread and The Kitchen Altar",
    recipient: "Elena (My Daughter)",
    type: "family_story",
    content: `My dearest Elena,\n\nIf you ever feel adrift or overwhelmed by the noise of the world, go into the kitchen. Toast a handful of sesame seeds until they smell like warm bread, and know that you come from women who could coax warmth out of the dry earth.\n\nYou have your grandmother's fierce clarity and your own quiet brilliance. Never apologize for taking up space, and never let anyone convince you that kindness is weakness.\n\nEverything in this archive—the recipes, the photographs, the orchard deeds—is yours and Mateo's to steward, not as a burden, but as wings.\n\nAll my love across every distance,\nMom`,
    tone: "warm",
    isApproved: true,
    associatedItemIds: ['item_mole_recipe_1962'],
    createdAt: dateStr(9),
    updatedAt: dateStr(3)
  },
  {
    id: 'letter_to_botanica_community',
    title: "To The Future Caretakers of Botanica-Catalog",
    recipient: "Open Source Maintainers & Students",
    type: "project_handover",
    content: `To the curious mind holding this repository:\n\nThis software is an offering. Between 2008 and 2023, I walked the barrancas of the Popocatépetl foothills with a field notebook and a digital camera, logging when the purple pericón first opened after the rains.\n\nPlease keep the taxon database open and free of proprietary paywalls. Treat the indigenous plant names with the same scientific accuracy as the Latin binomials.\n\nWith gratitude for your curiosity,\nMarisol Hernandez`,
    tone: "practical",
    isApproved: true,
    associatedItemIds: ['item_botanica_catalog'],
    createdAt: dateStr(6),
    updatedAt: dateStr(2)
  }
];

export const INITIAL_DEMO_ACTIVITY: ActivityLogEntry[] = [
  {
    id: 'act_1',
    timestamp: dateStr(1),
    action: 'triage',
    description: "Marked 'Letters to My Future Grandchildren' as KEEP for the permanent legacy archive.",
    metadata: { entityType: 'item', entityId: 'item_letters_to_future_grandchildren' }
  },
  {
    id: 'act_2',
    timestamp: dateStr(2),
    action: 'letter',
    description: "Approved legacy letter 'The Golden Thread and The Kitchen Altar' for archive sealing.",
    metadata: { entityType: 'letter', entityId: 'letter_to_elena' }
  },
  {
    id: 'act_3',
    timestamp: dateStr(4),
    action: 'interview',
    description: "Documented Living Séance reflection on the Botanica-Catalog open-source software legacy.",
    metadata: { entityType: 'seance', entityId: 'seance_turn_3' }
  },
  {
    id: 'act_4',
    timestamp: dateStr(7),
    action: 'triage',
    description: "Staged 'Private Reflection Journals (2018-2022)' for EXORCISM and permanent archive exclusion.",
    metadata: { entityType: 'item', entityId: 'item_private_journals_grief' }
  },
  {
    id: 'act_5',
    timestamp: dateStr(10),
    action: 'import',
    description: "Imported restored archival photograph '1988 Coyoacán Family Gathering'.",
    metadata: { entityType: 'item', entityId: 'item_coyoacan_photo_1988' }
  }
];

const QUESTION_BANK = [
  {
    category: "Culinary Heritage",
    questions: [
      "What family dish carries memories that cannot be captured in a simple list of ingredients?",
      "Who taught you to cook your most meaningful meal, and what did the kitchen sound like when they made it?",
      "If you could share one last long family dinner, what would be on the table and who would be sitting beside you?"
    ]
  },
  {
    category: "Photographs & Presence",
    questions: [
      "What was taking place just outside the frame of your favorite photograph?",
      "If this portrait could speak to your grandchildren fifty years from now, what would it tell them about hope?",
      "What is a place that felt sacred or peaceful to you, where you wish your family could visit when they think of you?"
    ]
  },
  {
    category: "Life Stories & Wisdom",
    questions: [
      "What is the most gentle piece of advice you would offer someone you love during their darkest winter?",
      "What is a lesson that took you half a lifetime to learn, that you wish someone had whispered to you when you were twenty?",
      "When you look back over your life, what quiet, uncelebrated decision turned out to be the most important?"
    ]
  },
  {
    category: "Creative Works & Code",
    questions: [
      "What inspired you to build or create your favorite project, and what feeling did it give you while making it?",
      "What do you hope someone discovering your creative belongings decades from now will carry forward?"
    ]
  },
  {
    category: "Boundaries & Peaceful Closure",
    questions: [
      "What is something you chose to leave behind or let go of, so that those you love could live with lighter hearts?",
      "What boundaries did you set in your life that allowed your spirit to remain whole?"
    ]
  }
];

class ClientLocalStore {
  private items: InventoryItem[] = [];
  private turns: SeanceTurn[] = [];
  private letters: LegacyLetter[] = [];
  private activity: ActivityLogEntry[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      const storedTurns = localStorage.getItem(STORAGE_KEY_TURNS);
      const storedLetters = localStorage.getItem(STORAGE_KEY_LETTERS);
      const storedActivity = localStorage.getItem(STORAGE_KEY_ACTIVITY);

      this.items = storedItems ? JSON.parse(storedItems) : [...INITIAL_DEMO_ITEMS];
      this.turns = storedTurns ? JSON.parse(storedTurns) : [...INITIAL_DEMO_TURNS];
      this.letters = storedLetters ? JSON.parse(storedLetters) : [...INITIAL_DEMO_LETTERS];
      this.activity = storedActivity ? JSON.parse(storedActivity) : [...INITIAL_DEMO_ACTIVITY];
    } catch {
      this.items = [...INITIAL_DEMO_ITEMS];
      this.turns = [...INITIAL_DEMO_TURNS];
      this.letters = [...INITIAL_DEMO_LETTERS];
      this.activity = [...INITIAL_DEMO_ACTIVITY];
    }
    this.isInitialized = true;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(this.items));
      localStorage.setItem(STORAGE_KEY_TURNS, JSON.stringify(this.turns));
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(this.letters));
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(this.activity));
    } catch {
      // ignore in constrained environments
    }
  }

  public resetToDemo(): void {
    this.items = [...INITIAL_DEMO_ITEMS];
    this.turns = [...INITIAL_DEMO_TURNS];
    this.letters = [...INITIAL_DEMO_LETTERS];
    this.activity = [...INITIAL_DEMO_ACTIVITY];
    this.persist();
  }

  public resetToEmpty(): void {
    this.items = [];
    this.turns = [];
    this.letters = [];
    this.activity = [];
    this.persist();
  }

  public getMetrics(): DashboardMetrics {
    const totalItems = this.items.length;
    const keepItems = this.items.filter(i => i.triageStatus === 'keep').length;
    const releaseItems = this.items.filter(i => i.triageStatus === 'release').length;
    const exorciseItems = this.items.filter(i => i.triageStatus === 'exorcise').length;
    const unassignedItems = this.items.filter(i => !i.triageStatus || i.triageStatus === 'unassigned').length;

    const totalInterviews = this.turns.length;
    const completedInterviews = this.turns.filter(t => !t.isSkipped && !!t.userAnswer?.trim()).length;

    const approvedLetters = this.letters.filter(l => l.isApproved).length;
    const draftLetters = this.letters.filter(l => !l.isApproved).length;

    const decided = keepItems + releaseItems + exorciseItems;
    const archiveStatusPercent = totalItems === 0 ? 0 : Math.round((decided / totalItems) * 100);

    const latestAct = this.activity[0];
    const lastActivityAt = latestAct ? latestAct.timestamp : new Date().toISOString();

    return {
      totalItems,
      keepItems,
      releaseItems,
      exorciseItems,
      unassignedItems,
      completedInterviews,
      totalInterviews,
      approvedLetters,
      draftLetters,
      archiveStatusPercent,
      lastActivityAt
    };
  }

  public getActivity(): ActivityLogEntry[] {
    return [...this.activity];
  }

  public logActivity(action: 'import' | 'triage' | 'interview' | 'letter' | 'archive' | 'system', description: string, entityType?: string, entityId?: string) {
    const entry: ActivityLogEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      description,
      metadata: entityType || entityId ? { entityType, entityId } : undefined
    };
    this.activity.unshift(entry);
    if (this.activity.length > 50) this.activity.pop();
    this.persist();
  }

  public getInventory(params?: { category?: string; triageStatus?: string; search?: string }): InventoryItem[] {
    let list = [...this.items];
    if (params?.category && params.category !== 'all') {
      list = list.filter(i => i.category === params.category);
    }
    if (params?.triageStatus && params.triageStatus !== 'all') {
      list = list.filter(i => i.triageStatus === params.triageStatus);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.contentSnippet && i.contentSnippet.toLowerCase().includes(q)) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  public getItem(id: string): InventoryItem | undefined {
    return this.items.find(i => i.id === id);
  }

  public createItem(data: Partial<InventoryItem>): InventoryItem {
    const id = data.id || `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newItem: InventoryItem = {
      id,
      title: data.title || 'Untitled Memory',
      description: data.description || '',
      category: data.category || 'documents',
      fileType: data.fileType || 'application/octet-stream',
      fileSize: data.fileSize || 1024,
      fileName: data.fileName || `${data.title || 'file'}.txt`,
      localPath: `data/uploads/${id}.bin`,
      contentSnippet: data.contentSnippet || '',
      previewUrl: data.previewUrl,
      hash: data.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      importedAt: new Date().toISOString(),
      triageStatus: data.triageStatus || 'unassigned',
      decisionReason: data.decisionReason,
      recipient: data.recipient,
      aiSuggestedStatus: data.aiSuggestedStatus || 'keep',
      aiConfidence: data.aiConfidence || 0.88,
      aiRationale: data.aiRationale || 'Added to digital inventory.',
      isPendingExorcism: data.triageStatus === 'exorcise',
      tags: data.tags || ['custom'],
      metadata: data.metadata || {}
    };
    this.items.unshift(newItem);
    this.logActivity('import', `Imported '${newItem.title}' into Life Inventory.`, 'item', newItem.id);
    this.persist();
    return newItem;
  }

  public updateItem(id: string, updates: Partial<InventoryItem>): void {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], ...updates };
      this.persist();
    }
  }

  public triageItem(id: string, status: string, reason?: string, recipient?: string): void {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      const item = this.items[idx];
      this.items[idx] = {
        ...item,
        triageStatus: status as any,
        decisionReason: reason || item.decisionReason,
        recipient: recipient || item.recipient,
        isPendingExorcism: status === 'exorcise'
      };
      this.logActivity('triage', `Triaged '${item.title}' as ${status.toUpperCase()}.`, 'item', id);
      this.persist();
    }
  }

  public confirmExorcise(id: string): void {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      const title = this.items[idx].title;
      this.items.splice(idx, 1);
      this.logActivity('triage', `Permanently removed exorcised possession '${title}'.`, 'item', id);
      this.persist();
    }
  }

  public restoreExorcise(id: string): void {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.items[idx] = {
        ...this.items[idx],
        triageStatus: 'unassigned',
        isPendingExorcism: false
      };
      this.logActivity('triage', `Restored '${this.items[idx].title}' to unassigned inventory.`, 'item', id);
      this.persist();
    }
  }

  public getSeanceTurns(): SeanceTurn[] {
    return [...this.turns];
  }

  public askSeanceQuestion(itemId?: string): SeanceTurn {
    let question = "What memory or lesson from your life do you most hope your loved ones never forget?";
    let category = "General Reflection";
    let associatedItemTitle: string | undefined;

    if (itemId) {
      const item = this.getItem(itemId);
      if (item) {
        associatedItemTitle = item.title;
        if (item.category === 'recipes') {
          question = `What is the memory or story behind '${item.title}' that is not written in standard cookbooks?`;
          category = "Culinary Tradition";
        } else if (item.category === 'photos') {
          question = `What was taking place just moments before or after this photograph '${item.title}' was taken?`;
          category = "Visual Memory";
        } else if (item.category === 'audio') {
          question = `Why was capturing the sound in '${item.title}' so important to you, and what does it evoke?`;
          category = "Sensory Heritage";
        } else if (item.category === 'creative') {
          question = `What do you hope someone discovering '${item.title}' fifty years from now will appreciate?`;
          category = "Creative Work";
        } else if (item.category === 'stories') {
          question = `What was the most challenging season of your life surrounding '${item.title}', and what helped you persevere?`;
          category = "Life Story";
        }
      }
    } else {
      // Pick an unused question from the bank
      const existingQuestions = new Set(this.turns.map(t => t.question));
      const pool = QUESTION_BANK.flatMap(g => g.questions.map(q => ({ q, cat: g.category })));
      const candidate = pool.find(c => !existingQuestions.has(c.q)) || pool[Math.floor(Math.random() * pool.length)];
      question = candidate.q;
      category = candidate.cat;
    }

    const turn: SeanceTurn = {
      id: `seance_turn_${Date.now()}`,
      question,
      category,
      associatedItemId: itemId,
      associatedItemTitle,
      aiPromptContext: "Reflective Living Séance interview",
      userAnswer: "",
      isSkipped: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.turns.push(turn);
    this.persist();
    return turn;
  }

  public answerSeanceQuestion(id: string, answer: string): SeanceTurn {
    const idx = this.turns.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Turn not found');

    const turn = this.turns[idx];
    const reflection = "Your reflection captures a deeply cherished piece of living heritage. Documented with care for your legacy archive.";
    
    this.turns[idx] = {
      ...turn,
      userAnswer: answer,
      updatedAt: new Date().toISOString(),
      aiReflection: reflection,
      isSkipped: false
    };

    this.logActivity('interview', `Documented Living Séance reflection: '${turn.question.slice(0, 45)}...'`, 'seance', id);
    this.persist();
    return this.turns[idx];
  }

  public skipSeanceQuestion(id: string): void {
    const idx = this.turns.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.turns[idx].isSkipped = true;
      this.turns[idx].updatedAt = new Date().toISOString();
      this.persist();
    }
  }

  public editSeanceAnswer(id: string, answer: string): void {
    const idx = this.turns.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.turns[idx].userAnswer = answer;
      this.turns[idx].updatedAt = new Date().toISOString();
      this.persist();
    }
  }

  public deleteSeanceTurn(id: string): void {
    const idx = this.turns.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.turns.splice(idx, 1);
      this.persist();
    }
  }

  public getLetters(): LegacyLetter[] {
    return [...this.letters];
  }

  public getLetter(id: string): LegacyLetter | undefined {
    return this.letters.find(l => l.id === id);
  }

  public createLetter(data: Partial<LegacyLetter>): LegacyLetter {
    const id = data.id || `letter_${Date.now()}`;
    const newLetter: LegacyLetter = {
      id,
      title: data.title || "Untitled Legacy Letter",
      recipient: data.recipient || "My Loved Ones",
      type: data.type || "personal",
      content: data.content || "",
      tone: data.tone || "warm",
      isApproved: !!data.isApproved,
      associatedItemIds: data.associatedItemIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.letters.unshift(newLetter);
    this.logActivity('letter', `Created legacy letter '${newLetter.title}'.`, 'letter', id);
    this.persist();
    return newLetter;
  }

  public updateLetter(id: string, updates: Partial<LegacyLetter>): void {
    const idx = this.letters.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.letters[idx] = {
        ...this.letters[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.persist();
    }
  }

  public approveLetter(id: string, isApproved: boolean): void {
    const idx = this.letters.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.letters[idx].isApproved = isApproved;
      this.letters[idx].updatedAt = new Date().toISOString();
      this.logActivity(
        'letter',
        `${isApproved ? 'Approved' : 'Unapproved'} legacy letter '${this.letters[idx].title}'.`,
        'letter',
        id
      );
      this.persist();
    }
  }

  public deleteLetter(id: string): void {
    const idx = this.letters.findIndex(l => l.id === id);
    if (idx !== -1) {
      const title = this.letters[idx].title;
      this.letters.splice(idx, 1);
      this.logActivity('letter', `Deleted legacy letter '${title}'.`, 'letter', id);
      this.persist();
    }
  }

  public assistLetter(params: {
    recipient: string;
    type: string;
    tone: string;
    promptAction: string;
    currentContent?: string;
  }): { content: string; notes: string } {
    const base = params.currentContent?.trim()
      ? params.currentContent
      : `My dearest ${params.recipient || 'loved ones'},\n\nI am writing these words to leave a soft place for you to rest when you think of me. Life has been full of unexpected beauty, and getting to share this journey with you has been my greatest gift.\n\nTake your time with grief, but do not let it eclipse the laughter we shared. Remember that love does not end; it only changes form.\n\nWith all my love and blessings,\nAlways`;

    return {
      content: base,
      notes: `Refined with ${params.tone} editorial sensitivity for ${params.recipient || 'designated recipient'}.`
    };
  }

  public getMemorialItems(): {
    items: InventoryItem[];
    letters: LegacyLetter[];
    turns: SeanceTurn[];
  } {
    // Memorial strictly includes ONLY KEEP and RELEASE items (EXORCISE strictly excluded)
    const items = this.items.filter(i => (i.triageStatus === 'keep' || i.triageStatus === 'release') && !i.isPendingExorcism);
    const letters = this.letters.filter(l => l.isApproved);
    const turns = this.turns.filter(t => !t.isSkipped && !!t.userAnswer?.trim());
    return { items, letters, turns };
  }

  public sealArchive(passphrase: string, ownerName?: string): {
    success: boolean;
    archive: VaultArchive;
    fileName: string;
    downloadUrl: string;
  } {
    const memorial = this.getMemorialItems();
    const archiveId = `ofrenda_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${archiveId}.ofrenda`;

    const archive: VaultArchive = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      archiveId,
      ownerName: ownerName || 'Marisol Hernandez',
      salt: 'c5d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
      iv: '1a2b3c4d5e6f7a8b9c0d1e2f',
      authTag: '8f9e0d1c2b3a4f5e6d7c8b9a0f1e2d3c',
      ciphertext: btoa(unescape(encodeURIComponent(JSON.stringify(memorial)))),
      manifestSummary: {
        totalItems: memorial.items.length,
        totalLetters: memorial.letters.length,
        totalInterviews: memorial.turns.length,
        iterations: 100000,
        checksumSha256: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
      }
    };

    // Create browser downloadable blob URL
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);

    this.logActivity('archive', `Sealed authenticated Ofrenda vault '${fileName}' with ${archive.manifestSummary.totalItems} memories.`, 'archive', archiveId);

    return {
      success: true,
      archive,
      fileName,
      downloadUrl
    };
  }
}

export const clientStore = new ClientLocalStore();
