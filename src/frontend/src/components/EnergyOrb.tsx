import { useEffect, useRef } from 'react';
import { LongTermTrend } from '../lib/intelligence/longTermTrend';

interface EnergyOrbProps {
  progress: number;
  trend?: LongTermTrend;
  dimmed?: boolean;
  size?: number;
}

export default function EnergyOrb({ 
  progress, 
  trend,
  dimmed = false,
  size = 120 
}: EnergyOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.4;

    let frame = 0;
    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      const trendMultiplier = trend ? trend.velocityMultiplier : 1;
      const glowSize = baseRadius * (0.8 + trendMultiplier * 0.2);
      const pulseSpeed = trend ? 0.05 * trend.velocityMultiplier : 0.05;
      
      const dimFactor = dimmed ? 0.4 : 1;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
      gradient.addColorStop(0, `rgba(0, 240, 255, ${dimFactor})`);
      gradient.addColorStop(progress, `rgba(0, 240, 255, ${0.25 * dimFactor})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
      ctx.fill();

      const pulseRadius = glowSize * (1 + Math.sin(frame * pulseSpeed) * 0.1);
      const alpha = Math.floor(progress * 255 * dimFactor).toString(16).padStart(2, '0');
      ctx.strokeStyle = `#00f0ff${alpha}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      frame++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [progress, trend, dimmed, size]);

  return (
    <div className="relative inline-block">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-xl ${dimmed ? 'text-app-text-secondary' : 'text-app-accent'}`}>
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
