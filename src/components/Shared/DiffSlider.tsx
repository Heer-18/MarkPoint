import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  beforeLabel = 'ORIGINAL REPORT (BEFORE)',
  afterLabel = 'MUNICIPAL REPAIR (AFTER)',
  heightClass = 'h-72 sm:h-96',
  verified = true
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative w-full ${heightClass} select-none overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 cursor-ew-resize group shadow-2xl`}
    >
      {/* Background Image: AFTER Image */}
      <img
        src={afterImage}
        alt="After remediation"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* AFTER Label Tag */}
      <div className="absolute top-3 right-3 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>{afterLabel}</span>
      </div>

      {/* Foreground Image: BEFORE Image (Clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before remediation"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          draggable={false}
        />
        
        {/* BEFORE Label Tag */}
        <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>{beforeLabel}</span>
        </div>
      </div>

      {/* Draggable Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 z-30 w-1 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl text-white">
          <ChevronsLeftRight className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Slider instructions tooltip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-slate-300 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        Drag slider to compare Before & After
      </div>
    </div>
  );
};
