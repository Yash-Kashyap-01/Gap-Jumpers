import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Copy, Check } from 'lucide-react';
import type { RoundResult } from '../../types/game';
import { audioManager } from '../../lib/audio';

interface EndScreenProps {
  outcome: 'WIN' | 'LOSE';
  rounds: number;
  history: RoundResult[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({
  outcome,
  rounds,
  history,
  onPlayAgain,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);

  // Trigger win confetti & win audio jingle
  useEffect(() => {
    if (outcome === 'WIN') {
      audioManager.playWinJingle();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB400', '#FF6B1A', '#E6007E', '#00B8A9', '#FFF6E0'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [outcome]);

  // Compute stats
  const totalScore = history.reduce((acc, h) => acc + h.score, 0);
  const avgScore = history.length > 0 ? Math.round(totalScore / history.length) : 0;

  // Top translation logic:
  // In WIN: highest scoring round.
  // In LOSE: highest scoring round only if it earned a plank (score >= 30), else null.
  const topTranslation = outcome === 'WIN'
    ? (history.length > 0 ? [...history].sort((a, b) => b.score - a.score)[0] : null)
    : (history.filter(h => h.score >= 30).sort((a, b) => b.score - a.score)[0] || null);

  // Best roast logic:
  // Lowest score round with score < 50 that is not the same as topTranslation (if multiple rounds exist)
  const candidateRoasts = history.filter(
    (h) => h.score < 50 && (!topTranslation || h.roundNumber !== topTranslation.roundNumber)
  );
  const fallbackRoasts = history.filter((h) => h.score < 50);
  const bestRoast = candidateRoasts.length > 0
    ? [...candidateRoasts].sort((a, b) => a.score - b.score)[0]
    : (fallbackRoasts.length > 0 && !topTranslation
      ? [...fallbackRoasts].sort((a, b) => a.score - b.score)[0]
      : null);

  // Generate emoji bridge representation e.g. 🟩🟨💥
  const bridgeEmojis = history
    .map((h) => {
      if (h.score >= 70) return '🟩';
      if (h.score >= 30) return '🟨';
      return '💥';
    })
    .join('');

  const handleCopyResult = () => {
    const text = `🌉 GAP JUMPERS\nOutcome: ${outcome === 'WIN' ? '🏆 VICTORY!' : '💥 THE GAP WON!'}\nBridge: ${bridgeEmojis}\nRounds: ${rounds} | Avg Score: ${avgScore}/100`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // fallback
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 max-w-xl mx-auto w-full select-none animate-fade-in text-center">
      <div className="brutal-card-lg p-6 md:p-8 w-full rotate-0.5">
        {/* Outcome Header Banner */}
        {outcome === 'WIN' ? (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-2 animate-bounce">🏆</div>
            <span className="bg-marigold text-black font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-2 shadow-brutal-sm">
              BRIDGE COMPLETE!
            </span>
            <h2 className="text-3xl md:text-4xl font-bungee text-black mb-2">
              YOU BRIDGED THE GAP!
            </h2>
            <p className="text-sm font-bold text-gray-700 max-w-md mb-6">
              Against all translation chaos, Player A's art and Player B's wit met in the middle!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-2 animate-shake">💥</div>
            <span className="bg-magenta text-white font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-2 shadow-brutal-sm">
              COLLAPSE DETECTED
            </span>
            <h2 className="text-3xl md:text-4xl font-bungee text-black mb-2">
              THE GAP WON THIS TIME!
            </h2>
            <p className="text-sm font-bold text-gray-700 max-w-md mb-6">
              The crocodiles had a feast of fallen planks. Time for a rematch!
            </p>
          </div>
        )}

        {/* Emoji Bridge Trail */}
        <div className="bg-white border-3 border-black rounded-xl p-3 shadow-brutal-sm mb-5 flex items-center justify-center gap-2 text-2xl">
          {bridgeEmojis || '🌉'}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm">
            <span className="text-[10px] font-bungee text-gray-600 block">ROUNDS</span>
            <span className="text-2xl font-bungee text-black">{rounds}</span>
          </div>

          <div className="bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm">
            <span className="text-[10px] font-bungee text-gray-600 block">AVG GAP SCORE</span>
            <span className="text-2xl font-bungee text-magenta">{avgScore} / 100</span>
          </div>

          {topTranslation && (
            <div className="col-span-2 bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm text-left">
              <span className="text-[10px] font-bungee text-teal block mb-1">
                TOP TRANSLATION
              </span>
              <p className="text-xs font-bold text-gray-800 italic">
                "{topTranslation.comment}"
              </p>
              <div className="text-[10px] text-gray-600 mt-1 font-semibold truncate">
                {topTranslation.scenario.emoji} {topTranslation.scenario.text} → "{topTranslation.guessText || '(Empty)'}"
              </div>
            </div>
          )}

          {bestRoast && (
            <div className="col-span-2 bg-cream border-2 border-black rounded-xl p-3 shadow-brutal-sm text-left">
              <span className="text-[10px] font-bungee text-saffron block mb-1">
                BEST ROAST
              </span>
              <p className="text-xs font-bold text-gray-800 italic">
                "{bestRoast.comment}"
              </p>
              <div className="text-[10px] text-gray-600 mt-1 font-semibold truncate">
                {bestRoast.persona.emoji} {bestRoast.persona.name} on: "{bestRoast.guessText || '(No guess)'}"
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="brutal-btn-primary py-3 px-5 text-sm md:text-base flex items-center justify-center gap-2 w-full flex-1"
          >
            <RotateCcw className="w-4 h-4" />
            PLAY AGAIN
          </button>

          <button
            onClick={handleCopyResult}
            className="brutal-btn bg-teal hover:bg-[#00d4c3] text-black py-3 px-4 rounded-xl text-sm font-bungee flex items-center justify-center gap-2 w-full sm:w-auto"
            title="Copy score & emoji summary to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED!' : 'COPY RESULT'}
          </button>

          <button
            onClick={onGoHome}
            className="brutal-btn bg-white hover:bg-gray-100 text-black py-3 px-4 rounded-xl text-sm font-bungee flex items-center justify-center gap-2 w-full sm:w-auto"
            title="Return to title screen"
          >
            <Home className="w-4 h-4" />
            HOME
          </button>
        </div>
      </div>
    </div>
  );
};
