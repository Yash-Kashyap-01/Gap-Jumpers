import React, { useEffect, useState } from 'react';
import { ArrowRight, Trophy, Skull } from 'lucide-react';
import type { RoundResult } from '../../types/game';
import { ScoreGauge } from '../ScoreGauge';
import { audioManager } from '../../lib/audio';

interface ResultScreenProps {
  result: RoundResult;
  isGameOver: boolean;
  gameOutcome: 'WIN' | 'LOSE' | null;
  onProceed: () => void;
  triggerBridgeCollapse: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  isGameOver,
  gameOutcome,
  onProceed,
  triggerBridgeCollapse,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Play appropriate sound effect based on score
    if (result.score >= 70) {
      audioManager.playPlankThunk();
    } else if (result.score >= 30) {
      audioManager.playWobblyBoing();
    } else {
      triggerBridgeCollapse();
      audioManager.playCollapseCrash();
    }

    // Read AI comment aloud
    if (result.comment) {
      audioManager.speak(result.comment, result.persona.pitch, result.persona.rate);
    }

    const t = setTimeout(() => setShowDetails(true), 600);
    return () => {
      clearTimeout(t);
      audioManager.stopSpeech();
    };
  }, [result, triggerBridgeCollapse]);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 max-w-2xl mx-auto w-full select-none animate-fade-in">
      <div className="brutal-card-lg p-6 md:p-8 w-full -rotate-0.5">
        {/* Animated Score Gauge */}
        <ScoreGauge targetScore={result.score} />

        {/* AI Persona Comment / Roast */}
        <div className="mt-4 bg-white border-3 border-black rounded-2xl p-4 shadow-brutal text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">{result.persona.emoji}</span>
            <span className="text-xs font-bungee text-magenta">
              {result.persona.name}:
            </span>
          </div>
          <p className="text-sm md:text-base font-bold text-gray-900 italic">
            "{result.comment}"
          </p>
        </div>

        {/* Comparison: Secret Scenario vs Guess + Thumbnail */}
        {showDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 animate-fade-in">
            {/* Secret Scenario */}
            <div className="bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm text-left">
              <span className="text-[10px] font-bungee text-magenta block mb-1">
                SECRET SCENARIO:
              </span>
              <div className="flex items-start gap-2">
                <span className="text-2xl">{result.scenario.emoji}</span>
                <span className="text-sm font-bold text-black leading-snug">
                  {result.scenario.text}
                </span>
              </div>
            </div>

            {/* Player B's Guess */}
            <div className="bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm text-left">
              <span className="text-[10px] font-bungee text-teal block mb-1">
                PLAYER B'S GUESS:
              </span>
              <p className="text-sm font-bold text-gray-800 italic break-words">
                "{result.guessText || '(Empty guess)'}"
              </p>
            </div>
          </div>
        )}

        {/* Doodle Thumbnail reveal */}
        {result.doodleDataUrl && (
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bungee text-gray-600 mb-1">
              THE ORIGINAL DOODLE:
            </span>
            <div className="w-40 h-28 border-2 border-black rounded-xl shadow-brutal-sm overflow-hidden bg-white">
              <img
                src={result.doodleDataUrl}
                alt="Player A's doodle"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <div className="mt-6 pt-3 border-t-2 border-black/20">
          <button
            onClick={onProceed}
            className="brutal-btn-primary w-full py-3.5 text-base md:text-lg flex items-center justify-center gap-2"
          >
            {isGameOver ? (
              gameOutcome === 'WIN' ? (
                <>
                  <Trophy className="w-5 h-5" />
                  SEE VICTORY!
                </>
              ) : (
                <>
                  <Skull className="w-5 h-5" />
                  SEE FINAL DAMAGE
                </>
              )
            ) : (
              <>
                NEXT ROUND
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
