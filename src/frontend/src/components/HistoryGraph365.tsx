import { useEffect, useRef, useState } from 'react';
import { DailyStats } from '../lib/types';

interface HistoryGraph365Props {
  data: DailyStats[];
  onDayClick: (day: DailyStats) => void;
}

export default function HistoryGraph365({ data, onDayClick }: HistoryGraph365Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    setDrawProgress(0);
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDrawProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    const maxReps = Math.max(...data.map(d => d.totalReps), 1);
    const pointsToShow = Math.floor(data.length * drawProgress);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.slice(0, pointsToShow).forEach((day, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (day.totalReps / maxReps) * (height - padding * 2);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    data.slice(0, pointsToShow).forEach((day, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (day.totalReps / maxReps) * (height - padding * 2);

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#8b949e';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('365 Days', width / 2, height - 10);
  }, [data, drawProgress]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const padding = 40;

    const index = Math.round(((x - padding) / (width - padding * 2)) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

    if (data[clampedIndex]) {
      onDayClick(data[clampedIndex]);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-64 cursor-pointer"
      style={{ width: '100%', height: '256px' }}
    />
  );
}
