import { db, logActivity } from '../db/database';
import { InventoryItem, LegacyLetter, SeanceTurn } from '@the-last-login/shared';

export function loadMarisolDemoData() {
  // Clear current data first
  db.prepare('DELETE FROM inventory_items').run();
  db.prepare('DELETE FROM seance_turns').run();
  db.prepare('DELETE FROM legacy_letters').run();
  db.prepare('DELETE FROM activity_logs').run();

  try {
    db.prepare('DELETE FROM inventory_fts').run();
  } catch (e) {
    // ignore
  }

  const now = new Date();
  const dateStr = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

  // Demo inventory items for Marisol
  const demoItems: InventoryItem[] = [
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
      previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
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
      previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
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

  // Insert items into database
  const insertItem = db.prepare(`
    INSERT OR REPLACE INTO inventory_items (
      id, title, description, category, fileType, fileSize, fileName, localPath,
      contentSnippet, previewUrl, hash, importedAt, triageStatus, decisionReason,
      recipient, aiSuggestedStatus, aiConfidence, aiRationale, isPendingExorcism,
      tags, metadata
    ) VALUES (
      @id, @title, @description, @category, @fileType, @fileSize, @fileName, @localPath,
      @contentSnippet, @previewUrl, @hash, @importedAt, @triageStatus, @decisionReason,
      @recipient, @aiSuggestedStatus, @aiConfidence, @aiRationale, @isPendingExorcism,
      @tags, @metadata
    )
  `);

  const insertFts = db.prepare(`
    INSERT INTO inventory_fts (id, title, description, contentSnippet, tags, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const item of demoItems) {
    insertItem.run({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      fileType: item.fileType,
      fileSize: item.fileSize,
      fileName: item.fileName,
      localPath: item.localPath,
      contentSnippet: item.contentSnippet || null,
      previewUrl: item.previewUrl || null,
      hash: item.hash,
      importedAt: item.importedAt,
      triageStatus: item.triageStatus || 'unassigned',
      decisionReason: item.decisionReason || null,
      recipient: item.recipient || null,
      aiSuggestedStatus: item.aiSuggestedStatus || null,
      aiConfidence: item.aiConfidence || null,
      aiRationale: item.aiRationale || null,
      isPendingExorcism: item.isPendingExorcism ? 1 : 0,
      tags: JSON.stringify(item.tags || []),
      metadata: JSON.stringify(item.metadata || {})
    });

    try {
      insertFts.run(
        item.id,
        item.title,
        item.description,
        item.contentSnippet || '',
        item.tags.join(' '),
        item.category
      );
    } catch (e) {
      // ignore
    }
  }

  // Living Séance turns
  const demoTurns: SeanceTurn[] = [
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

  const insertTurn = db.prepare(`
    INSERT OR REPLACE INTO seance_turns (
      id, question, category, associatedItemId, associatedItemTitle,
      aiPromptContext, userAnswer, isSkipped, createdAt, updatedAt, aiReflection
    ) VALUES (
      @id, @question, @category, @associatedItemId, @associatedItemTitle,
      @aiPromptContext, @userAnswer, @isSkipped, @createdAt, @updatedAt, @aiReflection
    )
  `);

  for (const turn of demoTurns) {
    insertTurn.run({
      id: turn.id,
      question: turn.question,
      category: turn.category,
      associatedItemId: turn.associatedItemId || null,
      associatedItemTitle: turn.associatedItemTitle || null,
      aiPromptContext: turn.aiPromptContext || null,
      userAnswer: turn.userAnswer || null,
      isSkipped: turn.isSkipped ? 1 : 0,
      createdAt: turn.createdAt,
      updatedAt: turn.updatedAt,
      aiReflection: turn.aiReflection || null
    });
  }

  // Legacy Letters
  const demoLetters: LegacyLetter[] = [
    {
      id: 'letter_to_elena',
      title: "The Golden Thread and The Kitchen Altar",
      recipient: "Elena (My Daughter)",
      type: "family_story",
      content: `My dearest Elena,\n\nIf you ever feel adrift or overwhelmed by the noise of the world, go into the kitchen. Toast a handful of sesame seeds until they smell like warm bread, and know that you come from women who could coax warmth out of the dry earth.\n\nYou have your grandmother's fierce clarity and your own quiet brilliance. Never apologize for taking up space, and never let anyone convince you that kindness is weakness.\n\nEverything in this archive—the recipes, the photographs, the orchard deeds—is yours and Mateo's to steward, not as a burden, but as wings.\n\nAll my love across every distance,\nMom`,
      tone: "warm",
      isApproved: true,
      createdAt: dateStr(9),
      updatedAt: dateStr(9),
      associatedItemIds: ['item_mole_recipe_1962', 'item_coyoacan_photo_1988']
    },
    {
      id: 'letter_to_botanica_community',
      title: "Handover Notice to Botanica Open Source Stewards",
      recipient: "Open Source Contributors & Archivists",
      type: "project_handover",
      content: `To the contributors and maintainers of Botanica-Catalog,\n\nFor fifteen years, this repository has been my labor of love. The database contains over 1,400 verified specimen records with indigenous Nahuatl names and botanical taxonomy.\n\nI have ensured that all documentation and API keys for the open mirrors are verified in this release. Please continue to keep this database free, accessible, and grounded in ecological stewardship.\n\nThank you for every pull request, bug fix, and plant photograph shared.\n\nWith gratitude,\nMarisol Hernandez`,
      tone: "practical",
      isApproved: true,
      createdAt: dateStr(6),
      updatedAt: dateStr(6),
      associatedItemIds: ['item_botanica_catalog']
    },
    {
      id: 'letter_to_mateo',
      title: "Remembering Our Parents' Porch in Cholula",
      recipient: "Mateo (Brother)",
      type: "personal",
      content: `Hermano,\n\nLooking at the 1988 photo of us in Coyoacán made me smile until my eyes watered. Remember when you dropped the clay pot and we blamed the neighbor's cat?\n\nI've assigned the orchard deeds and legal filings to you. Take care of the lime trees, Mateo. They still bloom twice a year if you water them before the noon sun.\n\nThank you for always being in my corner.`,
      tone: "reflective",
      isApproved: false, // In Draft
      createdAt: dateStr(3),
      updatedAt: dateStr(3),
      associatedItemIds: ['item_cholula_orchard_deed', 'item_coyoacan_photo_1988']
    }
  ];

  const insertLetter = db.prepare(`
    INSERT OR REPLACE INTO legacy_letters (
      id, title, recipient, type, content, tone, isApproved, createdAt, updatedAt, associatedItemIds
    ) VALUES (
      @id, @title, @recipient, @type, @content, @tone, @isApproved, @createdAt, @updatedAt, @associatedItemIds
    )
  `);

  for (const letter of demoLetters) {
    insertLetter.run({
      ...letter,
      isApproved: letter.isApproved ? 1 : 0,
      associatedItemIds: JSON.stringify(letter.associatedItemIds)
    });
  }

  // Initial Activity Log entries
  logActivity('system', 'Loaded fictional demo dataset for Marisol Hernandez', { scenario: 'marisol' });
  logActivity('import', 'Imported 7 legacy items into digital inventory');
  logActivity('interview', 'Completed 3 Living Séance reflective interview questions');
  logActivity('letter', 'Approved legacy letter: "The Golden Thread and The Kitchen Altar"');
  logActivity('triage', 'Triaged item "Private Reflection Journals": EXORCISE (Pending confirmation)');
}

export function resetWorkspaceData() {
  db.prepare('DELETE FROM inventory_items').run();
  db.prepare('DELETE FROM seance_turns').run();
  db.prepare('DELETE FROM legacy_letters').run();
  db.prepare('DELETE FROM activity_logs').run();
  try {
    db.prepare('DELETE FROM inventory_fts').run();
  } catch (e) {
    // ignore
  }
  logActivity('system', 'Workspace reset to fresh empty state');
}
