import React from 'react';

export const PapelPicadoBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-85 ${className}`}>
      <div className="flex w-full justify-between items-start gap-1 py-1">
        {/* Banner Flag 1 - Marigold */}
        <div className="flex-1 max-w-[120px] h-12 bg-marigold-500 rounded-b-xl relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <div className="w-4 h-4 rounded-full border border-white/40 mb-1"></div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          </div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>

        {/* Banner Flag 2 - Terracotta */}
        <div className="flex-1 max-w-[120px] h-12 bg-terracotta-500 rounded-b-xl relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <div className="w-3 h-3 rotate-45 border border-white/40 mb-1"></div>
          <div className="w-6 h-0.5 bg-white/40 mb-1"></div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>

        {/* Banner Flag 3 - Sage */}
        <div className="flex-1 max-w-[120px] h-12 bg-sage-500 rounded-b-xl relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <div className="w-4 h-4 rounded-full border-2 border-dashed border-white/50 mb-1"></div>
          <div className="flex gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
          </div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>

        {/* Banner Flag 4 - Midnight Olive */}
        <div className="flex-1 max-w-[120px] h-12 bg-olive-900 rounded-b-xl relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <div className="w-3 h-3 rounded-full border border-marigold-400 mb-1"></div>
          <div className="w-4 h-0.5 bg-marigold-400/60"></div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>

        {/* Banner Flag 5 - Marigold */}
        <div className="hidden sm:flex flex-1 max-w-[120px] h-12 bg-marigold-500 rounded-b-xl relative overflow-hidden flex-col items-center justify-center shadow-sm">
          <div className="w-3 h-3 rotate-45 border border-white/40 mb-1"></div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          </div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>

        {/* Banner Flag 6 - Terracotta */}
        <div className="hidden md:flex flex-1 max-w-[120px] h-12 bg-terracotta-500 rounded-b-xl relative overflow-hidden flex-col items-center justify-center shadow-sm">
          <div className="w-4 h-4 rounded-full border border-white/40 mb-1"></div>
          <div className="w-6 h-0.5 bg-white/40"></div>
          <div className="absolute -bottom-1 w-full flex justify-around">
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
            <div className="w-2 h-2 bg-parchment-200 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
