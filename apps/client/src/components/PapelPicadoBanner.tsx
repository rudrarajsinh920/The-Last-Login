import React from 'react';
import { FriendlyGhost } from './FriendlyGhost';

interface PapelPicadoBannerProps {
  className?: string;
  showGhost?: boolean;
}

interface BannerFlagConfig {
  id: string;
  pattern: 'sunburst' | 'heart' | 'cempasuchil' | 'skull' | 'dove' | 'lace';
  delay: string; // Negative delay offset to stagger the 6-color cycle
  breezeDelay: string; // Timing offset for the natural wind sway
}

export const PapelPicadoBanner: React.FC<PapelPicadoBannerProps> = ({
  className = '',
  showGhost = true
}) => {
  // Left Garland Flags: Cycles through all 6 palette colors in staggered 3s intervals (18s total cycle)
  const leftFlags: BannerFlagConfig[] = [
    { id: 'left-flag-1', pattern: 'sunburst', delay: '0s', breezeDelay: '0s' },
    { id: 'left-flag-2', pattern: 'heart', delay: '-3s', breezeDelay: '0.4s' },
    { id: 'left-flag-3', pattern: 'cempasuchil', delay: '-6s', breezeDelay: '0.8s' },
    { id: 'left-flag-4', pattern: 'skull', delay: '-9s', breezeDelay: '1.2s' },
    { id: 'left-flag-5', pattern: 'dove', delay: '-12s', breezeDelay: '1.6s' },
    { id: 'left-flag-6', pattern: 'lace', delay: '-15s', breezeDelay: '2.0s' }
  ];

  // Right Garland Flags: Coordinated with the left side with harmonious phase offsets
  const rightFlags: BannerFlagConfig[] = [
    { id: 'right-flag-1', pattern: 'lace', delay: '-15s', breezeDelay: '0.2s' },
    { id: 'right-flag-2', pattern: 'dove', delay: '-12s', breezeDelay: '0.6s' },
    { id: 'right-flag-3', pattern: 'skull', delay: '-9s', breezeDelay: '1.0s' },
    { id: 'right-flag-4', pattern: 'cempasuchil', delay: '-6s', breezeDelay: '1.4s' },
    { id: 'right-flag-5', pattern: 'heart', delay: '-3s', breezeDelay: '1.8s' },
    { id: 'right-flag-6', pattern: 'sunburst', delay: '0s', breezeDelay: '2.2s' }
  ];

  // Render authentic Mexican Papel Picado geometric cutouts
  const renderCutout = (pattern: BannerFlagConfig['pattern']) => {
    switch (pattern) {
      case 'sunburst':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* Center sun medallion */}
            <div className="w-4 h-4 rounded-full border border-white/50 bg-white/20 flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
            {/* Radiating sun ray cutouts */}
            <div className="flex gap-1 items-center">
              <span className="w-1 h-2 rounded-full bg-white/40 rotate-[-25deg]" />
              <span className="w-1 h-2.5 rounded-full bg-white/50" />
              <span className="w-1 h-2 rounded-full bg-white/40 rotate-[25deg]" />
            </div>
            {/* Scalloped lower perforations */}
            <div className="flex gap-1.5 mt-1">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        );

      case 'heart':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* Sacred flame accent */}
            <div className="w-2 h-2 rounded-full bg-white/50 mb-0.5" />
            {/* Sacred heart silhouette */}
            <div className="w-4 h-4 border border-white/50 bg-white/20 rotate-45 rounded-tl-sm rounded-br-sm mb-1" />
            {/* Lace dots */}
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        );

      case 'cempasuchil':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* 6-petal marigold mandala flower */}
            <div className="relative w-5 h-5 flex items-center justify-center mb-1">
              <div className="absolute w-4 h-4 rounded-full border border-white/50 bg-white/10" />
              <div className="absolute w-3 h-3 rounded-full border border-dashed border-white/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
            {/* Floral stem dots */}
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        );

      case 'skull':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* Calavera skull head outline */}
            <div className="w-4 h-3.5 rounded-t-full border border-white/50 bg-white/20 flex items-center justify-around px-0.5 pt-0.5 mb-0.5">
              <span className="w-1 h-1 rounded-full bg-white/70" />
              <span className="w-1 h-1 rounded-full bg-white/70" />
            </div>
            {/* Calavera tooth row */}
            <div className="flex gap-0.5 mb-1">
              <span className="w-0.5 h-1 bg-white/50" />
              <span className="w-0.5 h-1 bg-white/50" />
              <span className="w-0.5 h-1 bg-white/50" />
            </div>
            {/* Filigree dots */}
            <div className="flex gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        );

      case 'dove':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* Dove wing silhouette */}
            <div className="w-5 h-2.5 rounded-t-full border-t-2 border-r border-white/50 mb-1" />
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-2 h-0.5 bg-white/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        );

      case 'lace':
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {/* Interlocking geometric diamond lattice */}
            <div className="w-3.5 h-3.5 rotate-45 border border-white/50 bg-white/15 mb-1" />
            <div className="flex gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative w-full max-w-full overflow-hidden select-none py-1.5 px-2 sm:px-4 ${className}`}
      aria-label="Digital Ofrenda Animated Six-Color Papel Picado Garland"
    >
      {/* Decorative Hanging String / Garland Wire */}
      <div className="absolute top-2.5 left-0 right-0 h-px bg-gradient-to-r from-olive-900/10 via-olive-900/30 to-olive-900/10 pointer-events-none" />

      {/* Main Garland Banner Row */}
      <div className="flex w-full items-start justify-between gap-1 sm:gap-2 max-w-7xl mx-auto min-w-0">
        {/* ================= LEFT GARLAND FLAGS ================= */}
        <div className="flex flex-1 items-start justify-start gap-1 sm:gap-2 min-w-0 pointer-events-none">
          {leftFlags.map((flag, idx) => {
            // Responsive visibility: first 2 on xs, first 3 on sm, first 4 on md, all on lg
            const visibilityClass =
              idx >= 4 ? 'hidden lg:flex' : idx >= 3 ? 'hidden md:flex' : idx >= 2 ? 'hidden sm:flex' : 'flex';

            return (
              <div
                key={flag.id}
                className={`${visibilityClass} flex-1 min-w-0 max-w-[68px] sm:max-w-[90px] md:max-w-[105px] h-12 sm:h-14 rounded-b-xl border border-white/30 relative overflow-hidden shadow-sm animate-ofrenda-color animate-breeze-left flex-col items-center justify-between`}
                style={{
                  animationDelay: `${flag.delay}, ${flag.breezeDelay}`,
                  willChange: 'background-color, transform'
                }}
              >
                {/* Folded Top Garland Ribbon Line */}
                <div className="w-full h-1 bg-white/25 border-b border-white/20" />

                {/* Central Papel Picado Cutout Pattern */}
                <div className="flex-1 w-full flex items-center justify-center">
                  {renderCutout(flag.pattern)}
                </div>

                {/* Hand-chiselled Scalloped Bottom Edge Cuts */}
                <div className="w-full flex justify-around -mb-1 pb-0.5">
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= CENTER: FRIENDLY MEMORY GUARDIAN GHOST ================= */}
        {showGhost && (
          <div className="px-2 sm:px-3 pt-0.5 flex flex-col items-center justify-center shrink-0 z-20">
            <FriendlyGhost size="md" showTooltip={true} />
          </div>
        )}

        {/* ================= RIGHT GARLAND FLAGS ================= */}
        <div className="flex flex-1 items-start justify-end gap-1 sm:gap-2 min-w-0 pointer-events-none">
          {rightFlags.map((flag, idx) => {
            // Responsive visibility matching the left side for perfect visual balance
            const visibilityClass =
              idx >= 4 ? 'hidden lg:flex' : idx >= 3 ? 'hidden md:flex' : idx >= 2 ? 'hidden sm:flex' : 'flex';

            return (
              <div
                key={flag.id}
                className={`${visibilityClass} flex-1 min-w-0 max-w-[68px] sm:max-w-[90px] md:max-w-[105px] h-12 sm:h-14 rounded-b-xl border border-white/30 relative overflow-hidden shadow-sm animate-ofrenda-color animate-breeze-right flex-col items-center justify-between`}
                style={{
                  animationDelay: `${flag.delay}, ${flag.breezeDelay}`,
                  willChange: 'background-color, transform'
                }}
              >
                {/* Folded Top Garland Ribbon Line */}
                <div className="w-full h-1 bg-white/25 border-b border-white/20" />

                {/* Central Papel Picado Cutout Pattern */}
                <div className="flex-1 w-full flex items-center justify-center">
                  {renderCutout(flag.pattern)}
                </div>

                {/* Hand-chiselled Scalloped Bottom Edge Cuts */}
                <div className="w-full flex justify-around -mb-1 pb-0.5">
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                  <div className="w-2 h-2 bg-parchment-200 rotate-45 transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
