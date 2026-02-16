import { useEffect, useRef } from 'react';

interface EnergyOrbProps {
  progress: number;
  size?: number;
}

export default function EnergyOrb({ progress, size = 120 }: EnergyOrbProps) {
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
    const radius = size * 0.4;

    let frame = 0;
    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#00f0ff');
      gradient.addColorStop(progress, '#00f0ff40');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      const pulseRadius = radius * (1 + Math.sin(frame * 0.05) * 0.1);
      ctx.strokeStyle = `#00f0ff${Math.floor(progress * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      frame++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [progress, size]);

  return (
    <div className="relative inline-block">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-app-accent font-bold text-xl">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
