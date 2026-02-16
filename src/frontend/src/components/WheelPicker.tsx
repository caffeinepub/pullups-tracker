import { useRef, useEffect, useState } from 'react';
import { useSfx } from '../hooks/useSfx';

interface WheelPickerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

export default function WheelPicker({ min, max, value, onChange, step = 1 }: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [offset, setOffset] = useState(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const { play } = useSfx();
  const lastPlayedValue = useRef(value);

  const itemHeight = 50;
  const visibleItems = 5;
  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const currentIndex = values.indexOf(value);

  useEffect(() => {
    setOffset(-currentIndex * itemHeight);
  }, [currentIndex, itemHeight]);

  useEffect(() => {
    if (isDragging || Math.abs(velocity) < 0.1) return;

    const animate = () => {
      setOffset(prev => {
        const newOffset = prev + velocity;
        setVelocity(v => v * 0.95);
        return newOffset;
      });
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [velocity, isDragging]);

  useEffect(() => {
    if (isDragging) return;

    const targetIndex = Math.round(-offset / itemHeight);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, targetIndex));
    const targetOffset = -clampedIndex * itemHeight;

    if (Math.abs(offset - targetOffset) > 1) {
      setOffset(prev => prev + (targetOffset - prev) * 0.2);
    } else {
      setOffset(targetOffset);
      const newValue = values[clampedIndex];
      if (newValue !== value) {
        onChange(newValue);
        if (newValue !== lastPlayedValue.current) {
          play('wheel-tick');
          lastPlayedValue.current = newValue;
        }
      }
    }
  }, [offset, isDragging, value, onChange, values, itemHeight, play]);

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setVelocity(0);
    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = clientY - lastY.current;
    const deltaTime = Date.now() - lastTime.current;

    setOffset(prev => prev + deltaY);
    setVelocity(deltaTime > 0 ? deltaY / deltaTime * 16 : 0);

    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[250px] overflow-hidden wheel-picker-bg rounded-xl"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="absolute inset-x-0 top-1/2 h-[50px] -translate-y-1/2 border-y-2 border-app-accent pointer-events-none wheel-picker-highlight" />
      
      <div
        className="relative"
        style={{
          transform: `translateY(${offset + 125}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {values.map((val, idx) => {
          const distanceFromCenter = Math.abs(idx * itemHeight + offset);
          const opacity = Math.max(0.2, 1 - distanceFromCenter / (itemHeight * 2));
          const scale = Math.max(0.7, 1 - distanceFromCenter / (itemHeight * 3));
          const isSelected = Math.abs(idx * itemHeight + offset) < itemHeight / 2;

          return (
            <div
              key={val}
              className="flex items-center justify-center font-bold transition-all"
              style={{
                height: `${itemHeight}px`,
                opacity,
                transform: `scale(${scale})`,
                color: isSelected ? '#00f0ff' : '#6b7280',
                fontSize: isSelected ? '2rem' : '1.5rem',
              }}
            >
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
