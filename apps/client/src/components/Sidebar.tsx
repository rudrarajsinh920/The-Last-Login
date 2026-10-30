import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Layers,
  ScrollText,
  ShieldCheck,
  Flame,
  Settings,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  X,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onRefreshMetrics?: () => void;
  onOpenOnboarding?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  onRefreshMetrics,
  onOpenOnboarding,
  isOpen = false,
  onClose
}) => {
  const [readiness, setReadiness] = useState<number>(() => clientStore.getMetrics().archiveStatusPercent);
  const [aiStatus, setAiStatus] = useState<string>('Local Heuristics');
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    loadStatus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadStatus = async () => {
    try {
      const metrics = await api.getMetrics();
      setReadiness(metrics.archiveStatusPercent || 0);

      const settings = await api.getSettings();
      if (settings?.aiStatus?.connected) {
        setAiStatus(`Ollama (${settings.aiStatus.model})`);
      } else {
        setAiStatus('Offline Heuristics');
      }
    } catch (e) {
      setAiStatus('Local Heuristics');
    }
  };

  const navItems = [
    { id: '/dashboard', label: 'My Legacy', icon: LayoutDashboard },
    { id: '/inventory', label: 'Life Inventory', icon: FolderOpen },
    { id: '/seance', label: 'Living Séance', icon: Sparkles },
    { id: '/decisions', label: 'Triage Decisions', icon: Layers },
    { id: '/letters', label: 'Legacy Letters', icon: ScrollText },
    { id: '/sealed-ofrenda', label: 'Sealed Ofrenda', icon: ShieldCheck },
    { id: '/memorial-preview', label: 'Memorial Preview', icon: Flame },
    { id: '/settings', label: 'Settings & Privacy', icon: Settings },
  ];

  const handleReset = async () => {
    if (confirm('Reset workspace to empty or reload Marisol demo scenario? Click OK to load Marisol demo, Cancel to abort.')) {
      await api.loadMarisolDemo();
      loadStatus();
      if (onRefreshMetrics) onRefreshMetrics();
    }
  };

  const handleNavClick = (route: string) => {
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 md:static w-64 bg-olive-900 text-parchment-200 flex flex-col justify-between h-screen border-r border-olive-800 shadow-xl shrink-0 select-none transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-olive-800/80 flex items-center justify-between">
            <div 
              onClick={() => handleNavClick('/')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-marigold-500 to-terracotta-500 flex items-center justify-center shadow-glow-marigold group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-parchment-50" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-medium tracking-tight text-parchment-50 leading-tight">
                  The Last Login
                </h1>
                <p className="text-[11px] font-mono tracking-wider text-sage-300 uppercase">
                  Digital Ofrenda
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-sage-400 hover:text-parchment-100 hover:bg-olive-800 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation list */}
          <nav className="p-3 space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-400 ${
                    isActive
                      ? 'bg-olive-800 text-marigold-400 font-semibold shadow-inner'
                      : 'text-parchment-300 hover:bg-olive-800/50 hover:text-parchment-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-marigold-400' : 'text-sage-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-marigold-400" />}
                </button>
              );
            })}
          </nav>
        </div>

      {/* Readiness & System Footer */}
      <div className="p-4 border-t border-olive-800 space-y-4">
        {/* Readiness Meter (Inspired by Media 7 Legacy Vault) */}
        <div className="bg-olive-950/60 p-3.5 rounded-xl border border-olive-800/70">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-parchment-300 font-medium">Vault Readiness</span>
            <span className="font-mono text-marigold-400 font-semibold">{readiness}%</span>
          </div>
          <div className="w-full h-2 bg-olive-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sage-500 to-marigold-500 transition-all duration-500 rounded-full"
              style={{ width: `${readiness}%` }}
            />
          </div>
          <p className="text-[10px] text-sage-300 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-400"></span>
            Decisions made on digital inventory
          </p>
        </div>

        {/* Local AI status badge */}
        <div className="flex items-center justify-between px-2 text-[11px] text-parchment-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sage-400" />
            <span className="truncate max-w-[140px]">{aiStatus}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" title="Local privacy active"></span>
        </div>

        {/* Persona profile card */}
        <div className="flex items-center justify-between pt-2 border-t border-olive-800/60 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sage-700 text-parchment-100 flex items-center justify-center font-serif font-bold text-xs">
              MH
            </div>
            <div>
              <p className="font-medium text-parchment-100 text-xs leading-none">Marisol H.</p>
              <p className="text-[10px] text-marigold-400/90 font-mono mt-0.5">Fictional Demo</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                title="Open Onboarding Guide"
                className="p-1.5 rounded-lg text-sage-300 hover:text-marigold-400 hover:bg-olive-800 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleReset}
              title="Reload fictional demo data"
              className="p-1.5 rounded-lg text-sage-300 hover:text-parchment-50 hover:bg-olive-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
