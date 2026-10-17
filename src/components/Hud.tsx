import React, { useState } from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, RotateCcw, Heart } from 'lucide-react';
import type { PlankType } from '../types/game';

interface HudProps {
  roundNumber: number;
  planks: PlankType[];
  lives: number;
  honestMode: boolean;
  onToggleHonest: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onRestart: () => void;
  onGoHome: () => void;
  isDemoMode: boolean;
}

export const Hud: React.FC<HudProps> = ({
  roundNumber,
  planks,
  lives,
  honestMode,
  onToggleHonest,
  muted,
  onToggleMute,
  onOpenSettings,
  onRestart,
  onGoHome,
  isDemoMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-cream border-b-[3px] border-black px-4 py-2.5 shadow-brutal flex flex-wrap items-center justify-between gap-3 select-none relative z-40">
      {/* Left: Title & Round */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="text-lg md:text-xl font-bungee tracking-wide text-black hover:text-magenta transition-colors"
          title="Back to home"
        >
          GAP JUMPERS
        </button>
        <div className="bg-marigold px-2.5 py-0.5 border-2 border-black rounded-lg font-bungee text-xs text-black shadow-brutal-sm">
          R{roundNumber}
        </div>
        {honestMode && (
          <span className="bg-teal text-black px-2 py-0.5 border-2 border-black rounded-md font-bungee text-[10px] tracking-wider animate-pulse">
            HONEST MODE
          </span>
        )}
        {isDemoMode && (
          <span className="bg-yellow-300 text-black px-2 py-0.5 border-2 border-black rounded-md font-bungee text-[10px] tracking-wider">
            OFFLINE MODE
          </span>
        )}
      </div>

      {/* Center: Planks & Lives */}
      <div className="flex items-center gap-4">
        {/* Bridge Planks: 3 slots */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border-2 border-black rounded-xl shadow-brutal-sm" title="Bridge progress (3 to win)">
          <span className="text-[10px] font-bungee mr-1">BRIDGE:</span>
          {[0, 1, 2].map((idx) => {
            const plank = planks[idx];
            if (!plank) {
              return (
                <div
                  key={idx}
                  className="w-7 h-4 border-2 border-dashed border-gray-400 rounded bg-gray-100"
                  title="Empty slot"
                />
              );
            }
            if (plank === 'solid') {
              return (
                <div
                  key={idx}
                  className="w-7 h-4 bg-marigold border-2 border-black rounded shadow-[1px_1px_0px_#000]"
                  title="Solid Plank"
                />
              );
            }
            return (
              <div
                key={idx}
                className="w-7 h-4 bg-saffron border-2 border-black rounded -rotate-6 shadow-[1px_1px_0px_#000]"
                title="Wobbly Plank"
              />
            );
          })}
        </div>

        {/* Lives: 2 hearts */}
        <div className="flex items-center gap-1 bg-white px-2 py-1 border-2 border-black rounded-xl shadow-brutal-sm" title="Lives (2 collapses = game over)">
          {[0, 1].map((idx) => {
            const isAlive = idx < lives;
            return (
              <Heart
                key={idx}
                className={`w-5 h-5 ${
                  isAlive
                    ? 'text-magenta fill-magenta drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                    : 'text-gray-300 fill-gray-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Right: Controls & Menu */}
      <div className="flex items-center gap-2">
        {/* Honest Mode Switch */}
        <button
          onClick={onToggleHonest}
          className={`px-2 py-1 border-2 border-black rounded-lg text-xs font-bungee shadow-brutal-sm transition-all ${
            honestMode ? 'bg-teal text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Toggle Honest vs Chaotic Interpreter"
        >
          {honestMode ? '🤝 HONEST' : '🤪 CHAOS'}
        </button>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className="p-1.5 bg-cream hover:bg-white border-2 border-black rounded-lg shadow-brutal-sm text-black"
          title={muted ? 'Unmute audio' : 'Mute audio'}
          aria-label="Toggle mute"
        >
          {muted ? <VolumeX className="w-4 h-4 text-magenta" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Menu Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 bg-cream hover:bg-white border-2 border-black rounded-lg shadow-brutal-sm text-black"
            title="Menu & Settings"
            aria-label="Menu"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-cream border-3 border-black shadow-brutal-lg rounded-xl w-44 py-2 z-50 animate-fade-in">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-marigold flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                API & Settings
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (confirm('Restart game from Round 1?')) {
                    onRestart();
                  }
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-saffron hover:text-white flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
