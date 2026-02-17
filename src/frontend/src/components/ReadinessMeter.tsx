import { useEffect, useRef } from 'react';
import { ReadinessScore } from '../lib/intelligence/readiness';

interface ReadinessMeterProps {
  readiness: ReadinessScore;
  size?: number;
}

export default function ReadinessMeter({ readiness, size = 140 }: ReadinessMeterProps) {
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
    const radius = size * 0.38;
    const lineWidth = size * 0.1;

    let currentProgress = 0;
    const targetProgress = readiness.score / 100;
    let animationFrame: number;

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.1;

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + currentProgress * Math.PI * 2;

      let color: string;
      if (readiness.score >= 85) color = '#00ff88';
      else if (readiness.score >= 70) color = '#00f0ff';
      else if (readiness.score >= 50) color = '#ffcc00';
      else if (readiness.score >= 30) color = '#ff9500';
      else color = '#ff4d4d';

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (Math.abs(currentProgress - targetProgress) > 0.001) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [readiness.score, size]);

  return (
    <div className="glass-card border-app-border p-6 rounded-xl">
      <h2 className="text-app-text-primary font-semibold mb-4 text-center">Readiness</h2>
      <div className="flex flex-col items-center">
        <div className="relative">
          <canvas ref={canvasRef} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-app-accent">{readiness.score}</span>
            <span className="text-xs text-app-text-secondary uppercase tracking-wider">
              {readiness.status}
            </span>
          </div>
        </div>
        <p className="text-app-text-secondary text-sm text-center mt-4">
          {readiness.recommendation}
        </p>
      </div>
    </div>
  );
}
