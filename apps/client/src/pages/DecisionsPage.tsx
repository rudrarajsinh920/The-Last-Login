import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Share2,
  Trash2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  User,
  ArrowRight,
  FolderArchive
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';
import { InventoryItem, TriageStatus } from '@the-last-login/shared';

export const DecisionsPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => clientStore.getInventory());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unassigned' | 'keep' | 'release' | 'exorcise'>('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editRecipient, setEditRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTriage = async (item: InventoryItem, newStatus: TriageStatus) => {
    const reason = editReason || item.decisionReason || (newStatus === 'keep' ? 'Preserve in family archive' : newStatus === 'release' ? 'Gift to designated loved one' : 'Personal privacy boundary');
    const recipient = editRecipient || item.recipient || (newStatus === 'release' ? 'Elena (Daughter)' : '');

    try {
      await api.triageItem(item.id, newStatus, reason, recipient);
      setItems(prev => prev.map(i => i.id === item.id ? {
        ...i,
        triageStatus: newStatus,
        decisionReason: reason,
        recipient: recipient,
        isPendingExorcism: newStatus === 'exorcise'
      } : i));
      setEditingItemId(null);
    } catch (e) {
      alert('Failed to update decision');
    }
  };

  const handlePermanentDelete = async (itemId: string, title: string) => {
    if (confirm(`Are you certain you wish to permanently delete "${title}"? This cannot be undone.`)) {
      try {
        await api.confirmExorcise(itemId);
        setItems(prev => prev.filter(i => i.id !== itemId));
      } catch (e) {
        alert('Failed to delete item');
      }
    }
  };

  const handleRestore = async (itemId: string) => {
    try {
      await api.restoreExorcise(itemId);
      setItems(prev => prev.map(i => i.id === itemId ? {
        ...i,
        triageStatus: 'unassigned',
        isPendingExorcism: false
      } : i));
    } catch (e) {
      alert('Failed to restore item');
    }
  };

  // Metrics
  const keepCount = items.filter(i => i.triageStatus === 'keep').length;
  const releaseCount = items.filter(i => i.triageStatus === 'release').length;
  const exorciseCount = items.filter(i => i.triageStatus === 'exorcise').length;
  const unassignedCount = items.filter(i => i.triageStatus === 'unassigned').length;

  const filteredItems = items.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.triageStatus === selectedFilter;
  });

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-olive-900 tracking-tight">
            Keep / Release / Exorcise
          </h2>
          <p className="text-xs text-olive-700 mt-1">
            Conscious digital triage. AI offers advisory classifications; you have 100% decision authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-olive-700">
            {unassignedCount} Remaining Unassigned
          </span>
        </div>
      </div>

      {/* Three Tactile Folder Cards (Faithfully inspired by Visual Reference Media 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FOLDER 1: KEEP */}
        <div
          onClick={() => setSelectedFilter(selectedFilter === 'keep' ? 'all' : 'keep')}
          className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative overflow-hidden border ${
            selectedFilter === 'keep'
              ? 'bg-sage-600 text-parchment-50 border-sage-700 shadow-elevated scale-102'
              : 'bg-sage-100 hover:bg-sage-200 text-olive-900 border-sage-300 shadow-soft-card'
          }`}
        >
          {/* Tab folder header shape */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-10 rounded-t-xl bg-sage-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sage-800" />
            </div>
            <span className="font-serif text-3xl font-bold">{keepCount}</span>
          </div>

          <h3 className="font-serif text-xl font-bold mb-1">
            KEEP
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            Preserve in your sealed personal digital legacy archive for future generations.
          </p>
        </div>

        {/* FOLDER 2: RELEASE */}
        <div
          onClick={() => setSelectedFilter(selectedFilter === 'release' ? 'all' : 'release')}
          className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative overflow-hidden border ${
            selectedFilter === 'release'
              ? 'bg-marigold-500 text-olive-950 border-marigold-600 shadow-elevated scale-102'
              : 'bg-marigold-100 hover:bg-marigold-200 text-olive-900 border-marigold-300 shadow-soft-card'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-10 rounded-t-xl bg-marigold-500/30 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-marigold-800" />
            </div>
            <span className="font-serif text-3xl font-bold">{releaseCount}</span>
          </div>

          <h3 className="font-serif text-xl font-bold mb-1">
            RELEASE
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            Prepare to be transferred or gifted to a specific loved one, notary, or community.
          </p>
        </div>

        {/* FOLDER 3: EXORCISE */}
        <div
          onClick={() => setSelectedFilter(selectedFilter === 'exorcise' ? 'all' : 'exorcise')}
          className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative overflow-hidden border ${
            selectedFilter === 'exorcise'
              ? 'bg-terracotta-500 text-parchment-50 border-terracotta-600 shadow-elevated scale-102'
              : 'bg-terracotta-100 hover:bg-terracotta-200 text-olive-900 border-terracotta-300 shadow-soft-card'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-10 rounded-t-xl bg-terracotta-500/30 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-terracotta-800" />
            </div>
            <span className="font-serif text-3xl font-bold">{exorciseCount}</span>
          </div>

          <h3 className="font-serif text-xl font-bold mb-1">
            EXORCISE
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            Mark for exclusion or deletion. Staged safely until confirmed; never included in the vault.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-300 pb-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {(['all', 'unassigned', 'keep', 'release', 'exorcise'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-marigold-500 ${
                selectedFilter === tab
                  ? 'bg-olive-900 text-parchment-50 font-bold shadow-sm'
                  : 'text-olive-700 hover:bg-parchment-300'
              }`}
            >
              {tab} {tab === 'all' ? `(${items.length})` : tab === 'unassigned' ? `(${unassignedCount})` : ''}
            </button>
          ))}
        </div>

        <span className="text-xs text-olive-600 font-mono shrink-0">
          Showing {filteredItems.length} possessions
        </span>
      </div>

      {/* Items Triage List */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isPending = item.isPendingExorcism;
          const isEditing = editingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-6 border transition-all ${
                isPending
                  ? 'bg-terracotta-50/70 border-terracotta-300 shadow-sm'
                  : item.triageStatus === 'keep'
                  ? 'bg-parchment-100 border-sage-300 shadow-soft-card'
                  : item.triageStatus === 'release'
                  ? 'bg-parchment-100 border-marigold-300 shadow-soft-card'
                  : 'bg-parchment-100 border-parchment-300 shadow-soft-card'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Metadata & Context */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-sage-700">
                      {item.category}
                    </span>
                    <span className="text-olive-400">•</span>
                    <span className="text-xs font-mono text-olive-600">
                      {(item.fileSize / 1024).toFixed(1)} KB
                    </span>
                    {item.aiSuggestedStatus && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-sage-50 text-sage-800 border border-sage-200">
                        <Sparkles className="w-3 h-3 text-marigold-600" />
                        AI Advisory: {item.aiSuggestedStatus.toUpperCase()} ({Math.round((item.aiConfidence || 0.8) * 100)}%)
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-olive-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-olive-700 leading-relaxed">
                    {item.description || item.contentSnippet}
                  </p>

                  {/* AI Rationale */}
                  {item.aiRationale && (
                    <p className="text-[11px] text-olive-600 italic">
                      Advice: "{item.aiRationale}"
                    </p>
                  )}

                  {/* Decision rationale & recipient display */}
                  {item.decisionReason && (
                    <div className="text-xs text-olive-800 font-sans pt-1">
                      <strong>Reason: </strong> {item.decisionReason}
                      {item.recipient && (
                        <span className="ml-3 inline-flex items-center gap-1 text-olive-900 font-medium">
                          <User className="w-3 h-3 text-marigold-600" />
                          Recipient: {item.recipient}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Pending Exorcism Notice */}
                  {isPending && (
                    <div className="p-3 rounded-xl bg-terracotta-100 border border-terracotta-300 text-xs text-terracotta-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-terracotta-600 shrink-0" />
                        <span>Staged for permanent deletion. Excluded from sealed archive.</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRestore(item.id)}
                          className="px-2.5 py-1 bg-parchment-100 hover:bg-parchment-200 text-olive-900 rounded-lg font-medium transition-colors"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(item.id, item.title)}
                          className="px-2.5 py-1 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Confirm Deletion
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Triage Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTriage(item, 'keep')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      item.triageStatus === 'keep'
                        ? 'bg-sage-600 text-parchment-50 shadow-md ring-2 ring-sage-400'
                        : 'bg-parchment-200 text-olive-800 hover:bg-sage-100 hover:text-sage-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>KEEP</span>
                  </button>

                  <button
                    onClick={() => handleTriage(item, 'release')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      item.triageStatus === 'release'
                        ? 'bg-marigold-500 text-olive-950 shadow-md ring-2 ring-marigold-400'
                        : 'bg-parchment-200 text-olive-800 hover:bg-marigold-100 hover:text-marigold-900'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>RELEASE</span>
                  </button>

                  <button
                    onClick={() => handleTriage(item, 'exorcise')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      item.triageStatus === 'exorcise'
                        ? 'bg-terracotta-500 text-parchment-50 shadow-md ring-2 ring-terracotta-400'
                        : 'bg-parchment-200 text-olive-800 hover:bg-terracotta-100 hover:text-terracotta-900'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>EXORCISE</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
