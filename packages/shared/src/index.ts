import { z } from 'zod';

export const ItemCategorySchema = z.enum([
  'photos',
  'documents',
  'recipes',
  'audio',
  'stories',
  'creative',
  'other'
]);
export type ItemCategory = z.infer<typeof ItemCategorySchema>;

export const TriageStatusSchema = z.enum(['unassigned', 'keep', 'release', 'exorcise']);
export type TriageStatus = z.infer<typeof TriageStatusSchema>;

export const InventoryItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  category: ItemCategorySchema,
  fileType: z.string(),
  fileSize: z.number().nonnegative(),
  fileName: z.string(),
  localPath: z.string(),
  contentSnippet: z.string().optional(),
  previewUrl: z.string().optional(),
  hash: z.string(),
  importedAt: z.string(),
  triageStatus: TriageStatusSchema.default('unassigned'),
  decisionReason: z.string().optional(),
  recipient: z.string().optional(),
  aiSuggestedStatus: TriageStatusSchema.optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  aiRationale: z.string().optional(),
  isPendingExorcism: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
});
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const SeanceTurnSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.string(),
  associatedItemId: z.string().optional(),
  associatedItemTitle: z.string().optional(),
  aiPromptContext: z.string().optional(),
  userAnswer: z.string().optional(),
  isSkipped: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  aiReflection: z.string().optional(),
});
export type SeanceTurn = z.infer<typeof SeanceTurnSchema>;

export const LetterToneSchema = z.enum(['warm', 'practical', 'reflective', 'gentle']);
export type LetterTone = z.infer<typeof LetterToneSchema>;

export const LetterTypeSchema = z.enum([
  'personal',
  'family_story',
  'recipe_history',
  'photo_reflection',
  'project_handover',
  'instructions'
]);
export type LetterType = z.infer<typeof LetterTypeSchema>;

export const LegacyLetterSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  recipient: z.string().min(1, 'Recipient is required'),
  type: LetterTypeSchema.default('personal'),
  content: z.string(),
  tone: LetterToneSchema.default('reflective'),
  isApproved: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  associatedItemIds: z.array(z.string()).default([]),
});
export type LegacyLetter = z.infer<typeof LegacyLetterSchema>;

export const VaultArchiveSchema = z.object({
  version: z.string(),
  createdAt: z.string(),
  archiveId: z.string(),
  ownerName: z.string(),
  salt: z.string(),
  iv: z.string(),
  authTag: z.string(),
  ciphertext: z.string(),
  manifestSummary: z.object({
    totalItems: z.number(),
    totalLetters: z.number(),
    totalInterviews: z.number(),
    checksumSha256: z.string(),
  }),
});
export type VaultArchive = z.infer<typeof VaultArchiveSchema>;

export const SystemSettingsSchema = z.object({
  ollamaEndpoint: z.string().default('http://localhost:11434'),
  ollamaModel: z.string().default('gemma2:latest'),
  enableLocalHeuristics: z.boolean().default(true),
  ownerName: z.string().default('Marisol Hernandez'),
  encryptionHint: z.string().default('Family secret / Abuela birthday year'),
  theme: z.enum(['parchment', 'dark-olive']).default('parchment'),
});
export type SystemSettings = z.infer<typeof SystemSettingsSchema>;

export interface DashboardMetrics {
  totalItems: number;
  keepItems: number;
  releaseItems: number;
  exorciseItems: number;
  unassignedItems: number;
  completedInterviews: number;
  totalInterviews: number;
  approvedLetters: number;
  draftLetters: number;
  archiveStatusPercent: number;
  lastActivityAt: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: 'import' | 'triage' | 'interview' | 'letter' | 'archive' | 'system';
  description: string;
  metadata?: Record<string, any>;
}
