import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { FileImportModal } from './components/FileImportModal';
import { GlobalGhostCompanion } from './components/GlobalGhostCompanion';
import { GhostProvider, useGhost } from './context/GhostContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { SeancePage } from './pages/SeancePage';
import { DecisionsPage } from './pages/DecisionsPage';
import { LettersPage } from './pages/LettersPage';
import { SealedOfrendaPage } from './pages/SealedOfrendaPage';
import { MemorialPreviewPage } from './pages/MemorialPreviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingModal, ONBOARDING_COMPLETED_KEY } from './components/OnboardingModal';

const AppInner: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [seanceItemId, setSeanceItemId] = useState<string | undefined>(undefined);
  const [metricsKey, setMetricsKey] = useState(0);

  // First-time visitor check: auto-show onboarding if not yet completed
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  const { ghostAcknowledge, ghostHappy, ghostThinking, ghostWelcoming } = useGhost();

  const handleOpenOnboarding = () => {
    ghostWelcoming('Welcome to the Digital Ofrenda Guide');
    setIsOnboardingOpen(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Contextual ghost response on route change
    if (route !== '/') {
      const titles: Record<string, string> = {
        '/dashboard': 'Welcome to My Legacy',
        '/inventory': 'Viewing Life Inventory',
        '/seance': 'Entering Living Séance',
        '/decisions': 'Triage & Decisions',
        '/letters': 'Legacy Letters Workspace',
        '/sealed-ofrenda': 'Sealed Ofrenda Vault',
        '/memorial-preview': 'Memorial Preview Tribute',
        '/settings': 'Settings & Privacy'
      };
      ghostAcknowledge(titles[route] || 'Opening section');
    }
  };

  const handleOpenSeanceForItem = (itemId: string) => {
    setSeanceItemId(itemId);
    navigate('/seance');
  };

  const handleRefreshMetrics = () => {
    setMetricsKey(prev => prev + 1);
  };

  // If on landing page, render without app sidebar
  if (currentRoute === '/') {
    return (
      <>
        <LandingPage
          navigate={navigate}
          onOpenOnboarding={handleOpenOnboarding}
        />
        <GlobalGhostCompanion
          currentRoute={currentRoute}
          onOpenOnboarding={handleOpenOnboarding}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={() => {
            setIsOnboardingOpen(false);
            navigate('/dashboard');
          }}
          onItemCreated={handleRefreshMetrics}
        />
      </>
    );
  }

  // Get Navbar metadata for active route
  const getNavMeta = () => {
    switch (currentRoute) {
      case '/dashboard':
        return { title: 'My Legacy', subtitle: 'Overview of your digital belongings, decisions, and estate readiness.' };
      case '/inventory':
        return { title: 'Life Inventory', subtitle: 'Explicitly cataloged possessions with local cryptographic verification.' };
      case '/seance':
        return { title: 'Living Séance', subtitle: 'Guided, private reflective interview to capture oral histories.' };
      case '/decisions':
        return { title: 'Keep / Release / Exorcise', subtitle: 'Make conscious triage decisions on every digital belonging.' };
      case '/letters':
        return { title: 'Legacy Letters', subtitle: 'Compassionate drafting workspace for personal letters and recipe histories.' };
      case '/sealed-ofrenda':
        return { title: 'Sealed Ofrenda', subtitle: 'Zero-knowledge authenticated encryption and recovery escrow.' };
      case '/memorial-preview':
        return { title: 'Memorial Preview', subtitle: 'Curated digital tribute of only your explicitly approved memories.' };
      case '/settings':
        return { title: 'Settings & Privacy', subtitle: 'Local AI inference configuration and zero-cloud verification.' };
      default:
        return { title: 'The Last Login', subtitle: 'Private AI Digital Estate Planner' };
    }
  };

  const navMeta = getNavMeta();

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden bg-parchment-200 text-olive-900 font-sans selection:bg-marigold-200">
      {/* Deep Midnight Olive Navigation Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        onRefreshMetrics={handleRefreshMetrics}
        onOpenOnboarding={handleOpenOnboarding}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 w-full max-w-full">
        <Navbar
          title={navMeta.title}
          subtitle={navMeta.subtitle}
          onOpenImport={() => {
            ghostHappy('Cataloging a new memory');
            setIsImportOpen(true);
          }}
          onQuickSeal={() => {
            ghostThinking('Preparing your encrypted archive');
            navigate('/sealed-ofrenda');
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        <main className="flex-1 flex flex-col w-full min-w-0">
          {currentRoute === '/dashboard' && (
            <DashboardPage
              key={metricsKey}
              navigate={navigate}
              onOpenImport={() => {
                ghostHappy('Adding memory to inventory');
                setIsImportOpen(true);
              }}
              onOpenOnboarding={handleOpenOnboarding}
            />
          )}
          {currentRoute === '/inventory' && (
            <InventoryPage
              onOpenImport={() => {
                ghostHappy('Adding memory to inventory');
                setIsImportOpen(true);
              }}
              onOpenSeanceForItem={handleOpenSeanceForItem}
            />
          )}
          {currentRoute === '/seance' && (
            <SeancePage initialItemId={seanceItemId} />
          )}
          {currentRoute === '/decisions' && (
            <DecisionsPage />
          )}
          {currentRoute === '/letters' && (
            <LettersPage />
          )}
          {currentRoute === '/sealed-ofrenda' && (
            <SealedOfrendaPage />
          )}
          {currentRoute === '/memorial-preview' && (
            <MemorialPreviewPage />
          )}
          {currentRoute === '/settings' && (
            <SettingsPage
              onOpenOnboarding={handleOpenOnboarding}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Ghost Companion */}
      <GlobalGhostCompanion
        currentRoute={currentRoute}
        onOpenOnboarding={handleOpenOnboarding}
      />

      {/* Central Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
        onItemCreated={handleRefreshMetrics}
      />

      {/* File Import Modal */}
      <FileImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={() => {
          handleRefreshMetrics();
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GhostProvider>
      <AppInner />
    </GhostProvider>
  );
};
