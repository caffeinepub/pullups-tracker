import { useRef, useEffect, useState } from 'react';
import { useSfx } from '../hooks/useSfx';
import { useScrollLock } from '../hooks/useScrollLock';

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

  useScrollLock(isDragging);

  const itemHeight = 60; // Increased for better spacing
  const visibleItems = 3; // Exactly 3 rows
  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const currentIndex = values.indexOf(value);

  useEffect(() => {
    setOffset(-currentIndex * itemHeight);
  }, [currentIndex, itemHeight]);

  // Inertia animation
  useEffect(() => {
    if (isDragging || Math.abs(velocity) < 0.5) return;

    const animate = () => {
      setOffset(prev => {
        const newOffset = prev + velocity;
        setVelocity(v => v * 0.92); // Smooth deceleration
        return newOffset;
      });
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [velocity, isDragging]);

  // Snap to center with resistance near bounds
  useEffect(() => {
    if (isDragging) return;

    const targetIndex = Math.round(-offset / itemHeight);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, targetIndex));
    const targetOffset = -clampedIndex * itemHeight;

    // Apply resistance near bounds
    let resistance = 1;
    if (clampedIndex === 0 && targetIndex < 0) {
      resistance = 0.3;
    } else if (clampedIndex === values.length - 1 && targetIndex > values.length - 1) {
      resistance = 0.3;
    }

    if (Math.abs(offset - targetOffset) > 0.5) {
      setOffset(prev => prev + (targetOffset - prev) * 0.15 * resistance);
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
      className="relative h-[180px] overflow-hidden wheel-picker-bg rounded-xl"
      style={{ touchAction: 'none' }}
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        e.preventDefault();
        handleStart(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
    >
      {/* Top separator line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{
          top: `${itemHeight}px`,
          backgroundColor: '#374151',
        }}
      />

      {/* Bottom separator line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{
          top: `${itemHeight * 2}px`,
          backgroundColor: '#374151',
        }}
      />

      <div
        className="relative"
        style={{
          transform: `translateY(${offset + itemHeight}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {values.map((val, idx) => {
          const distanceFromCenter = Math.abs((idx * itemHeight + offset) / itemHeight);
          const isCentered = distanceFromCenter < 0.5;
          
          // Scale animation
          const scale = isCentered ? 1.15 : 0.9;
          
          // Opacity
          const opacity = isCentered ? 1 : 0.6;

          return (
            <div
              key={val}
              className="flex items-center justify-center font-bold transition-all duration-200"
              style={{
                height: `${itemHeight}px`,
                opacity,
                transform: `scale(${scale})`,
                color: isCentered ? '#22c55e' : '#6b7280',
                fontSize: isCentered ? '28px' : '18px',
                fontWeight: isCentered ? 'bold' : 'normal',
                willChange: 'transform, opacity',
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
