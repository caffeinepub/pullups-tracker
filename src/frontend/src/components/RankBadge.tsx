import { RankInfo } from '../lib/types';
import { useState } from 'react';
import { useSfx } from '../hooks/useSfx';

interface RankBadgeProps {
  rank: RankInfo;
  size?: number;
  isPromoting?: boolean;
}

export default function RankBadge({ rank, size = 240, isPromoting = false }: RankBadgeProps) {
  const [isTapped, setIsTapped] = useState(false);
  const { play } = useSfx();

  const handleTap = () => {
    setIsTapped(true);
    play('tick-soft');
    setTimeout(() => setIsTapped(false), 400);
  };

  const hexagonPath = `
    M ${size * 0.5} ${size * 0.067}
    L ${size * 0.933} ${size * 0.25}
    L ${size * 0.933} ${size * 0.75}
    L ${size * 0.5} ${size * 0.933}
    L ${size * 0.067} ${size * 0.75}
    L ${size * 0.067} ${size * 0.25}
    Z
  `;

  const fontSize = size * 0.175;

  return (
    <div
      className="relative inline-block cursor-pointer select-none"
      style={{ width: size, height: size }}
      onClick={handleTap}
    >
      {/* Ambient aura layer */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-rank-pulse"
        style={{
          width: size * 1.417,
          height: size * 1.417,
          background: `radial-gradient(circle, ${rank.auraColor}33 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* External shadow for floating effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.8))',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`${isPromoting ? 'animate-rank-promotion' : 'animate-rank-breathe'} ${isTapped ? 'animate-rank-tap' : ''}`}
        >
          {/* Outer glow outline */}
          <path
            d={hexagonPath}
            fill="none"
            stroke={rank.auraColor}
            strokeWidth={3}
            opacity={0.4}
            filter="url(#glow)"
            className="animate-rank-pulse"
          />

          {/* Inner solid outline */}
          <path
            d={hexagonPath}
            fill="none"
            stroke={rank.color}
            strokeWidth={3}
          />

          {/* Inner gradient fill */}
          <defs>
            <linearGradient id={`gradient-${rank.tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={rank.color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={rank.color} stopOpacity={0.08} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="inset-shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="12.5" />
              <feOffset dx="0" dy="6" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.6" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={hexagonPath}
            fill={`url(#gradient-${rank.tier})`}
            filter="url(#inset-shadow)"
          />

          {/* Holographic sweep */}
          <path
            d={hexagonPath}
            fill="url(#sweep-gradient)"
            opacity={0.08}
            className="animate-holographic-sweep"
          />

          <defs>
            <linearGradient id="sweep-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="white" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Rank text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold uppercase tracking-wider pointer-events-none"
        style={{
          fontSize: `${fontSize}px`,
          color: '#ffffff',
          textShadow: `0 0 12px ${rank.color}cc, 0 0 24px ${rank.color}66`,
          fontFamily: "'Orbitron', 'Exo 2', sans-serif",
        }}
      >
        {rank.name}
      </div>
    </div>
  );
}
