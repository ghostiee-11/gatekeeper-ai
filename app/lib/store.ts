import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type Provider = 'openai' | 'gemini' | 'groq';
export type Level = 1 | 2 | 3 | 4 | 5;

interface GameState {
  currentLevel: Level;
  maxUnlockedLevel: Level;
  messages: Message[];
  apiKey: string | null;
  provider: Provider;
  isGameWon: boolean;

  // Actions
  setLevel: (level: Level) => void;
  unlockNextLevel: () => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  setProvider: (provider: Provider) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      maxUnlockedLevel: 1,
      messages: [],
      apiKey: null,
      provider: 'openai',
      isGameWon: false,

      setLevel: (level) => {
        if (level <= get().maxUnlockedLevel) {
          set({ currentLevel: level, messages: [] });
        }
      },

      unlockNextLevel: () => {
        const current = get().currentLevel;
        if (current < 5) {
          const nextLevel = (current + 1) as Level;
          set((state) => ({
            maxUnlockedLevel: Math.max(state.maxUnlockedLevel, nextLevel) as Level,
            currentLevel: nextLevel,
            messages: []
          }));
        } else {
          set({ isGameWon: true });
        }
      },

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      clearMessages: () => set({ messages: [] }),

      setApiKey: (key) => set({ apiKey: key }),

      setProvider: (provider) => set({ provider }),

      resetGame: () => set({ currentLevel: 1, maxUnlockedLevel: 1, messages: [], isGameWon: false }),
    }),
    {
      name: 'gatekeeper-storage',
      partialize: (state) => ({ maxUnlockedLevel: state.maxUnlockedLevel, apiKey: state.apiKey, provider: state.provider }),
    }
  )
);
