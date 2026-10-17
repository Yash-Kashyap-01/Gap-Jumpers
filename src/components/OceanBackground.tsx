import React from 'react';

export const OceanBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Ocean Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1945]/90 via-[#073b4c]/95 to-[#021824]" />

      {/* Underwater Caustics / Sun Rays shimmer */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300 via-transparent to-transparent animate-pulse" />

      {/* Layer 1: Flowing Water Waves */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-[200%] h-full animate-wave-flow" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path
            d="M0,150 C150,180 350,120 500,150 C650,180 850,120 1000,150 C1150,180 1350,120 1500,150 C1650,180 1850,120 2000,150 L2000,800 L0,800 Z"
            fill="rgba(0, 184, 169, 0.25)"
          />
          <path
            d="M0,350 C200,320 400,380 600,350 C800,320 1000,380 1200,350 C1400,320 1600,380 1800,350 C2000,320 2200,380 2400,350 L2400,800 L0,800 Z"
            fill="rgba(2, 62, 138, 0.3)"
          />
        </svg>
      </div>

      {/* Layer 2: Swimming Fishes (Left to Right & Right to Left) */}
      {/* Fast Clownfish / Yellow Fish - Upper Depth */}
      <div className="absolute top-[32%] -left-20 animate-swim-ltr text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🐠
      </div>
      <div className="absolute top-[48%] -left-28 animate-swim-ltr text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: '6s', animationDuration: '14s' }}>
        🐟
      </div>
      <div className="absolute top-[68%] -left-16 animate-swim-ltr text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: '11s', animationDuration: '18s' }}>
        🐡
      </div>

      {/* Reverse Swimming Coral Fish - Right to Left */}
      <div className="absolute top-[40%] -right-20 animate-swim-rtl text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: '3s', animationDuration: '17s' }}>
        🐟
      </div>
      <div className="absolute top-[60%] -right-24 animate-swim-rtl text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: '9s', animationDuration: '22s' }}>
        🐠
      </div>

      {/* Deep Sea Turtle paddling gracefully */}
      <div className="absolute top-[78%] -left-32 animate-swim-ltr text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" style={{ animationDelay: '4s', animationDuration: '28s' }}>
        🐢
      </div>

      {/* Pulsating Jellyfish in Mid-water */}
      <div className="absolute top-[52%] left-[12%] text-3xl animate-bounce opacity-70 filter drop-shadow-[0_0_8px_rgba(0,255,200,0.4)]" style={{ animationDuration: '4s' }}>
        🪼
      </div>
      <div className="absolute top-[65%] right-[14%] text-2xl animate-bounce opacity-60 filter drop-shadow-[0_0_8px_rgba(0,255,200,0.4)]" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>
        🪼
      </div>

      {/* Layer 3: Crabs scuttling along bottom corners & seabed */}
      <div className="absolute bottom-4 left-8 text-3xl animate-crab filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        🦀
      </div>
      <div className="absolute bottom-6 right-12 text-3xl animate-crab filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ animationDelay: '2s', animationDuration: '7s' }}>
        🦀
      </div>
      <div className="absolute bottom-16 left-1/4 text-2xl animate-crab filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ animationDelay: '4.5s', animationDuration: '9s' }}>
        🦀
      </div>

      {/* Sea Star on bottom seabed */}
      <div className="absolute bottom-3 left-1/3 text-xl opacity-80 rotate-12">
        ⭐
      </div>
      <div className="absolute bottom-2 right-1/3 text-xl opacity-75 -rotate-12">
        ⭐
      </div>

      {/* Layer 4: Swaying Seaweed at bottom edges */}
      <div className="absolute -bottom-2 left-2 text-4xl animate-seaweed opacity-80">
        🌿
      </div>
      <div className="absolute -bottom-2 left-6 text-3xl animate-seaweed opacity-70" style={{ animationDelay: '1s' }}>
        🌾
      </div>
      <div className="absolute -bottom-2 right-4 text-4xl animate-seaweed opacity-80" style={{ animationDelay: '1.5s' }}>
        🌿
      </div>
      <div className="absolute -bottom-2 right-8 text-3xl animate-seaweed opacity-70" style={{ animationDelay: '0.5s' }}>
        🌾
      </div>

      {/* Layer 5: Rising Air Bubbles */}
      <div className="absolute left-[15%] text-lg opacity-60 animate-bubble" style={{ animation: 'bubble-float 9s linear infinite', animationDelay: '0s' }}>
        🫧
      </div>
      <div className="absolute left-[28%] text-base opacity-50" style={{ animation: 'bubble-float 12s linear infinite', animationDelay: '3s' }}>
        🫧
      </div>
      <div className="absolute left-[48%] text-xl opacity-70" style={{ animation: 'bubble-float 8s linear infinite', animationDelay: '1.5s' }}>
        🫧
      </div>
      <div className="absolute left-[70%] text-sm opacity-60" style={{ animation: 'bubble-float 11s linear infinite', animationDelay: '4.5s' }}>
        🫧
      </div>
      <div className="absolute left-[85%] text-lg opacity-50" style={{ animation: 'bubble-float 10s linear infinite', animationDelay: '2s' }}>
        🫧
      </div>
    </div>
  );
};
