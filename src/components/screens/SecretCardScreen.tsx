import React, { useState } from 'react';
import { Eye, EyeOff, Shuffle, ArrowRight } from 'lucide-react';
import type { Scenario } from '../../types/game';

interface SecretCardScreenProps {
  scenario: Scenario;
  revealedAtLeastOnce: boolean;
  scenarioRerolled: boolean;
  onRevealHeld: () => void;
  onReroll: () => void;
  onReadyToDraw: () => void;
}

export const SecretCardScreen: React.FC<SecretCardScreenProps> = ({
  scenario,
  revealedAtLeastOnce,
  scenarioRerolled,
  onRevealHeld,
  onReroll,
  onReadyToDraw,
}) => {
  const [isPressing, setIsPressing] = useState(false);

  const startHold = () => {
    setIsPressing(true);
    onRevealHeld();
  };

  const endHold = () => {
    setIsPressing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 max-w-lg mx-auto text-center select-none">
      <div className="brutal-card-lg p-6 md:p-8 w-full rotate-1">
        <span className="bg-marigold text-black font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-3 shadow-brutal-sm">
          CONFIDENTIAL FOR PLAYER A
        </span>

        <h2 className="text-xl md:text-2xl font-bungee text-black mb-2">
          YOUR SECRET SCENARIO
        </h2>

        <p className="text-xs md:text-sm text-gray-700 font-bold mb-6">
          Press and HOLD to reveal your secret prompt. Keep it hidden from Player B!
        </p>

        {/* The Secret Card Box */}
        <div className="relative w-full h-40 bg-white border-4 border-black rounded-2xl shadow-brutal flex flex-col items-center justify-center p-4 mb-6 overflow-hidden">
          {isPressing ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <span className="text-5xl mb-2">{scenario.emoji}</span>
              <p className="text-lg md:text-xl font-bungee text-black leading-snug">
                {scenario.text}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <EyeOff className="w-12 h-12 mb-2 text-magenta" />
              <p className="font-bungee text-sm text-black">
                HIDDEN CONTENT
              </p>
              <p className="text-xs text-gray-500 font-semibold">
                Hold the button below to peek
              </p>
            </div>
          )}
        </div>

        {/* Hold to Reveal Button */}
        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onMouseDown={startHold}
          onMouseUp={endHold}
          className={`w-full py-4 text-base md:text-lg rounded-xl flex items-center justify-center gap-2 select-none touch-none brutal-btn ${
            isPressing
              ? 'bg-magenta text-white translate-x-1 translate-y-1 shadow-none'
              : 'bg-teal text-black'
          }`}
        >
          {isPressing ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          {isPressing ? 'REVEALING... (RELEASE TO HIDE)' : 'HOLD TO REVEAL 👁️'}
        </button>

        {/* Actions: Reroll & Ready to Draw */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-4 border-t-2 border-black/20">
          <button
            onClick={onReroll}
            disabled={scenarioRerolled}
            className="brutal-btn bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-xl text-xs md:text-sm font-bungee flex items-center justify-center gap-1.5 w-full sm:w-auto disabled:opacity-40"
            title={scenarioRerolled ? 'Reroll already used this round' : 'Get a different scenario (1 per round)'}
          >
            <Shuffle className="w-4 h-4" />
            {scenarioRerolled ? 'REROLLED' : 'REROLL (1X)'}
          </button>

          {revealedAtLeastOnce ? (
            <button
              onClick={onReadyToDraw}
              className="brutal-btn-primary py-2.5 text-xs md:text-sm flex items-center justify-center gap-2 w-full flex-1 animate-bounce"
            >
              READY TO DRAW
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-bold text-gray-500 italic py-2 flex-1">
              (Hold to reveal at least once to proceed)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
