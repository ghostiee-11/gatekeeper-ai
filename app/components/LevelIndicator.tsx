'use client';

import { useGameStore, Level } from '../lib/store';
import { motion } from 'framer-motion';
import { Lock, Unlock, Star } from 'lucide-react';
import { LEVEL_CONFIG } from '../lib/gatekeeper';
import clsx from 'clsx';

export default function LevelIndicator() {
    const { currentLevel, maxUnlockedLevel, setLevel } = useGameStore();
    const levels: Level[] = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-2 mb-8 items-center justify-center flex-wrap">
            {levels.map((level) => {
                const isUnlocked = level <= maxUnlockedLevel;
                const isActive = level === currentLevel;

                return (
                    <motion.button
                        key={level}
                        onClick={() => isUnlocked && setLevel(level)}
                        disabled={!isUnlocked}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        className={clsx(
                            "relative px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2",
                            isActive
                                ? "bg-purple-900/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                : isUnlocked
                                    ? "bg-neutral-900 border-neutral-700 hover:border-neutral-500"
                                    : "bg-neutral-950 border-neutral-900 opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="flex flex-col items-center">
                            <span className={clsx("text-xs font-mono uppercase tracking-widest", isActive ? "text-purple-300" : "text-neutral-500")}>
                                Level {level}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute inset-0 border-2 border-purple-500 rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </div>

                        {isUnlocked ? (
                            isActive ? <Star size={14} className="text-yellow-400 fill-yellow-400" /> : <Unlock size={14} className="text-neutral-400" />
                        ) : (
                            <Lock size={14} className="text-neutral-700" />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
