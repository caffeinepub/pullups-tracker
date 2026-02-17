import { useRef, useState, useEffect } from 'react';

interface VerticalVolumeSliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  onStepComplete: (direction: 'up' | 'down') => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function VerticalVolumeSlider({
  value,
  onChange,
  onStepComplete,
  onDragStart,
  onDragEnd,
}: VerticalVolumeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastStepRef = useRef(Math.floor(value / 2));

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    onDragStart();
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = rect.bottom - clientY;
    const percentage = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
    
    onChange(percentage);

    // Check for step completion
    const currentStep = Math.floor(percentage / 2);
    const lastStep = lastStepRef.current;
    
    if (currentStep > lastStep) {
      onStepComplete('up');
    } else if (currentStep < lastStep) {
      onStepComplete('down');
    }
    
    lastStepRef.current = currentStep;
  };

  const handleEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  useEffect(() => {
    lastStepRef.current = Math.floor(value / 2);
  }, [value]);

  const knobPosition = value;

  return (
    <div className="relative h-full flex items-center justify-center">
      <div
        ref={trackRef}
        className="relative w-16 h-[400px] rounded-[32px] overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #1f2937, #111827)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(0,0,0,0.3)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}
      >
        {/* Fill indicator */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-100"
          style={{
            height: `${knobPosition}%`,
            background: 'linear-gradient(to top, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
          }}
        />

        {/* Knob */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full cursor-grab active:cursor-grabbing"
          style={{
            bottom: `calc(${knobPosition}% - 28px)`,
            background: 'radial-gradient(circle at 30% 30%, #22c55e, #16a34a)',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: isDragging ? 'none' : 'bottom 0.1s ease-out',
            touchAction: 'none',
            willChange: 'bottom',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleStart(e.clientY);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleStart(e.touches[0].clientY);
          }}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      </div>

      {/* Global mouse/touch handlers */}
      {isDragging && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ touchAction: 'none', cursor: 'grabbing' }}
            onMouseMove={(e) => handleMove(e.clientY)}
            onMouseUp={handleEnd}
            onTouchMove={(e) => {
              e.preventDefault();
              handleMove(e.touches[0].clientY);
            }}
            onTouchEnd={handleEnd}
          />
        </>
      )}
    </div>
  );
}
