import React from 'react';
import { UserCheck } from 'lucide-react';

interface CoverBScreenProps {
  roundNumber: number;
  onProceed: () => void;
}

export const CoverBScreen: React.FC<CoverBScreenProps> = ({
  roundNumber,
  onProceed,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 max-w-lg mx-auto text-center">
      <div className="brutal-card-lg p-8 w-full rotate-1">
        <div className="text-6xl mb-4">⌨️</div>

        <div className="bg-teal text-black font-bungee text-xs px-3 py-1 rounded-md border-2 border-black inline-block mb-3 shadow-brutal-sm">
          ROUND {roundNumber}
        </div>

        <h2 className="text-2xl md:text-3xl font-bungee text-black mb-3 leading-tight">
          PASS TO PLAYER B
        </h2>

        <p className="text-base text-gray-800 font-bold mb-6">
          Pass the laptop to <span className="text-teal font-bungee">Player B (Typist)</span>.
          <br />
          <span className="text-magenta">Player A, look away! Don't spoil your masterpiece!</span>
        </p>

        <button
          onClick={onProceed}
          className="brutal-btn-primary w-full py-4 text-base md:text-lg flex items-center justify-center gap-2"
        >
          <UserCheck className="w-5 h-5" />
          I'M PLAYER B, TRANSLATE!
        </button>
      </div>
    </div>
  );
};
