import { useEffect, useState } from 'react';

interface StickmanPullupRigProps {
  pullupProgress: number; // 0 to 1, where 1 is full pullup
  isAnimating: boolean;
  volume: number;
}

export default function StickmanPullupRig({ pullupProgress, isAnimating, volume }: StickmanPullupRigProps) {
  const [breatheOffset, setBreatheOffset] = useState(0);

  // Breathing animation when idle
  useEffect(() => {
    if (isAnimating) return;

    const interval = setInterval(() => {
      setBreatheOffset(prev => {
        const time = Date.now() / 1000;
        return Math.sin(time * Math.PI) * 4;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Calculate stickman position and transforms
  const barY = 40;
  const maxDrop = 180;
  const currentDrop = isAnimating ? maxDrop * (1 - pullupProgress) : maxDrop + breatheOffset;
  
  // Arm angles
  const armAngle = isAnimating ? 180 - pullupProgress * 140 : 180;
  
  // Body swing
  const swingAngle = isAnimating ? Math.sin(pullupProgress * Math.PI) * 3 : 0;
  
  // Leg motion
  const legBend = isAnimating ? pullupProgress * 15 : 0;

  // Glow effect
  const shouldGlow = volume > 0.8;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 400"
      className="absolute inset-0"
      style={{ willChange: 'transform' }}
    >
      <defs>
        <filter id="stickman-glow">
          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Pull-up bar - fixed position */}
      <line
        x1="80"
        y1={barY}
        x2="220"
        y2={barY}
        stroke="#9ca3af"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="80" cy={barY} r="8" fill="#6b7280" />
      <circle cx="220" cy={barY} r="8" fill="#6b7280" />

      {/* Stickman group - moves relative to bar */}
      <g
        transform={`translate(150, ${barY + currentDrop}) rotate(${swingAngle})`}
        style={{
          transition: isAnimating ? 'none' : 'transform 0.1s ease-out',
          filter: shouldGlow ? 'url(#stickman-glow)' : 'none',
        }}
      >
        {/* Head */}
        <circle cx="0" cy="0" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />

        {/* Body */}
        <line x1="0" y1="16" x2="0" y2="70" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />

        {/* Arms - attached to bar */}
        <g transform={`translate(0, 16)`}>
          <line
            x1="0"
            y1="0"
            x2="-30"
            y2={-currentDrop + 10}
            stroke="#e5e7eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="0"
            x2="30"
            y2={-currentDrop + 10}
            stroke="#e5e7eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Hands gripping bar */}
          <circle cx="-30" cy={-currentDrop + 10} r="5" fill="#e5e7eb" />
          <circle cx="30" cy={-currentDrop + 10} r="5" fill="#e5e7eb" />
        </g>

        {/* Legs */}
        <g transform={`translate(0, 70)`}>
          <line
            x1="0"
            y1="0"
            x2={-12 - legBend}
            y2={40 - legBend}
            stroke="#e5e7eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="0"
            x2={12 + legBend}
            y2={40 - legBend}
            stroke="#e5e7eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
