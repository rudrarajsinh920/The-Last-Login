import React from 'react';
import { Plus, Shield, Flame, Info } from 'lucide-react';
import { CandleGlow } from './CandleGlow';

interface NavbarProps {
  title: string;
  subtitle?: string;
  onOpenImport?: () => void;
  onQuickSeal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  onOpenImport,
  onQuickSeal
}) => {
  return (
    <header className="bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-olive-900 tracking-tight">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-sage-200/70 text-olive-800 border border-sage-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-600"></span>
            Private Local Mode
          </span>
        </div>
        {subtitle && (
          <p className="text-xs text-olive-700/80 mt-0.5 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-parchment-300">
          <CandleGlow size="sm" active={true} />
          <span className="text-xs text-olive-800 font-serif italic">
            "Your memories. Your wishes. Your control."
          </span>
        </div>

        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-4 py-2 bg-parchment-200 hover:bg-parchment-300 text-olive-900 border border-olive-900/15 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4 text-marigold-600" />
            <span>Add to Inventory</span>
          </button>
        )}

        {onQuickSeal && (
          <button
            onClick={onQuickSeal}
            className="flex items-center gap-2 px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-sm font-medium transition-all shadow-md active:scale-98 hover:shadow-glow-marigold"
          >
            <Shield className="w-4 h-4 text-marigold-400" />
            <span>Seal Ofrenda</span>
          </button>
        )}
      </div>
    </header>
  );
};
