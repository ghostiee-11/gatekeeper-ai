'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore, Message } from '../lib/store';
import { submitPrompt } from '../lib/llm';
import { LEVEL_CONFIG } from '../lib/gatekeeper';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

export default function ChatInterface() {
    const {
        currentLevel,
        messages,
        apiKey,
        addMessage,
        unlockNextLevel,
        isGameWon
    } = useGameStore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [currentLevel, isLoading]);

    const handleConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Check if API key is present
        if (!apiKey) {
            addMessage({ role: 'system', content: '⚠️ Please set your API Key in Settings (top right) to play.' });
            return;
        }

        const userMsg: Message = { role: 'user', content: input };
        addMessage(userMsg);
        setInput('');
        setIsLoading(true);

        // Prepare context for LLM
        // We only send the last few messages to save tokens and keep focus, maybe? 
        // Or send full history for the conversation context. Let's send full history for this level.
        const response = await submitPrompt(
            [...messages, userMsg],
            LEVEL_CONFIG[currentLevel].systemPrompt,
            apiKey,
            useGameStore.getState().provider
        );

        setIsLoading(false);

        if (response.error) {
            addMessage({ role: 'system', content: `❌ Error: ${response.error}` });
            return;
        }

        const assistantMsg: Message = { role: 'assistant', content: response.content };
        addMessage(assistantMsg);

        // Check for success
        if (response.content.includes("ACCESS GRANTED")) {
            handleConfetti();
            setTimeout(() => {
                unlockNextLevel();
            }, 3000);
        }
    };

    if (isGameWon) {
        return (
            <div className="flexflex-col items-center justify-center h-96 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Sparkles size={64} className="text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-600">
                        LEGEND STATUS ACHIEVED
                    </h2>
                    <p className="text-xl text-neutral-400 mt-4 max-w-lg mx-auto">
                        You have outsmarted the Gatekeeper. You are no longer the seeker. You are the Wizard.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-neutral-950/80 p-4 border-b border-neutral-800 flex justify-between items-center backdrop-blur-sm z-10">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-purple-500">◈</span> {LEVEL_CONFIG[currentLevel].title}
                    </h2>
                    <p className="text-xs text-neutral-500">{LEVEL_CONFIG[currentLevel].subtitle}</p>
                </div>
                <div className="text-xs font-mono text-neutral-600">
                    PROMPT_ATTEMPTS: {Math.floor(messages.length / 2)}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center text-neutral-600 mt-20 italic">
                        "Speak, seeker. But choose your words wisely."
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "flex w-full mb-4",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={clsx(
                            "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg",
                            msg.role === 'user'
                                ? "bg-neutral-800 text-neutral-200 rounded-br-none border border-neutral-700"
                                : msg.role === 'system'
                                    ? "bg-red-900/20 text-red-400 border border-red-900/50 w-full text-center font-mono"
                                    : clsx(
                                        "bg-gradient-to-br from-purple-900/20 to-neutral-900 text-purple-100 rounded-bl-none border border-purple-500/30",
                                        msg.content.includes("ACCESS DENIED") && "border-red-500/50 text-red-200 bg-red-950/30",
                                        msg.content.includes("ACCESS GRANTED") && "border-green-500/50 text-green-200 bg-green-950/30",
                                    )
                        )}>
                            {msg.role === 'assistant' && (
                                <div className="text-xs font-bold mb-1 opacity-50 uppercase tracking-widest">Gatekeeper</div>
                            )}
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start w-full"
                    >
                        <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl rounded-bl-none flex items-center gap-2 text-purple-400">
                            <span className="animate-pulse">●</span>
                            <span className="animate-pulse delay-75">●</span>
                            <span className="animate-pulse delay-150">●</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your prompt..."
                        disabled={isLoading}
                        className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-purple-500 rounded-xl p-4 pr-12 text-white outline-none transition-all shadow-inner disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white disabled:grayscale disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </form>
                {!apiKey && (
                    <div className="text-center mt-2">
                        <span className="text-xs text-red-400 flex items-center justify-center gap-1">
                            <AlertCircle size={12} /> API Key required. Click Settings to configure.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
