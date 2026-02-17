import { useEffect, useRef } from 'react';

interface GlowingRingMeterProps {
  value: number;
  label: string;
  size?: number;
  color?: string;
}

export default function GlowingRingMeter({ 
  value, 
  label, 
  size = 100,
  color = '#00f0ff'
}: GlowingRingMeterProps) {
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
    const radius = size * 0.35;
    const lineWidth = size * 0.08;

    let frame = 0;
    let currentValue = 0;
    const targetValue = value;
    let animationFrame: number;

    const animate = () => {
      currentValue += (targetValue - currentValue) * 0.08;

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      const progress = currentValue / 100;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + progress * Math.PI * 2;

      const glowIntensity = 0.5 + Math.sin(frame * 0.05) * 0.2;
      
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.shadowColor = color;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.shadowBlur = 0;

      frame++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [value, size, color]);

  return (
    <div className="text-center">
      <div className="text-app-text-secondary text-xs mb-2">{label}</div>
      <div className="relative inline-block">
        <canvas ref={canvasRef} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-app-text-primary font-bold text-lg">{Math.round(value)}</span>
        </div>
      </div>
    </div>
  );
}
