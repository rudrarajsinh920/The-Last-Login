import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Share2,
  Trash2,
  Sparkles,
  Tag,
  Calendar,
  HardDrive,
  FileCode,
  Utensils,
  BookOpen,
  Music,
  Image,
  AlertTriangle
} from 'lucide-react';
import { InventoryItem, TriageStatus } from '@the-last-login/shared';
import { api } from '../services/api';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate: () => void;
  onOpenSeanceForItem?: (itemId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onUpdate,
  onOpenSeanceForItem
}) => {
  if (!item) return null;

  const [triageStatus, setTriageStatus] = useState<TriageStatus>(item.triageStatus);
  const [decisionReason, setDecisionReason] = useState(item.decisionReason || '');
  const [recipient, setRecipient] = useState(item.recipient || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveTriage = async (newStatus: TriageStatus) => {
    setIsSaving(true);
    try {
      await api.triageItem(item.id, newStatus, decisionReason, recipient);
      setTriageStatus(newStatus);
      onUpdate();
    } catch (err) {
      alert('Failed to update decision');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermanentExorcise = async () => {
    if (confirm(`Permanently EXORCISE and delete "${item.title}"? This cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await api.confirmExorcise(item.id);
        onUpdate();
        onClose();
      } catch (e) {
        alert('Failed to delete item');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const categoryIcons: Record<string, any> = {
    photos: Image,
    recipes: Utensils,
    documents: HardDrive,
    audio: Music,
    stories: BookOpen,
    creative: FileCode,
    other: Tag
  };
  const CategoryIcon = categoryIcons[item.category] || Tag;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-olive-950/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-parchment-100 border border-parchment-300 w-full max-w-2xl rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-parchment-200 border-b border-parchment-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-200 text-olive-900 flex items-center justify-center border border-sage-300">
              <CategoryIcon className="w-5 h-5 text-olive-800" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sage-600 font-semibold">
                {item.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-olive-900 leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-olive-600 hover:text-olive-900 hover:bg-parchment-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Visual Preview */}
          {item.previewUrl && (
            <div className="rounded-xl overflow-hidden border border-parchment-300 max-h-64 flex items-center justify-center bg-olive-950">
              <img
                src={item.previewUrl}
                alt={item.title}
                className="w-full h-full object-cover max-h-64"
              />
            </div>
          )}

          {/* Snippet / Notes */}
          {item.contentSnippet && (
            <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-300 text-sm text-olive-900 font-serif italic">
              "{item.contentSnippet}"
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div>
              <h4 className="text-xs font-mono uppercase text-olive-700 tracking-wider mb-1 font-semibold">
                Context & Meaning
              </h4>
              <p className="text-sm text-olive-900 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* AI Suggestion Box */}
          {item.aiSuggestedStatus && (
            <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-olive-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-marigold-600" />
                  Local AI Suggestion
                </span>
                <span className="font-mono text-sage-700 uppercase font-bold">
                  {item.aiSuggestedStatus} ({Math.round((item.aiConfidence || 0.8) * 100)}% match)
                </span>
              </div>
              <p className="text-olive-800 italic">
                "{item.aiRationale}"
              </p>
            </div>
          )}

          {/* Triage Selector - Keep, Release, Exorcise */}
          <div className="space-y-3 pt-2 border-t border-parchment-300">
            <h4 className="text-xs font-mono uppercase text-olive-700 tracking-wider font-semibold">
              Your Decision (User has final authority)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSaveTriage('keep')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  triageStatus === 'keep'
                    ? 'bg-sage-600 text-parchment-50 border-sage-700 shadow-md font-semibold'
                    : 'bg-parchment-50 text-olive-800 border-parchment-300 hover:bg-sage-100'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">KEEP</span>
                <span className="text-[10px] opacity-80 block">Preserve in Vault</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveTriage('release')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  triageStatus === 'release'
                    ? 'bg-marigold-500 text-olive-950 border-marigold-600 shadow-md font-semibold'
                    : 'bg-parchment-50 text-olive-800 border-parchment-300 hover:bg-marigold-100'
                }`}
              >
                <Share2 className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">RELEASE</span>
                <span className="text-[10px] opacity-80 block">Gift to Recipient</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveTriage('exorcise')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  triageStatus === 'exorcise'
                    ? 'bg-terracotta-500 text-parchment-50 border-terracotta-600 shadow-md font-semibold'
                    : 'bg-parchment-50 text-olive-800 border-parchment-300 hover:bg-terracotta-100'
                }`}
              >
                <Trash2 className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">EXORCISE</span>
                <span className="text-[10px] opacity-80 block">Exclude / Delete</span>
              </button>
            </div>
          </div>

          {/* Recipient & Reason Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                Designated Recipient
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Elena (Daughter), Open Source Community"
                className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                Reason for Decision
              </label>
              <input
                type="text"
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="Why preserve or release this?"
                className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
              />
            </div>
          </div>

          {/* Pending Exorcism Confirmation Alert */}
          {item.isPendingExorcism && (
            <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-terracotta-900">
                    Marked for Exorcism (Staged for Deletion)
                  </p>
                  <p className="mt-0.5">
                    This file is currently excluded from the sealed ofrenda. You can cancel this anytime, or confirm permanent deletion right now.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePermanentExorcise}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-lg font-semibold shrink-0 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          )}

          {/* Technical Metadata */}
          <div className="pt-4 border-t border-parchment-300 space-y-1 text-xs font-mono text-olive-700">
            <div className="flex justify-between">
              <span>File Name:</span>
              <span className="text-olive-900">{item.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="text-olive-900">{(item.fileSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between">
              <span>Imported:</span>
              <span className="text-olive-900">{new Date(item.importedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between truncate">
              <span>SHA-256 Hash:</span>
              <span className="text-olive-900 truncate max-w-xs">{item.hash}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-parchment-200 border-t border-parchment-300 flex items-center justify-between">
          {onOpenSeanceForItem ? (
            <button
              onClick={() => {
                onClose();
                onOpenSeanceForItem(item.id);
              }}
              className="text-xs font-medium text-marigold-700 hover:text-marigold-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Reflect on this in Living Séance &rarr;</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-parchment-100 hover:bg-parchment-300 text-olive-900 border border-parchment-300 rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => handleSaveTriage(triageStatus)}
              disabled={isSaving}
              className="px-5 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Decision'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
