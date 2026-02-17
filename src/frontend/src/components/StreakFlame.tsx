import { useEffect, useRef } from 'react';

interface StreakFlameProps {
  streak: number;
  intensityMultiplier?: number;
  size?: number;
}

export default function StreakFlame({ 
  streak, 
  intensityMultiplier = 1,
  size = 60 
}: StreakFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    let frame = 0;
    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      if (streak > 0) {
        const baseIntensity = Math.min(streak / 30, 1);
        const intensity = baseIntensity * intensityMultiplier;
        
        for (let i = 0; i < 3; i++) {
          const offset = Math.sin(frame * 0.1 + i) * 5;
          const flameHeight = size * 0.7 * intensity;
          
          const gradient = ctx.createLinearGradient(size / 2, size, size / 2, size - flameHeight);
          const alpha = Math.floor(intensityMultiplier * 255).toString(16).padStart(2, '0');
          gradient.addColorStop(0, `#ff6b00${alpha}`);
          gradient.addColorStop(0.5, `#ff9500${alpha}`);
          gradient.addColorStop(1, `#ffcc00${alpha}`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(
            size / 2 + offset,
            size * 0.8,
            size * 0.2,
            flameHeight,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      frame++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [streak, intensityMultiplier, size]);

  return (
    <div className="relative inline-block">
      <canvas ref={canvasRef} className="drop-shadow-lg" />
      {streak > 0 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-app-accent font-bold text-lg">
          {streak}
        </div>
      )}
    </div>
  );
}
