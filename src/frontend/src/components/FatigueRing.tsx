import { useEffect, useRef } from 'react';

interface FatigueRingProps {
  score: number;
  size?: number;
}

export default function FatigueRing({ score, size = 100 }: FatigueRingProps) {
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
    const lineWidth = size * 0.08;

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    const progress = score / 100;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + progress * Math.PI * 2;

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#00ff88');
    gradient.addColorStop(0.5, '#ffcc00');
    gradient.addColorStop(1, '#ff4d4d');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = '#e6edf3';
    ctx.font = `bold ${size * 0.2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(score)}`, centerX, centerY);
  }, [score, size]);

  return <canvas ref={canvasRef} />;
}
