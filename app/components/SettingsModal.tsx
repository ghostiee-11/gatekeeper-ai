'use client';

import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { X, Key, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { apiKey, setApiKey, provider, setProvider } = useGameStore();
    const [inputKey, setInputKey] = useState(apiKey || '');
    const [selectedProvider, setSelectedProvider] = useState(provider || 'openai');
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        setApiKey(inputKey);
        setProvider(selectedProvider);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Key className="text-purple-500" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                                API Configuration
                            </span>
                        </h2>

                        <p className="text-neutral-400 text-sm mb-4">
                            To play, you just need an API Key.
                            <br />We support OpenAI, Gemini, and Groq.
                        </p>

                        <div className="mb-4 space-y-2">
                            <label className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Provider</label>
                            <div className="flex gap-2">
                                {['openai', 'gemini', 'groq'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setSelectedProvider(p as any)}
                                        className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${selectedProvider === p
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4 space-y-2">
                            <label className="text-xs text-neutral-500 uppercase tracking-widest font-bold">API Key</label>
                            <div className="relative">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    placeholder={selectedProvider === 'gemini' ? 'AIza...' : 'sk-...'}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                    type="button"
                                >
                                    {showKey ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all transform active:scale-95"
                        >
                            Save Key
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
