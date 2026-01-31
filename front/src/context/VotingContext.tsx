import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Character, EvaluatedCharacter, VotingState } from '../types';

interface VotingContextType extends VotingState {
  setCurrentCharacter: (character: Character | null) => void;
  addVotedCharacter: (character: EvaluatedCharacter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetVotedCharacters: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

interface VotingProviderProps {
  children: ReactNode;
}

export function VotingProvider({ children }: VotingProviderProps) {
  const [state, setState] = useState<VotingState>({
    currentCharacter: null,
    votedCharacters: [],
    isLoading: false,
    error: null,
  });

  const setCurrentCharacter = useCallback((character: Character | null) => {
    setState(prev => ({ ...prev, currentCharacter: character }));
  }, []);

  const addVotedCharacter = useCallback((character: EvaluatedCharacter) => {
    setState(prev => ({
      ...prev,
      votedCharacters: [character, ...prev.votedCharacters],
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const resetVotedCharacters = useCallback(() => {
    setState(prev => ({ ...prev, votedCharacters: [] }));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: VotingContextType = useMemo(() => ({
    ...state,
    setCurrentCharacter,
    addVotedCharacter,
    setLoading,
    setError,
    resetVotedCharacters,
  }), [state, setCurrentCharacter, addVotedCharacter, setLoading, setError, resetVotedCharacters]);

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVotingContext() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVotingContext must be used within a VotingProvider');
  }
  return context;
}
