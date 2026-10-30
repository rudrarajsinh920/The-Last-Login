import React, { useState, useEffect } from 'react';
import {
  Shield,
  FolderOpen,
  Sparkles,
  Layers,
  ScrollText,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Share2,
  Trash2,
  Lock,
  RefreshCw,
  Plus,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardMetrics, ActivityLogEntry } from '@the-last-login/shared';
import { CandleGlow } from '../components/CandleGlow';
import { OnboardingModal } from '../components/OnboardingModal';

interface DashboardPageProps {
  navigate: (route: string) => void;
  onOpenImport: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, onOpenImport }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [m, a] = await Promise.all([
        api.getMetrics(),
        api.getActivity()
      ]);
      setMetrics(m);
      setActivity(a);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadDemo = async () => {
    await api.loadMarisolDemo();
    await loadDashboard();
  };

  if (loading || !metrics) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <CandleGlow size="lg" active={true} />
          <p className="text-sm font-serif italic text-olive-800">
            Gathering memories into the digital ofrenda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Editorial Welcome Card (Inspired by Media 5 Kindred Banner & Media 2 Ofrenda) */}
      <div className="relative rounded-3xl bg-olive-900 text-parchment-100 p-8 md:p-10 shadow-elevated border border-olive-800 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-marigold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest text-marigold-400 uppercase font-semibold">
                MARISOL HERNANDEZ ESTATE SPACE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-olive-800 text-parchment-300 border border-olive-700">
                Fictional Demo Scenario
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-parchment-50 tracking-tight leading-snug">
              Every voice matters. <br />
              Every story <span className="italic text-marigold-400">endures.</span>
            </h2>

            <p className="text-sm text-parchment-300 font-sans leading-relaxed">
              Your living legacy archive is <strong className="text-marigold-300">{metrics.archiveStatusPercent}% organized</strong>. 
              {metrics.unassignedItems > 0 ? (
                <span> You have <strong className="text-parchment-100">{metrics.unassignedItems} unassigned items</strong> awaiting your triage review.</span>
              ) : (
                <span> All digital belongings have been triaged with care. Ready to seal or review!</span>
              )}
            </p>
          </div>

          {/* Quick Action Button Cluster */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenImport}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-marigold-500 hover:bg-marigold-400 text-olive-950 font-semibold rounded-xl text-sm shadow-md transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 text-olive-950" />
              <span>Add Local Files</span>
            </button>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-olive-800 hover:bg-olive-700 text-parchment-100 rounded-xl text-sm font-medium border border-olive-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-marigold-400" />
              <span>Onboarding Tour</span>
            </button>

            <button
              onClick={() => navigate('/sealed-ofrenda')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-olive-800/60 hover:bg-olive-800 text-parchment-200 rounded-xl text-sm font-medium border border-olive-700/80 transition-colors"
            >
              <Lock className="w-4 h-4 text-sage-300" />
              <span>Seal Vault Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legacy Vault Readiness Card (Inspired by Media 7) */}
      <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-olive-900">
                Vault Readiness & Progress
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage-200 text-olive-900 font-medium">
                {metrics.archiveStatusPercent === 100 ? '● Complete' : '● In Progress'}
              </span>
            </div>
            <p className="text-xs text-olive-700">
              Your digital estate planning progress across triage, interviews, and letters.
            </p>
          </div>

          <div className="text-right">
            <span className="font-serif text-3xl font-bold text-olive-900">
              {metrics.archiveStatusPercent}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-parchment-300 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-sage-500 via-marigold-500 to-sage-600 transition-all duration-700 rounded-full"
            style={{ width: `${metrics.archiveStatusPercent}%` }}
          />
        </div>

        {/* 6 Category Summary Cards (Matching Media 7) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div 
            onClick={() => navigate('/inventory')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-sage-400 hover:bg-parchment-100 transition-all cursor-pointer text-center"
          >
            <FolderOpen className="w-5 h-5 mx-auto text-sage-700 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Total Items</span>
            <span className="font-serif text-lg font-bold text-olive-900">{metrics.totalItems}</span>
          </div>

          <div 
            onClick={() => navigate('/decisions')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-sage-400 hover:bg-sage-50 transition-all cursor-pointer text-center"
          >
            <CheckCircle className="w-5 h-5 mx-auto text-sage-600 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Keep (Preserve)</span>
            <span className="font-serif text-lg font-bold text-sage-800">{metrics.keepItems}</span>
          </div>

          <div 
            onClick={() => navigate('/decisions')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-marigold-400 hover:bg-marigold-50 transition-all cursor-pointer text-center"
          >
            <Share2 className="w-5 h-5 mx-auto text-marigold-600 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Release (Gift)</span>
            <span className="font-serif text-lg font-bold text-marigold-800">{metrics.releaseItems}</span>
          </div>

          <div 
            onClick={() => navigate('/decisions')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-terracotta-400 hover:bg-terracotta-50 transition-all cursor-pointer text-center"
          >
            <Trash2 className="w-5 h-5 mx-auto text-terracotta-600 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Exorcise (Delete)</span>
            <span className="font-serif text-lg font-bold text-terracotta-800">{metrics.exorciseItems}</span>
          </div>

          <div 
            onClick={() => navigate('/seance')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-marigold-400 hover:bg-parchment-100 transition-all cursor-pointer text-center"
          >
            <Sparkles className="w-5 h-5 mx-auto text-marigold-600 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Interviews</span>
            <span className="font-serif text-lg font-bold text-olive-900">{metrics.completedInterviews}</span>
          </div>

          <div 
            onClick={() => navigate('/letters')}
            className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-sage-400 hover:bg-parchment-100 transition-all cursor-pointer text-center"
          >
            <ScrollText className="w-5 h-5 mx-auto text-sage-600 mb-1.5" />
            <span className="text-xs text-olive-600 font-medium block">Approved Letters</span>
            <span className="font-serif text-lg font-bold text-olive-900">{metrics.approvedLetters}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Next Step & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Step / Guidance (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card">
            <h3 className="font-serif text-xl font-bold text-olive-900 mb-2">
              Recommended Next Step
            </h3>
            <p className="text-xs text-olive-700 mb-6">
              Thoughtful progress is better than haste. Here is where your attention is most valuable right now:
            </p>

            <div className="space-y-4">
              {metrics.unassignedItems > 0 ? (
                <div className="p-4 rounded-xl bg-marigold-50 border border-marigold-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-marigold-800 uppercase">
                      Decision Needed
                    </span>
                    <h4 className="font-serif font-bold text-base text-olive-900">
                      Triage {metrics.unassignedItems} Unassigned Possessions
                    </h4>
                    <p className="text-xs text-olive-800 leading-relaxed">
                      Assign KEEP, RELEASE, or EXORCISE to ensure your private files are treated according to your exact wishes.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/decisions')}
                    className="px-4 py-2 bg-marigold-500 hover:bg-marigold-400 text-olive-950 font-semibold rounded-xl text-xs shrink-0 shadow-sm transition-all"
                  >
                    Go to Triage &rarr;
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-sage-800 uppercase">
                      Archive Ready
                    </span>
                    <h4 className="font-serif font-bold text-base text-olive-900">
                      Seal Your Digital Ofrenda Vault
                    </h4>
                    <p className="text-xs text-olive-800 leading-relaxed">
                      All possessions are cataloged and triaged. Encrypt your archive with a passphrase and generate your recovery sheet.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/sealed-ofrenda')}
                    className="px-4 py-2 bg-sage-600 hover:bg-sage-500 text-parchment-50 font-semibold rounded-xl text-xs shrink-0 shadow-sm transition-all"
                  >
                    Seal Ofrenda &rarr;
                  </button>
                </div>
              )}

              {/* Guided living seance prompt */}
              <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-sage-700 uppercase">
                    Living Séance
                  </span>
                  <h4 className="font-serif font-bold text-base text-olive-900">
                    Uncover the Stories Behind Heirloom Recipes
                  </h4>
                  <p className="text-xs text-olive-700 leading-relaxed">
                    Have you recorded the secret ingredients and memories behind Abuela Elena's Mole Poblano?
                  </p>
                </div>
                <button
                  onClick={() => navigate('/seance')}
                  className="px-4 py-2 bg-parchment-200 hover:bg-parchment-300 text-olive-900 border border-parchment-300 font-semibold rounded-xl text-xs shrink-0 transition-colors"
                >
                  Continue Interview &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Tribute Preview CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-parchment-100 to-parchment-200 border border-parchment-300 p-6 flex items-center justify-between shadow-soft-card">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-olive-900">
                Preview Your Memorial Ofrenda
              </h4>
              <p className="text-xs text-olive-700">
                Experience how your approved memories and letters will appear to your chosen loved ones.
              </p>
            </div>
            <button
              onClick={() => navigate('/memorial-preview')}
              className="px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow-glow-marigold flex items-center gap-2"
            >
              <Flame className="w-3.5 h-3.5 text-marigold-400" />
              <span>Open Tribute</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Log (1 Col) */}
        <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-olive-900">
                Recent Activity
              </h3>
              <Clock className="w-4 h-4 text-olive-600" />
            </div>

            <div className="space-y-3.5">
              {activity.slice(0, 6).map((item) => (
                <div key={item.id} className="text-xs border-b border-parchment-200 pb-2.5 last:border-none">
                  <p className="font-medium text-olive-900 leading-snug">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-olive-600 font-mono mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.action.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-parchment-300 flex items-center justify-between text-xs text-olive-600">
            <span>Audit log stored in local SQLite</span>
            <button
              onClick={handleReloadDemo}
              className="text-marigold-700 hover:text-marigold-800 font-semibold"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};
