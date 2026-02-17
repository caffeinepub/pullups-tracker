import { useEffect, useRef, useState } from 'react';
import { calculateLifetimeStrengthCurve } from '../lib/intelligence/lifetimeStrengthCurve';
import { PullupSession } from '../lib/types';

interface HistoryGraphLifetimeProps {
  sessions: PullupSession[];
}

export default function HistoryGraphLifetime({ sessions }: HistoryGraphLifetimeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setAnimationProgress(0);
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [sessions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const curveData = calculateLifetimeStrengthCurve(sessions);
    
    if (curveData.length === 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data yet', width / 2, height / 2);
      return;
    }

    const maxValue = Math.max(...curveData.map(p => p.rollingMax), 1);
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    const visiblePoints = Math.floor(curveData.length * animationProgress);
    if (visiblePoints < 2) return;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00f0ff');
    gradient.addColorStop(1, '#00ff88');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i < visiblePoints; i++) {
      const x = padding + (i / (curveData.length - 1)) * graphWidth;
      const y = height - padding - (curveData[i].rollingMax / maxValue) * graphHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('0', 5, height - padding + 5);
    ctx.textAlign = 'right';
    ctx.fillText(maxValue.toString(), padding - 5, padding + 5);

  }, [sessions, animationProgress]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full" style={{ height: '200px' }} />
    </div>
  );
}
