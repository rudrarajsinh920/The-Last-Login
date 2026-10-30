import React, { useState } from 'react';
import {
  Image,
  Utensils,
  FileText,
  Music,
  BookOpen,
  Code,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { InventoryItem, ItemCategory } from '@the-last-login/shared';

interface ItemThumbnailProps {
  item: InventoryItem;
  className?: string;
  heightClass?: string;
}

export const ItemThumbnail: React.FC<ItemThumbnailProps> = ({
  item,
  className = '',
  heightClass = 'h-36'
}) => {
  const [hasError, setHasError] = useState(false);

  const getCategoryTheme = (category: ItemCategory) => {
    switch (category) {
      case 'recipes':
        return {
          icon: Utensils,
          label: 'Culinary Heirloom',
          gradient: 'from-[#8C5D35] via-[#4A3222] to-olive-950',
          accent: 'text-marigold-400'
        };
      case 'creative':
        return {
          icon: Code,
          label: 'Creative & Code',
          gradient: 'from-[#2F4F3F] via-[#1E3329] to-olive-950',
          accent: 'text-sage-400'
        };
      case 'photos':
        return {
          icon: Image,
          label: 'Visual Memory',
          gradient: 'from-[#42362C] via-[#261E18] to-olive-950',
          accent: 'text-marigold-300'
        };
      case 'stories':
        return {
          icon: BookOpen,
          label: 'Personal Story',
          gradient: 'from-[#5A3828] via-[#352016] to-olive-950',
          accent: 'text-terracotta-400'
        };
      case 'audio':
        return {
          icon: Music,
          label: 'Audio Soundscape',
          gradient: 'from-[#3B4C53] via-[#202B30] to-olive-950',
          accent: 'text-sage-300'
        };
      case 'documents':
      default:
        return {
          icon: FileText,
          label: 'Official Document',
          gradient: 'from-[#444E3D] via-[#22291E] to-olive-950',
          accent: 'text-marigold-400'
        };
    }
  };

  const theme = getCategoryTheme(item.category);
  const Icon = theme.icon;

  if (item.previewUrl && !hasError) {
    return (
      <div className={`rounded-xl overflow-hidden ${heightClass} bg-olive-950 relative border border-parchment-300/80 ${className}`}>
        <img
          src={item.previewUrl}
          alt={item.title}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Graceful, warm Digital Ofrenda fallback banner
  return (
    <div
      className={`rounded-xl overflow-hidden ${heightClass} bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center p-4 relative border border-parchment-300/80 shadow-inner select-none ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-marigold-500/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-terracotta-500/10 blur-xl pointer-events-none" />

      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
        <Icon className={`w-5 h-5 ${theme.accent}`} />
      </div>

      <span className="text-[10px] font-mono tracking-widest uppercase text-parchment-200/90 font-semibold">
        {theme.label}
      </span>
      <span className="text-[11px] font-serif italic text-parchment-300/80 mt-0.5 max-w-[180px] truncate text-center">
        {item.fileName || item.title}
      </span>
    </div>
  );
};
