import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Plus,
  Image,
  Utensils,
  FileText,
  Music,
  BookOpen,
  Code,
  ShieldCheck,
  Share2,
  Trash2,
  HelpCircle,
  Sparkles,
  HardDrive
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';
import { InventoryItem, ItemCategory, TriageStatus } from '@the-last-login/shared';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { ItemThumbnail } from '../components/ItemThumbnail';

interface InventoryPageProps {
  onOpenImport: () => void;
  onOpenSeanceForItem: (itemId: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onOpenImport, onOpenSeanceForItem }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => clientStore.getInventory());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, [selectedCategory, selectedStatus, search]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        triageStatus: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: search.trim() || undefined
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Belongings', icon: FolderOpen },
    { id: 'photos', label: 'Photographs', icon: Image },
    { id: 'recipes', label: 'Family Recipes', icon: Utensils },
    { id: 'documents', label: 'Documents & Deeds', icon: FileText },
    { id: 'audio', label: 'Audio & Voices', icon: Music },
    { id: 'stories', label: 'Personal Stories', icon: BookOpen },
    { id: 'creative', label: 'Creative & Code', icon: Code },
  ];

  const getStatusBadge = (status: TriageStatus, isPending?: boolean) => {
    if (status === 'keep') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sage-100 text-sage-800 border border-sage-300">
          <ShieldCheck className="w-3 h-3 text-sage-600" />
          KEEP
        </span>
      );
    }
    if (status === 'release') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-marigold-100 text-marigold-800 border border-marigold-300">
          <Share2 className="w-3 h-3 text-marigold-600" />
          RELEASE
        </span>
      );
    }
    if (status === 'exorcise') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-terracotta-100 text-terracotta-800 border border-terracotta-300">
          <Trash2 className="w-3 h-3 text-terracotta-600" />
          {isPending ? 'PENDING EXORCISM' : 'EXORCISE'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-parchment-200 text-olive-700 border border-parchment-300">
        <HelpCircle className="w-3 h-3 text-olive-500" />
        UNASSIGNED
      </span>
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'photos': return Image;
      case 'recipes': return Utensils;
      case 'documents': return FileText;
      case 'audio': return Music;
      case 'stories': return BookOpen;
      case 'creative': return Code;
      default: return FolderOpen;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-w-0 space-y-5 sm:space-y-6 animate-fade-in">
      {/* Page Title & Local Storage Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-olive-900 tracking-tight">
            Life Inventory
          </h2>
          <p className="text-xs sm:text-sm text-olive-700 mt-0.5">
            Explicitly cataloged possessions. Stored entirely on your local machine with cryptographic integrity hashes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-mono text-olive-800">
            <HardDrive className="w-3.5 h-3.5 text-sage-600" />
            <span>Local Storage: 100% Offline</span>
          </div>
        </div>
      </div>

      {/* Category Pills Bar with Touch-Friendly Scroll Cue */}
      <div className="relative w-full min-w-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x pr-6 sm:pr-0">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 min-h-[38px] ${
                  isSelected
                    ? 'bg-olive-900 text-parchment-50 shadow-sm font-semibold'
                    : 'bg-parchment-100 text-olive-800 hover:bg-parchment-300 border border-parchment-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-marigold-400' : 'text-sage-600'}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
        {/* Soft edge scroll fade on mobile */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-1.5 w-8 bg-gradient-to-l from-parchment-200 to-transparent sm:hidden" />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-parchment-100 border border-parchment-300 shadow-soft-card flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between w-full min-w-0">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-olive-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, description, or tags..."
            className="w-full pl-9 pr-4 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-olive-700">
            <Filter className="w-3.5 h-3.5 text-sage-600" />
            <span className="font-medium">Decision:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-olive-900 focus:outline-none focus:ring-2 focus:ring-marigold-500 font-medium"
          >
            <option value="all">All Decisions</option>
            <option value="keep">Keep (Preserve)</option>
            <option value="release">Release (Gift)</option>
            <option value="exorcise">Exorcise (Exclude)</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Item Card Grid */}
      {loading ? (
        <div className="py-16 text-center text-olive-600 text-sm font-serif italic">
          Reading local memory catalog...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-parchment-100 border border-parchment-300 p-8 space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-sage-400" />
          <h4 className="font-serif text-lg font-bold text-olive-900">
            No Belongings Match Your Filter
          </h4>
          <p className="text-xs text-olive-700 max-w-sm mx-auto">
            Try adjusting your search criteria or add new items to your digital inventory.
          </p>
          <button
            onClick={onOpenImport}
            className="mt-2 px-4 py-2 bg-olive-900 text-parchment-50 rounded-xl text-xs font-semibold"
          >
            Add New Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
          {items.map((item) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group rounded-2xl bg-parchment-100 border border-parchment-300 hover:border-marigold-400/80 p-4 sm:p-5 shadow-soft-card hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between w-full min-w-0 max-w-full overflow-hidden"
              >
                <div className="min-w-0">
                  {/* Top line: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-sage-700 uppercase font-semibold truncate">
                      <Icon className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                      <span className="truncate">{item.category}</span>
                    </span>
                    <div className="shrink-0">
                      {getStatusBadge(item.triageStatus, item.isPendingExorcism)}
                    </div>
                  </div>

                  {/* Item Visual Thumbnail */}
                  <div className="mb-3 w-full overflow-hidden">
                    <ItemThumbnail item={item} heightClass="h-40" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-olive-900 group-hover:text-olive-950 leading-snug mb-1.5 break-words line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-olive-700 line-clamp-2 leading-relaxed mb-3 break-words">
                    {item.description || item.contentSnippet || 'Digital memory document.'}
                  </p>

                  {/* AI Suggestion pill */}
                  {item.aiSuggestedStatus && (
                    <div className="p-2 rounded-lg bg-sage-50 border border-sage-200/80 text-[11px] text-olive-800 flex items-center gap-1.5 mb-3 min-w-0">
                      <Sparkles className="w-3 h-3 text-marigold-600 shrink-0" />
                      <span className="truncate">
                        AI: <strong className="uppercase">{item.aiSuggestedStatus}</strong> ({Math.round((item.aiConfidence || 0.8) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata */}
                <div className="pt-3 border-t border-parchment-200 flex items-center justify-between text-[11px] font-mono text-olive-600 gap-2 min-w-0">
                  <span className="shrink-0">{(item.fileSize / 1024).toFixed(1)} KB</span>
                  <span className="truncate text-right">{item.recipient || 'No recipient set'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={loadInventory}
        onOpenSeanceForItem={onOpenSeanceForItem}
      />
    </div>
  );
};
