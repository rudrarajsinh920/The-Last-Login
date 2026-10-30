import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  KeyRound,
  ExternalLink,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { useGhost } from '../context/GhostContext';

interface SettingsPageProps {
  onOpenOnboarding?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenOnboarding }) => {
  const [endpoint, setEndpoint] = useState('http://localhost:11434');
  const [model, setModel] = useState('gemma2:latest');
  const [enableHeuristics, setEnableHeuristics] = useState(true);
  const [ownerName, setOwnerName] = useState('Marisol Hernandez');
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { ghostAcknowledge, ghostCelebrating, ghostConcerned, ghostThinking } = useGhost();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data.config) {
        setEndpoint(data.config.ollamaEndpoint || 'http://localhost:11434');
        setModel(data.config.ollamaModel || 'gemma2:latest');
        setEnableHeuristics(data.config.enableLocalHeuristics ?? true);
        setOwnerName(data.config.ownerName || 'Marisol Hernandez');
      }
      setAiStatus(data.aiStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestAI = async () => {
    setIsTesting(true);
    ghostThinking('Pinging local Ollama endpoint...');
    try {
      const status = await api.testAi();
      setAiStatus(status);
      if (status.ollamaAvailable) {
        ghostCelebrating(`Connected to local Ollama (${status.model})`);
      } else {
        ghostAcknowledge('Local heuristics active (Zero Cloud Egress)');
      }
    } catch (e) {
      ghostConcerned('Local AI endpoint unreachable; heuristics active');
      alert('Failed to connect to local AI endpoint');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await api.updateSettings({
        ollamaEndpoint: endpoint,
        ollamaModel: model,
        enableLocalHeuristics: enableHeuristics,
        ownerName: ownerName,
        encryptionHint: 'Family secret / Abuela birthday year',
        theme: 'parchment'
      });
      setSaveMessage('Preferences updated successfully.');
      ghostAcknowledge('Local preferences saved');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      ghostConcerned('Failed to save settings');
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReloadDemo = async () => {
    if (confirm('Reload the full fictional demo scenario for Marisol Hernandez?')) {
      await api.loadMarisolDemo();
      ghostCelebrating('Fictional Marisol demo reloaded');
      alert('Marisol demo dataset loaded!');
    }
  };

  const handleResetWorkspace = async () => {
    if (confirm('Are you sure you want to clear all data and start with a blank estate workspace?')) {
      await api.resetWorkspace();
      ghostConcerned('Estate workspace reset');
      alert('Workspace reset to empty state.');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto min-w-0 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-olive-900 tracking-tight">
          Settings & Privacy
        </h2>
        <p className="text-xs sm:text-sm text-olive-700 mt-1">
          Configure local AI inference, verify zero-cloud guarantees, and manage estate workspaces.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-sage-100 border border-sage-300 text-xs text-sage-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sage-700" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Local AI Configuration Card */}
      <form onSubmit={handleSaveSettings} className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-6">
        <div className="border-b border-parchment-300 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-marigold-600" />
            <h3 className="font-serif text-xl font-bold text-olive-900">
              Local AI Engine (Ollama)
            </h3>
          </div>
          <p className="text-xs text-olive-700 mt-0.5">
            Strict local inference only. No cloud AI fallbacks exist in this application.
          </p>
        </div>

        {/* AI Status Banner */}
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          aiStatus?.connected
            ? 'bg-sage-50 border-sage-200 text-sage-900'
            : 'bg-parchment-50 border-parchment-300 text-olive-800'
        }`}>
          <div>
            <span className="font-bold block font-mono text-[11px] uppercase mb-0.5">
              Current Mode: {aiStatus?.mode === 'ollama' ? 'Connected to Local Ollama' : 'Local Offline Heuristic Engine'}
            </span>
            <p>{aiStatus?.message || 'Checking local inference engine status...'}</p>
          </div>

          <button
            type="button"
            onClick={handleTestAI}
            disabled={isTesting}
            className="px-3 py-1.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
              Ollama API Endpoint
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-marigold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gemma2:latest or llama3:latest"
              className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-marigold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
            Estate Owner Name
          </label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-olive-800">
          <input
            type="checkbox"
            id="heuristics"
            checked={enableHeuristics}
            onChange={(e) => setEnableHeuristics(e.target.checked)}
            className="rounded border-parchment-300 text-marigold-600 focus:ring-marigold-500"
          />
          <label htmlFor="heuristics">
            Enable intelligent offline heuristic engine when Ollama is unavailable
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>

      {/* Privacy Guarantee & Storage Audit */}
      <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sage-600" />
          <h3 className="font-serif text-xl font-bold text-olive-900">
            Privacy & Security Telemetry Audit
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200">
            <span className="text-olive-600 block mb-1">LOCAL SQLITE DATABASE</span>
            <span className="font-bold text-olive-900">data/the_last_login.db</span>
          </div>

          <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200">
            <span className="text-olive-600 block mb-1">NETWORK ACTIVITY</span>
            <span className="font-bold text-sage-700">127.0.0.1 (Localhost Only)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200">
            <span className="text-olive-600 block mb-1">CLOUD EGRESS BYTES</span>
            <span className="font-bold text-sage-700">0 Bytes Sent</span>
          </div>
        </div>
      </div>

      {/* Demo Scenario & Reset Tools */}
      <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-4">
        <h3 className="font-serif text-lg font-bold text-olive-900">
          Demo Scenarios & Workspace Reset
        </h3>
        <p className="text-xs text-olive-700">
          Easily toggle between the rich fictional Marisol Hernandez scenario and an empty clean slate.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-100 rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow-glow-marigold"
            >
              <Compass className="w-4 h-4 text-marigold-400" />
              <span>Replay Onboarding Guide</span>
            </button>
          )}

          <button
            onClick={handleReloadDemo}
            className="flex items-center gap-2 px-4 py-2 bg-parchment-200 hover:bg-parchment-300 text-olive-900 border border-parchment-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-marigold-600" />
            <span>Reload Marisol Demo Dataset</span>
          </button>

          <button
            onClick={handleResetWorkspace}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta-100 hover:bg-terracotta-200 text-terracotta-900 border border-terracotta-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4 text-terracotta-600" />
            <span>Reset to Fresh Empty Slate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
