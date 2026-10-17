import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlankType, Persona } from '../types/game';

interface BridgeSceneProps {
  planks: PlankType[];
  persona: Persona | null;
  speechText?: string;
  isCollapsing?: boolean;
  isWon?: boolean;
  collapsedPlankIndex?: number | null;
}

export const BridgeScene: React.FC<BridgeSceneProps> = ({
  planks,
  persona,
  isCollapsing = false,
  isWon = false,
  collapsedPlankIndex = null,
}) => {
  return (
    <div className={`relative w-full h-44 md:h-52 overflow-hidden bg-gradient-to-b from-[#181048] to-[#0c0828] border-b-4 border-black select-none ${isCollapsing ? 'animate-shake' : ''}`}>
      {/* Decorative stars / dust in the sky */}
      <div className="absolute top-2 left-10 text-yellow-300 text-xs animate-pulse">✦</div>
      <div className="absolute top-6 left-1/3 text-white text-[10px] opacity-75">★</div>
      <div className="absolute top-3 right-1/4 text-yellow-200 text-xs animate-pulse">✦</div>

      {/* Left Cliff: Player A (✏️ Doodler) */}
      <div className="absolute bottom-0 left-0 w-28 md:w-36 h-24 md:h-28 bg-[#8B4513] border-t-4 border-r-4 border-black rounded-tr-3xl z-10 flex flex-col items-center justify-start pt-2">
        <div className="w-full h-3 bg-[#4CAF50] -mt-2 border-b-2 border-black rounded-tr-xl" />
        <div className="flex flex-col items-center mt-1">
          <span className="text-2xl md:text-3xl animate-bounce">✏️</span>
          <span className="text-[10px] md:text-xs font-bungee text-white bg-black px-1.5 py-0.5 rounded mt-0.5 shadow-brutal-sm">
            DOODLER
          </span>
        </div>
      </div>

      {/* Right Cliff: Player B (⌨️ Typist) */}
      <div className="absolute bottom-0 right-0 w-28 md:w-36 h-24 md:h-28 bg-[#8B4513] border-t-4 border-l-4 border-black rounded-tl-3xl z-10 flex flex-col items-center justify-start pt-2">
        <div className="w-full h-3 bg-[#4CAF50] -mt-2 border-b-2 border-black rounded-tl-xl" />
        <div className="flex flex-col items-center mt-1">
          <span className="text-2xl md:text-3xl animate-bounce">⌨️</span>
          <span className="text-[10px] md:text-xs font-bungee text-white bg-black px-1.5 py-0.5 rounded mt-0.5 shadow-brutal-sm">
            TYPIST
          </span>
        </div>
      </div>

      {/* River Basin at Bottom */}
      <div className="absolute bottom-0 left-24 right-24 md:left-32 md:right-32 h-14 bg-teal/90 border-t-4 border-black z-0 overflow-hidden">
        {/* River waves */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle,#ffffff_2px,transparent_2px)] bg-[size:16px_16px]" />
        
        {/* Bobbing Creatures: Crocodile and Fish */}
        <div className="absolute bottom-2 left-6 text-xl md:text-2xl animate-bob">
          🐊
        </div>
        <div className="absolute bottom-3 right-8 text-lg md:text-xl animate-bob" style={{ animationDelay: '1.2s' }}>
          🐟
        </div>
        <div className="absolute bottom-1 left-1/2 text-sm animate-pulse opacity-70">
          〰️ 〰️ 〰️
        </div>

        {/* Splash Effect during collapse */}
        {isCollapsing && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 10 }}
            animate={{ scale: [1, 2, 0], opacity: [1, 0.8, 0], y: [-5, -25, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl"
          >
            💦💥💦
          </motion.div>
        )}
      </div>

      {/* The Bridge Construction Area */}
      <div className="absolute bottom-14 left-28 right-28 md:left-36 md:right-36 h-9 flex items-center justify-between px-2 z-20">
        {[0, 1, 2].map((slotIdx) => {
          const plank = planks[slotIdx];
          const isTargetCollapse = isCollapsing && collapsedPlankIndex === slotIdx;

          return (
            <div
              key={slotIdx}
              className="relative flex-1 h-7 mx-1 flex items-center justify-center"
            >
              {/* Empty slot placeholder dashed outline */}
              {!plank && !isTargetCollapse && (
                <div className="w-full h-5 border-2 border-dashed border-white/40 rounded bg-white/5 flex items-center justify-center">
                  <span className="text-[9px] font-bungee text-white/40">{slotIdx + 1}</span>
                </div>
              )}

              {/* Solid Plank */}
              <AnimatePresence>
                {plank === 'solid' && !isTargetCollapse && (
                  <motion.div
                    initial={{ y: -30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="w-full h-6 bg-marigold border-3 border-black rounded shadow-[2px_2px_0px_#000] flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bungee text-black tracking-tighter">
                      ══ SOLID ══
                    </span>
                  </motion.div>
                )}

                {/* Wobbly Plank (~6° tilt + looping jiggle) */}
                {plank === 'wobbly' && !isTargetCollapse && (
                  <motion.div
                    initial={{ y: -25, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, rotate: -45 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="w-full h-6 bg-saffron border-3 border-black rounded shadow-[2px_2px_0px_#000] flex items-center justify-center animate-jiggle"
                  >
                    <span className="text-[9px] font-bungee text-white tracking-tighter">
                      〰️ WOBBLY 〰️
                    </span>
                  </motion.div>
                )}

                {/* Cracking and Falling Plank Animation */}
                {isTargetCollapse && (
                  <motion.div
                    initial={{ y: 0, rotate: 0 }}
                    animate={{ y: 60, rotate: 65, opacity: [1, 1, 0] }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-6 bg-red-600 border-3 border-black rounded shadow-brutal flex items-center justify-center"
                  >
                    <span className="text-[9px] font-bungee text-white">💥 SNAP!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Center Mascot: 🤖 Interpreter wearing persona emoji badge */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div className="relative animate-mascot">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-3 border-black rounded-2xl shadow-brutal flex items-center justify-center text-xl md:text-2xl">
            🤖
          </div>
          {/* Persona emoji badge attached to mascot */}
          <div className="absolute -bottom-1 -right-1 bg-magenta border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-brutal-sm">
            {persona?.emoji || '🎭'}
          </div>
        </div>
      </div>

      {/* Win State: Character Walking across the Bridge */}
      {isWon && (
        <motion.div
          initial={{ left: '25%' }}
          animate={{ left: '72%' }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
          className="absolute bottom-16 z-30 text-2xl"
        >
          🏃‍♂️💨
        </motion.div>
      )}
    </div>
  );
};
