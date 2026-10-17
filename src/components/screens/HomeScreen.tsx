import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Sparkles, Shield, Zap } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
  honestMode: boolean;
  onToggleHonest: () => void;
  demoMode: boolean;
  onToggleDemo: () => void;
  hasApiKey: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenSettings,
  honestMode,
  onToggleHonest,
  demoMode,
  onToggleDemo,
  hasApiKey,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-4xl mx-auto text-center">
      {/* Main Title Banner with Jumping & Bouncing Animation */}
      <div className="relative mb-3">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bungee tracking-wider text-marigold drop-shadow-[5px_5px_0px_#000] -rotate-1 select-none flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <span>GAP</span>
          <span className="inline-flex">
            {'JUMPERS'.split('').map((char, index) => (
              <motion.span
                key={index}
                className="inline-block text-magenta drop-shadow-[5px_5px_0px_#000] cursor-pointer"
                animate={{
                  y: [0, -26, 0, -10, 0],
                  scaleY: [1, 1.18, 0.82, 1.05, 1],
                  scaleX: [1, 0.88, 1.15, 0.96, 1],
                  rotate: [0, index % 2 === 0 ? -6 : 6, 0],
                }}
                whileHover={{
                  scale: 1.25,
                  y: -30,
                  rotate: index % 2 === 0 ? -12 : 12,
                  transition: { type: 'spring', stiffness: 400, damping: 10 },
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.35,
                  delay: index * 0.08,
                  ease: [0.28, 0.84, 0.42, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>
        <div className="absolute -top-3 -right-6 text-3xl md:text-4xl animate-bounce">
          🌉
        </div>
      </div>

      <p className="text-base sm:text-lg md:text-xl font-bold text-cream max-w-xl mx-auto mb-8 drop-shadow-[2px_2px_0px_#000]">
        "Every translation loses something. Let's make that a game."
      </p>

      {/* 4 How to Play Sticker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        <div className="brutal-card p-4 -rotate-1 hover:rotate-0 transition-transform">
          <div className="text-3xl mb-1">✏️</div>
          <div className="font-bungee text-xs text-magenta mb-1">STEP 1</div>
          <h3 className="font-bungee text-sm text-black mb-1">SECRET DOODLE</h3>
          <p className="text-xs text-gray-800 font-semibold leading-relaxed">
            Player A secretly gets a scenario and doodles it in 30 seconds.
          </p>
        </div>

        <div className="brutal-card p-4 rotate-1 hover:rotate-0 transition-transform">
          <div className="text-3xl mb-1">🤖</div>
          <div className="font-bungee text-xs text-magenta mb-1">STEP 2</div>
          <h3 className="font-bungee text-sm text-black mb-1">AI INTERPRETER</h3>
          <p className="text-xs text-gray-800 font-semibold leading-relaxed">
            The AI describes the drawing to Player B in a dramatic persona!
          </p>
        </div>

        <div className="brutal-card p-4 -rotate-1 hover:rotate-0 transition-transform">
          <div className="text-3xl mb-1">⌨️</div>
          <div className="font-bungee text-xs text-magenta mb-1">STEP 3</div>
          <h3 className="font-bungee text-sm text-black mb-1">SILLY GUESS</h3>
          <p className="text-xs text-gray-800 font-semibold leading-relaxed">
            Player B types a guess under a hilarious random constraint.
          </p>
        </div>

        <div className="brutal-card p-4 rotate-1 hover:rotate-0 transition-transform">
          <div className="text-3xl mb-1">🌉</div>
          <div className="font-bungee text-xs text-magenta mb-1">STEP 4</div>
          <h3 className="font-bungee text-sm text-black mb-1">GAP SCORE</h3>
          <p className="text-xs text-gray-800 font-semibold leading-relaxed">
            3 planks build the bridge. 2 collapses and you lose to the gap!
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-6">
        <button
          onClick={onStartGame}
          className="brutal-btn-primary w-full py-4 text-xl flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-black" />
          START GAME
        </button>
        <button
          onClick={onOpenSettings}
          className="brutal-btn bg-white hover:bg-gray-100 text-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          title="Configure API key and options"
        >
          <Settings className="w-5 h-5" />
          SETTINGS
        </button>
      </div>

      {/* Toggles Banner */}
      <div className="bg-cream/90 border-3 border-black rounded-2xl p-3 shadow-brutal flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-black mb-8">
        {/* Honest Interpreter Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={honestMode}
            onChange={onToggleHonest}
            className="w-4 h-4 accent-teal rounded cursor-pointer"
          />
          <span className="flex items-center gap-1 font-bungee">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            Honest Interpreter {honestMode ? '🤝 (ON)' : '🤪 (CHAOS)'}
          </span>
        </label>

        <span className="text-gray-400">|</span>

        {/* Demo Mode Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={onToggleDemo}
            className="w-4 h-4 accent-marigold rounded cursor-pointer"
          />
          <span className="flex items-center gap-1 font-bungee">
            <Zap className="w-3.5 h-3.5 text-marigold" />
            Demo Mode (Offline) {demoMode ? '⚡ (ACTIVE)' : hasApiKey ? '✨ (AI READY)' : '⚠️ (NO KEY)'}
          </span>
        </label>
      </div>

      {/* Footer */}
      <footer className="mt-auto text-xs font-bold text-cream/70 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-marigold" />
        Gap Jumpers • 2-Player Pass-and-Play
      </footer>
    </div>
  );
};
