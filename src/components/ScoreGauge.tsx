import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  targetScore: number;
  duration?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  targetScore,
  duration = 1200,
}) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrentScore(Math.round(easeOut * targetScore));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [targetScore, duration]);

  // Determine band info
  let bandLabel = 'COLLAPSE!';
  let bandColor = 'bg-magenta text-white';
  let bandBorder = 'border-black';
  let bandEmoji = '💥';

  if (targetScore >= 70) {
    bandLabel = 'SOLID BRIDGE!';
    bandColor = 'bg-marigold text-black';
    bandEmoji = '🌉';
  } else if (targetScore >= 30) {
    bandLabel = 'WOBBLY PLANK!';
    bandColor = 'bg-saffron text-white';
    bandEmoji = '〰️';
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Radial Gauge Container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
          {/* Background circle track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
            className="border-black"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={targetScore >= 70 ? '#FFB400' : targetScore >= 30 ? '#FF6B1A' : '#E6007E'}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-100 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center select-none">
          <span className="text-4xl font-bungee tracking-tight text-black drop-shadow-[2px_2px_0px_#fff]">
            {currentScore}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 -mt-1">
            GAP SCORE
          </span>
        </div>
      </div>

      {/* Band Label Badge */}
      <div className={`mt-3 px-4 py-1.5 border-3 ${bandBorder} rounded-xl font-bungee text-sm md:text-base shadow-brutal flex items-center gap-2 ${bandColor}`}>
        <span>{bandEmoji}</span>
        <span>{bandLabel}</span>
      </div>
    </div>
  );
};
