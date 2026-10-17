import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlankType, Persona } from '../types/game';

interface BridgeSceneProps {
  planks: PlankType[];
  persona: Persona | null;
  speechText?: string;
  isCollapsing?: boolean;
  isWon?: boolean;
  isLost?: boolean;
  collapsedPlankIndex?: number | null;
}

export const BridgeScene: React.FC<BridgeSceneProps> = ({
  planks,
  persona,
  isCollapsing = false,
  isWon = false,
  isLost = false,
  collapsedPlankIndex = null,
}) => {
  // Determine traveler horizontal position based on game state
  // 0 planks: on left cliff (13%)
  // 1 plank: on plank 1 (37%)
  // 2 planks: on plank 2 (51%)
  // 3 planks: on plank 3 (65%)
  // isWon: crosses all the way onto right cliff (87%)
  const getTravelerPosition = () => {
    if (isWon) return '87%';
    if (isCollapsing || isLost) {
      // Fall from the active/collapsed plank or current furthest plank
      if (collapsedPlankIndex === 0) return '37%';
      if (collapsedPlankIndex === 1) return '51%';
      if (collapsedPlankIndex === 2) return '65%';
      if (planks.length === 1) return '37%';
      if (planks.length === 2) return '51%';
      if (planks.length >= 3) return '65%';
      return '30%'; // Fell taking first step
    }
    if (planks.length === 0) return '13%';
    if (planks.length === 1) return '37%';
    if (planks.length === 2) return '51%';
    return '65%';
  };

  const travelerPos = getTravelerPosition();
  const isDead = isCollapsing || isLost;

  return (
    <div
      className={`relative w-full h-52 md:h-60 overflow-hidden bg-gradient-to-b from-[#0e072b] via-[#161245] to-[#082a47] border-b-4 border-black select-none ${
        isCollapsing ? 'animate-shake' : ''
      }`}
    >
      {/* Sky Sparkles / Stars */}
      <div className="absolute top-2 left-10 text-yellow-300 text-xs animate-pulse">✦</div>
      <div className="absolute top-7 left-1/4 text-white text-[10px] opacity-70">★</div>
      <div className="absolute top-3 right-1/4 text-yellow-200 text-xs animate-pulse">✦</div>
      <div className="absolute top-6 right-12 text-teal-300 text-[11px] opacity-80">★</div>

      {/* SVG Suspension Cable Arch & Hangers spanning the gorge */}
      <svg
        className="absolute top-10 left-24 right-24 md:left-32 md:right-32 w-[calc(100%-12rem)] md:w-[calc(100%-16rem)] h-28 pointer-events-none z-10 mx-auto"
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
      >
        {/* Main upper suspension catenary cable */}
        <path
          d="M 10,10 Q 300,85 590,10"
          fill="none"
          stroke="#4a2e18"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 10,10 Q 300,85 590,10"
          fill="none"
          stroke="#d4a373"
          strokeWidth="3"
          strokeDasharray="6,3"
          strokeLinecap="round"
        />

        {/* Vertical suspender ropes hanging to deck */}
        <line x1="80" y1="23" x2="80" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="160" y1="42" x2="160" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="240" y1="58" x2="240" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="320" y1="62" x2="320" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="400" y1="58" x2="400" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="480" y1="42" x2="480" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />
        <line x1="540" y1="23" x2="540" y2="86" stroke="#8c5835" strokeWidth="2.5" strokeDasharray="3,2" />

        {/* Handrail guide rope */}
        <path
          d="M 10,50 Q 300,75 590,50"
          fill="none"
          stroke="#e09f3e"
          strokeWidth="2.5"
          opacity="0.8"
        />
      </svg>

      {/* Left Cliff: Player A (✏️ Doodler) with Wooden Anchor Tower */}
      <div className="absolute bottom-0 left-0 w-28 md:w-36 h-28 md:h-32 bg-[#6f3711] border-t-4 border-r-4 border-black rounded-tr-3xl z-20 flex flex-col items-center justify-start pt-2">
        {/* Grass edge */}
        <div className="w-full h-3.5 bg-[#38b000] -mt-2 border-b-3 border-black rounded-tr-xl flex justify-around items-end">
          <span className="text-[8px] text-green-900 leading-none">▲▲▲</span>
          <span className="text-[8px] text-green-900 leading-none">▲▲</span>
        </div>

        {/* Bridge anchor post */}
        <div className="absolute top-2 right-2 w-4 h-12 bg-[#432818] border-2 border-black rounded-sm flex flex-col justify-around items-center">
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
        </div>

        <div className="flex flex-col items-center mt-2">
          <span className="text-2xl md:text-3xl animate-bounce">✏️</span>
          <span className="text-[10px] md:text-xs font-bungee text-white bg-black px-2 py-0.5 rounded mt-1 shadow-brutal-sm border border-white/20">
            DOODLER
          </span>
        </div>
      </div>

      {/* Right Cliff: Player B (⌨️ Typist) with Wooden Anchor Tower */}
      <div className="absolute bottom-0 right-0 w-28 md:w-36 h-28 md:h-32 bg-[#6f3711] border-t-4 border-l-4 border-black rounded-tl-3xl z-20 flex flex-col items-center justify-start pt-2">
        {/* Grass edge */}
        <div className="w-full h-3.5 bg-[#38b000] -mt-2 border-b-3 border-black rounded-tl-xl flex justify-around items-end">
          <span className="text-[8px] text-green-900 leading-none">▲▲▲</span>
          <span className="text-[8px] text-green-900 leading-none">▲▲</span>
        </div>

        {/* Bridge anchor post */}
        <div className="absolute top-2 left-2 w-4 h-12 bg-[#432818] border-2 border-black rounded-sm flex flex-col justify-around items-center">
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
          <div className="w-2.5 h-1 bg-yellow-600 rounded-full" />
        </div>

        <div className="flex flex-col items-center mt-2">
          <span className="text-2xl md:text-3xl animate-bounce">⌨️</span>
          <span className="text-[10px] md:text-xs font-bungee text-white bg-black px-2 py-0.5 rounded mt-1 shadow-brutal-sm border border-white/20">
            TYPIST
          </span>
        </div>
      </div>

      {/* Ocean Water Gorge Basin at Bottom */}
      <div className="absolute bottom-0 left-24 right-24 md:left-32 md:right-32 h-16 md:h-20 bg-gradient-to-t from-[#003554] via-[#006494]/85 to-[#0582ca]/70 border-t-4 border-black z-10 overflow-hidden">
        {/* Water wave texture */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,#ffffff_2px,transparent_2px)] bg-[size:14px_14px]" />
        
        {/* Water surface ripple lines */}
        <div className="absolute top-1 left-0 right-0 flex justify-around text-teal-200 text-xs opacity-60 animate-pulse">
          <span>〰️〰️〰️</span>
          <span>〰️〰️〰️〰️</span>
          <span>〰️〰️〰️</span>
        </div>

        {/* Lurking Ocean Creatures */}
        <div className="absolute bottom-2 left-6 text-2xl md:text-3xl animate-bob">
          🐊
        </div>
        <div className="absolute bottom-3 right-8 text-xl md:text-2xl animate-bob" style={{ animationDelay: '1.2s' }}>
          🦈
        </div>
        <div className="absolute bottom-1 right-24 text-lg animate-swim-rtl">
          🐟
        </div>

        {/* Death/Collapse Ocean Splash & Crocodile Attack */}
        {isDead && (
          <>
            {/* Water splash fountain */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: [0, 1.8, 2.2, 1.6], opacity: [0, 1, 0.9, 0], y: [15, -28, -35, -5] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute bottom-4 z-30 text-3xl md:text-4xl filter drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
              style={{ left: `calc(${travelerPos} - 28px)` }}
            >
              💦💥💦🌊
            </motion.div>

            {/* Snapping Crocodile Lunging Up */}
            <motion.div
              initial={{ y: 25, scale: 0.8 }}
              animate={{ y: [-5, -22, 15], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute bottom-2 z-40 text-3xl font-bungee flex items-center gap-1"
              style={{ left: `calc(${travelerPos} - 20px)` }}
            >
              <span>🐊</span>
              <span className="text-[10px] bg-red-600 text-white px-1 rounded shadow-brutal-sm animate-pulse">
                CHOMP!
              </span>
            </motion.div>

            {/* Ascending Floating Ghost / Skull Death Marker */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0.85], y: [-10, -50, -85], scale: [0.6, 1.1, 1] }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
              className="absolute bottom-12 z-50 flex flex-col items-center pointer-events-none"
              style={{ left: `calc(${travelerPos} - 24px)` }}
            >
              <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce">
                💀
              </div>
              <div className="bg-black/90 border-2 border-red-500 text-red-300 font-bungee text-[9px] px-2 py-0.5 rounded shadow-brutal-sm mt-0.5">
                R.I.P. 🪦
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* The Bridge Construction Area */}
      <div className="absolute bottom-16 md:bottom-20 left-28 right-28 md:left-36 md:right-36 h-10 flex items-center justify-between px-2 z-30">
        {[0, 1, 2].map((slotIdx) => {
          const plank = planks[slotIdx];
          const isTargetCollapse = (isCollapsing || isLost) && (collapsedPlankIndex === slotIdx || (collapsedPlankIndex === null && slotIdx === planks.length));

          return (
            <div
              key={slotIdx}
              className="relative flex-1 h-9 mx-1.5 flex items-center justify-center"
            >
              {/* Empty slot placeholder dashed outline */}
              {!plank && !isTargetCollapse && (
                <div className="w-full h-6 border-2 border-dashed border-amber-300/40 rounded-md bg-black/30 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-[9px] font-bungee text-amber-200/50">SLOT {slotIdx + 1}</span>
                </div>
              )}

              {/* Solid Plank: Sturdy Gold Timber with Bolt heads & Rope wraps */}
              <AnimatePresence>
                {plank === 'solid' && !isTargetCollapse && (
                  <motion.div
                    initial={{ y: -35, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="relative w-full h-7 bg-gradient-to-r from-amber-500 via-[#ffd166] to-amber-500 border-3 border-black rounded shadow-[2px_3px_0px_#000] flex items-center justify-between px-2 overflow-hidden"
                  >
                    {/* Left & Right bolt heads */}
                    <div className="w-1.5 h-1.5 rounded-full bg-black/70 border border-amber-800" />
                    
                    <div className="flex items-center gap-1">
                      <span className="text-[8px]">🧵</span>
                      <span className="text-[10px] font-bungee text-black tracking-tighter uppercase font-bold">
                        SOLID
                      </span>
                      <span className="text-[8px]">🧵</span>
                    </div>

                    <div className="w-1.5 h-1.5 rounded-full bg-black/70 border border-amber-800" />

                    {/* Timber grain lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.5)_8px,rgba(0,0,0,0.5)_9px)]" />
                  </motion.div>
                )}

                {/* Wobbly Plank: Distressed Timber with Stress Cracks & Looping Creak */}
                {plank === 'wobbly' && !isTargetCollapse && (
                  <motion.div
                    initial={{ y: -30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, rotate: -45 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="relative w-full h-7 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 border-3 border-black rounded shadow-[2px_3px_0px_#000] flex items-center justify-between px-2 animate-jiggle overflow-hidden"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-950 border border-amber-400" />
                    
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] animate-pulse">⚡</span>
                      <span className="text-[9px] font-bungee text-white tracking-tighter uppercase drop-shadow-[0_1px_1px_#000]">
                        WOBBLY
                      </span>
                      <span className="text-[8px] animate-pulse">⚡</span>
                    </div>

                    <div className="w-1.5 h-1.5 rounded-full bg-red-950 border border-amber-400" />

                    {/* Stress cracks */}
                    <div className="absolute inset-0 pointer-events-none opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.8)_6px,rgba(0,0,0,0.8)_7px)]" />
                  </motion.div>
                )}

                {/* Snapping / Broken Plank Halves Tumbling into Abyss */}
                {isTargetCollapse && (
                  <div className="relative w-full h-7 flex items-center justify-center">
                    {/* Left half snaps down-left */}
                    <motion.div
                      initial={{ rotate: 0, y: 0 }}
                      animate={{ rotate: -55, y: 65, opacity: [1, 1, 0] }}
                      transition={{ duration: 0.9, ease: 'easeIn' }}
                      className="w-1/2 h-6 bg-red-700 border-3 border-black rounded-l shadow-brutal flex items-center justify-center"
                    >
                      <span className="text-[8px] font-bungee text-white">💥</span>
                    </motion.div>
                    {/* Right half snaps down-right */}
                    <motion.div
                      initial={{ rotate: 0, y: 0 }}
                      animate={{ rotate: 60, y: 70, opacity: [1, 1, 0] }}
                      transition={{ duration: 0.9, ease: 'easeIn' }}
                      className="w-1/2 h-6 bg-red-800 border-3 border-black rounded-r shadow-brutal flex items-center justify-center"
                    >
                      <span className="text-[8px] font-bungee text-yellow-300">SNAP!</span>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Center Mascot: 🤖 Interpreter wearing persona badge */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center pointer-events-none">
        <div className="relative animate-mascot">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-white border-3 border-black rounded-2xl shadow-brutal flex items-center justify-center text-xl">
            🤖
          </div>
          {/* Persona emoji badge attached to mascot */}
          <div className="absolute -bottom-1 -right-1 bg-magenta border-2 border-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-brutal-sm">
            {persona?.emoji || '🎭'}
          </div>
        </div>
      </div>

      {/* TRAVELER CHARACTER PROGRESSION & CROSSING / FALLING PHYSICS */}
      <AnimatePresence>
        {!isDead ? (
          /* Normal Walking / Standing on Bridge / Win Crossing */
          <motion.div
            key="traveler-alive"
            initial={{ left: '13%' }}
            animate={{ left: travelerPos }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            className="absolute bottom-20 md:bottom-24 z-40 flex flex-col items-center pointer-events-none -ml-4"
          >
            {/* Victory Speech Bubble or Stride */}
            {isWon ? (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: [1, 1.2, 1], y: [-6, -14, -6] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="flex flex-col items-center"
              >
                <div className="bg-marigold text-black font-bungee text-[9px] px-2 py-0.5 rounded-full border-2 border-black shadow-brutal-sm whitespace-nowrap mb-0.5">
                  SAFELY CROSSED! 🎉
                </div>
                <div className="text-3xl md:text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  🕺
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                {planks.length > 0 && (
                  <div className="text-[8px] font-bungee text-white bg-black/80 px-1.5 py-0.2 rounded border border-white/20 mb-0.5 shadow-brutal-sm">
                    {planks.length}/3
                  </div>
                )}
                <div className="text-2xl md:text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce" style={{ animationDuration: '0.8s' }}>
                  🚶‍♂️
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Tragic Death Fall Sequence into the Ocean */
          <motion.div
            key="traveler-dead"
            initial={{ left: travelerPos, y: 0, rotate: 0, scale: 1 }}
            animate={{
              y: [0, -25, 95],
              rotate: [0, 90, 360, 540],
              scale: [1, 1.2, 0.75],
            }}
            transition={{ duration: 1.1, ease: 'easeIn' }}
            className="absolute bottom-20 md:bottom-24 z-40 flex flex-col items-center pointer-events-none -ml-4"
          >
            <div className="bg-red-600 text-white font-bungee text-[9px] px-1.5 py-0.5 rounded border-2 border-black shadow-brutal-sm whitespace-nowrap mb-0.5 animate-pulse">
              AAAAGH! 😱
            </div>
            <div className="text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
              😱
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win State: Confetti & Sparkles Shower */}
      {isWon && (
        <div className="absolute inset-0 pointer-events-none z-45 overflow-hidden">
          <div className="absolute top-2 left-1/4 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>
            ✨
          </div>
          <div className="absolute top-4 right-1/4 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>
            🎊
          </div>
          <div className="absolute top-6 left-1/2 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
            🎉
          </div>
          <div className="absolute top-3 right-1/3 text-xl animate-pulse">
            ⭐
          </div>
        </div>
      )}
    </div>
  );
};

export default BridgeScene;
