import { RankInfo } from '../lib/types';
import { useEffect, useRef } from 'react';

interface RankBadgeProps {
  rank: RankInfo;
  size?: 'sm' | 'md' | 'lg';
  showParticles?: boolean;
}

export default function RankBadge({ rank, size = 'md', showParticles = false }: RankBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  };

  const dimension = sizeMap[size];

  useEffect(() => {
    if (!showParticles) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimension;
    canvas.height = dimension;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
    
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: dimension / 2,
        y: dimension / 2,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
      });
    }

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, dimension, dimension);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.life > 0) {
          ctx.fillStyle = `${rank.color}${Math.floor(p.life * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [showParticles, dimension, rank.color]);

  return (
    <div className="relative inline-block" style={{ width: dimension, height: dimension }}>
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ filter: 'blur(1px)' }}
        />
      )}
      
      <div
        className="relative w-full h-full rounded-lg overflow-hidden"
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          boxShadow: `0 0 20px ${rank.color}40, inset 0 0 20px ${rank.color}20`,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${rank.metalTexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${rank.color}40 0%, transparent 50%, ${rank.color}20 100%)`,
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: size === 'sm' ? '0.6rem' : size === 'md' ? '0.8rem' : '1rem',
                color: rank.color,
                textShadow: `0 0 10px ${rank.color}`,
              }}
            >
              {rank.name}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 animate-shine"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            transform: 'translateX(-100%)',
            animation: 'shine 3s infinite',
          }}
        />
      </div>
    </div>
  );
}
