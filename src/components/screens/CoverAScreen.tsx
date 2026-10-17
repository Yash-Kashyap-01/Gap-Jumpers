import React from 'react';
import { UserCheck } from 'lucide-react';

interface CoverAScreenProps {
  roundNumber: number;
  onProceed: () => void;
}

export const CoverAScreen: React.FC<CoverAScreenProps> = ({
  roundNumber,
  onProceed,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 max-w-lg mx-auto text-center">
      <div className="brutal-card-lg p-8 w-full -rotate-1">
        <div className="text-6xl mb-4">🙈</div>

        <div className="bg-magenta text-white font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-3 shadow-brutal-sm">
          ROUND {roundNumber}
        </div>

        <h2 className="text-2xl md:text-3xl font-bungee text-black mb-3 leading-tight">
          PASS TO PLAYER A
        </h2>

        <p className="text-base text-gray-800 font-bold mb-6">
          Pass the laptop to <span className="text-magenta font-bungee">Player A (Doodler)</span>.
          <br />
          <span className="text-saffron">Player B, look away! 🙈</span>
        </p>

        <button
          onClick={onProceed}
          className="brutal-btn-primary w-full py-4 text-base md:text-lg flex items-center justify-center gap-2"
        >
          <UserCheck className="w-5 h-5" />
          I'M PLAYER A, SHOW ME
        </button>
      </div>
    </div>
  );
};
