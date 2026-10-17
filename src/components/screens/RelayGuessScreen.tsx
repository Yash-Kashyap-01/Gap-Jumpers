import React, { useEffect, useState, useRef } from 'react';
import { Volume2, Send } from 'lucide-react';
import type { Persona, Constraint } from '../../types/game';
import { audioManager } from '../../lib/audio';

interface RelayGuessScreenProps {
  relayText: string;
  persona: Persona;
  constraint: Constraint;
  guessText: string;
  onChangeGuess: (val: string) => void;
  onSubmitGuess: () => void;
  isSubmitting: boolean;
}

export const RelayGuessScreen: React.FC<RelayGuessScreenProps> = ({
  relayText,
  persona,
  constraint,
  guessText,
  onChangeGuess,
  onSubmitGuess,
  isSubmitting,
}) => {
  // 60-second countdown timer for Player B
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const isSubmittedRef = useRef(false);
  const onSubmitGuessRef = useRef(onSubmitGuess);
  onSubmitGuessRef.current = onSubmitGuess;
  const isSubmittingRef = useRef(isSubmitting);
  isSubmittingRef.current = isSubmitting;

  // Auto-speak relay once on mount
  useEffect(() => {
    audioManager.speak(relayText, persona.pitch, persona.rate);
    return () => {
      audioManager.stopSpeech();
    };
  }, [relayText, persona]);

  // 1-minute linear wall-clock countdown timer
  useEffect(() => {
    const durationMs = 60 * 1000;
    const endTime = Date.now() + durationMs;
    let lastPlayedTick = -1;

    const timer = setInterval(() => {
      if (isSubmittingRef.current || isSubmittedRef.current) {
        clearInterval(timer);
        return;
      }

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0 && remaining !== lastPlayedTick) {
        lastPlayedTick = remaining;
        audioManager.playTick();
      }

      if (now >= endTime || remaining <= 0) {
        clearInterval(timer);
        if (!isSubmittedRef.current && !isSubmittingRef.current) {
          isSubmittedRef.current = true;
          onSubmitGuessRef.current();
        }
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleReplayAudio = () => {
    audioManager.speak(relayText, persona.pitch, persona.rate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    onSubmitGuess();
  };

  const charCount = guessText.length;
  const maxChars = 200;

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 max-w-xl mx-auto w-full select-none animate-fade-in">
      <div className="brutal-card-lg p-6 md:p-8 w-full rotate-1">
        {/* Header: Persona badge, Timer & Replay */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{persona.emoji}</span>
            <div className="text-left">
              <span className="text-xs font-bungee text-magenta block">INTERPRETER SAYS:</span>
              <span className="text-sm font-bold text-black">{persona.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 60s Countdown Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black rounded-lg font-bungee text-xs md:text-sm shadow-brutal-sm ${
                timeLeft <= 15
                  ? 'bg-magenta text-white animate-pulse'
                  : 'bg-white text-black'
              }`}
            >
              <span>⏳</span>
              <span>{timeLeft}s</span>
            </div>

            <button
              onClick={handleReplayAudio}
              className="brutal-btn bg-teal hover:bg-[#00d4c3] text-black px-3 py-1.5 rounded-lg text-xs font-bungee flex items-center gap-1.5"
              title="Read relay aloud"
            >
              <Volume2 className="w-4 h-4" />
              REPLAY
            </button>
          </div>
        </div>

        {/* Speech Bubble with Relay */}
        <div className="relative bg-white border-3 border-black rounded-2xl p-4 shadow-brutal mb-6 text-left">
          <p className="text-base md:text-lg font-bold text-gray-900 leading-relaxed italic">
            "{relayText}"
          </p>
          <div className="absolute -bottom-3 left-8 w-4 h-4 bg-white border-r-3 border-b-3 border-black rotate-45" />
        </div>

        {/* B's Constraint Banner */}
        <div className="bg-marigold border-3 border-black rounded-xl p-3 shadow-brutal-sm mb-5 text-left flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <div className="text-[10px] font-bungee text-black uppercase tracking-wider">
              YOUR SILLY TYPING RULE:
            </div>
            <div className="text-sm font-bold text-black">
              {constraint.text}
            </div>
          </div>
        </div>

        {/* Guess Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={guessText}
              onChange={(e) => onChangeGuess(e.target.value)}
              placeholder="What scenario was the Doodler drawing? Type your guess here..."
              maxLength={maxChars}
              disabled={isSubmitting}
              className="w-full p-3 border-3 border-black rounded-xl bg-white shadow-brutal-sm font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-magenta resize-none"
            />
            <div className="text-right text-xs font-bold text-gray-500 mt-1">
              {charCount} / {maxChars}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="brutal-btn-primary w-full py-3.5 text-base md:text-lg flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'ANALYZING GUESS...' : 'SUBMIT GUESS'}
          </button>
        </form>
      </div>
    </div>
  );
};
