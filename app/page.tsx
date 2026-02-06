'use client';

import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LevelIndicator from './components/LevelIndicator';
import SettingsModal from './components/SettingsModal';
import { Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { useGameStore } from './lib/store';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { apiKey } = useGameStore();

  useEffect(() => {
    setMounted(true);
    if (!useGameStore.getState().apiKey) {
      setIsSettingsOpen(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-4">

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="absolute top-6 w-full max-w-7xl flex justify-between items-center px-6 z-20">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-purple-500" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
            GATEKEEPER AI
          </h1>
        </div>

        <div className="flex gap-2">
          {apiKey && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-400 uppercase">{useGameStore.getState().provider} ACTIVE</span>
            </div>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 p-2 px-4 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-full transition-all text-neutral-400 hover:text-white backdrop-blur-sm"
          >
            <Settings size={16} />
            <span className="text-xs font-mono hidden sm:inline-block">
              {apiKey ? 'CHANGE KEY' : 'SET API KEY'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-4xl flex flex-col items-center gap-6"
      >
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            PROVE YOUR WORTH
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm md:text-base">
            "I do not give answers. I give tests. Pass the 5 levels of reasoning to prove you are not just a stochastic parrot."
          </p>
        </div>

        <LevelIndicator />
        <ChatInterface />
      </motion.div>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

    </main>
  );
}
