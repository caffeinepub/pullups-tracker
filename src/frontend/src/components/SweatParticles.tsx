import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface SweatParticlesProps {
  isActive: boolean;
  originX: number;
  originY: number;
}

export default function SweatParticles({ isActive, originX, originY }: SweatParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles
      if (timestamp - lastSpawnRef.current > 100) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push({
            x: originX + (Math.random() - 0.5) * 20,
            y: originY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 1,
            maxLife: Math.random() * 0.5 + 0.5,
          });
        }
        lastSpawnRef.current = timestamp;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.life -= 0.02;

        if (particle.life <= 0) return false;

        const opacity = particle.life * 0.4;
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Keep max 30 particles
      if (particlesRef.current.length > 30) {
        particlesRef.current = particlesRef.current.slice(-30);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, originX, originY]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={400}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
