import React from 'react';
import { Plus, Shield, Flame, Menu } from 'lucide-react';
import { CandleGlow } from './CandleGlow';

interface NavbarProps {
  title: string;
  subtitle?: string;
  onOpenImport?: () => void;
  onQuickSeal?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  onOpenImport,
  onQuickSeal,
  onToggleMobileMenu
}) => {
  return (
    <header className="bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-olive-800 hover:bg-parchment-300 transition-colors shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-olive-900 tracking-tight truncate">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-sage-200/70 text-olive-800 border border-sage-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-600"></span>
              Private Local Mode
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-olive-700/80 mt-0.5 font-sans hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
        {onOpenImport && (
          <button
            onClick={onOpenImport}
            aria-label="Add item to inventory"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-parchment-200 hover:bg-parchment-300 text-olive-900 border border-olive-900/15 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-98 focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marigold-600 shrink-0" />
            <span className="hidden sm:inline">Add to Inventory</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {onQuickSeal && (
          <button
            onClick={onQuickSeal}
            aria-label="Seal Ofrenda archive"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md active:scale-98 hover:shadow-glow-marigold focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marigold-400 shrink-0" />
            <span className="hidden sm:inline">Seal Ofrenda</span>
            <span className="sm:hidden">Seal</span>
          </button>
        )}
      </div>
    </header>
  );
};
