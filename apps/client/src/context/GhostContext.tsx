import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export type GhostState =
  | 'idle'
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'celebrating'
  | 'concerned'
  | 'welcoming'
  | 'gentle-acknowledgement';

interface GhostContextType {
  state: GhostState;
  message: string | null;
  triggerGhost: (state: GhostState, message?: string) => void;
  ghostHappy: (message?: string) => void;
  ghostCurious: (message?: string) => void;
  ghostThinking: (message?: string) => void;
  ghostCelebrating: (message?: string) => void;
  ghostConcerned: (message?: string) => void;
  ghostWelcoming: (message?: string) => void;
  ghostAcknowledge: (message?: string) => void;
}

const GhostContext = createContext<GhostContextType | undefined>(undefined);

export const GhostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GhostState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const triggerGhost = useCallback((newState: GhostState, msg?: string) => {
    clearTimer();
    setState(newState);
    if (msg) setMessage(msg);

    // Dynamic duration based on emotion
    const duration = newState === 'celebrating' ? 3400 : newState === 'happy' ? 2800 : 2500;

    timeoutRef.current = setTimeout(() => {
      setState('idle');
      setMessage(null);
    }, duration);
  }, []);

  const ghostHappy = useCallback((msg?: string) => triggerGhost('happy', msg), [triggerGhost]);
  const ghostCurious = useCallback((msg?: string) => triggerGhost('curious', msg), [triggerGhost]);
  const ghostThinking = useCallback((msg?: string) => triggerGhost('thinking', msg), [triggerGhost]);
  const ghostCelebrating = useCallback((msg?: string) => triggerGhost('celebrating', msg), [triggerGhost]);
  const ghostConcerned = useCallback((msg?: string) => triggerGhost('concerned', msg), [triggerGhost]);
  const ghostWelcoming = useCallback((msg?: string) => triggerGhost('welcoming', msg), [triggerGhost]);
  const ghostAcknowledge = useCallback((msg?: string) => triggerGhost('gentle-acknowledgement', msg), [triggerGhost]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <GhostContext.Provider
      value={{
        state,
        message,
        triggerGhost,
        ghostHappy,
        ghostCurious,
        ghostThinking,
        ghostCelebrating,
        ghostConcerned,
        ghostWelcoming,
        ghostAcknowledge,
      }}
    >
      {children}
    </GhostContext.Provider>
  );
};

export const useGhost = (): GhostContextType => {
  const context = useContext(GhostContext);
  if (!context) {
    // Graceful fallback dummy if rendered outside provider
    return {
      state: 'idle',
      message: null,
      triggerGhost: () => {},
      ghostHappy: () => {},
      ghostCurious: () => {},
      ghostThinking: () => {},
      ghostCelebrating: () => {},
      ghostConcerned: () => {},
      ghostWelcoming: () => {},
      ghostAcknowledge: () => {},
    };
  }
  return context;
};
