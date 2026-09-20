import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DiffSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  heightClass?: string;
  verified?: boolean;
}

export const DiffSlider: React.FC<DiffSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER (FIXED)',
  heightClass = 'h-56 sm:h-64',
  verified = true
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full ${heightClass} select-none overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 cursor-ew-resize group shadow-2xl touch-none`}
      style={{ touchAction: 'none' }}
    >
      {/* 1. Base Layer: AFTER Image (Full Size, Fixed) */}
      <img
        src={afterImage}
        alt="After repair"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* 2. Top Layer: BEFORE Image (Full Size, Clipped via clip-path) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <img
          src={beforeImage}
          alt="Before repair"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* 3. Static Top Badges (Never cut off or squished) */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md pointer-events-none shadow-lg">
        <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
        <span>{beforeLabel}</span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md pointer-events-none shadow-lg">
        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
        <span>{afterLabel}</span>
      </div>

      {/* 4. Draggable Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-2xl text-white">
          <ChevronsLeftRight className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* 5. Tooltip at bottom */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-slate-300 pointer-events-none shadow-md">
        Drag slider to compare Before & After
      </div>
    </div>
  );
};
