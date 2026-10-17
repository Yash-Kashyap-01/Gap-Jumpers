import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../../data/content';
import type { Persona } from '../../types/game';

interface InterpretingScreenProps {
  persona: Persona;
  isScoring?: boolean;
}

export const InterpretingScreen: React.FC<InterpretingScreenProps> = ({
  persona,
  isScoring = false,
}) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 max-w-lg mx-auto text-center select-none">
      <div className="brutal-card-lg p-8 w-full -rotate-1 relative overflow-hidden">
        {/* Animated Mascot */}
        <div className="relative mb-6 inline-block">
          <div className="w-24 h-24 bg-white border-4 border-black rounded-3xl shadow-brutal flex items-center justify-center text-5xl animate-mascot mx-auto">
            🤖
          </div>
          <div className="absolute -bottom-2 -right-2 bg-magenta border-3 border-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-brutal-sm">
            {persona.emoji}
          </div>
        </div>

        {/* Persona Title */}
        <div className="bg-marigold text-black font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-3 shadow-brutal-sm">
          {persona.name.toUpperCase()}
        </div>

        <h2 className="text-xl md:text-2xl font-bungee text-black mb-3">
          {isScoring ? 'EVALUATING GAP...' : 'TRANSLATING DOODLE...'}
        </h2>

        {/* Rotating Loading Line */}
        <div className="bg-white border-3 border-black rounded-xl p-4 shadow-brutal min-h-[72px] flex items-center justify-center">
          <p className="font-bold text-sm md:text-base text-gray-800 transition-all duration-300">
            "{LOADING_MESSAGES[msgIndex]}"
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2">
          <div className="w-3 h-3 bg-teal rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-saffron rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-3 h-3 bg-magenta rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};
