import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Undo2, Eraser, Trash2, CheckCircle } from 'lucide-react';
import type { Scenario } from '../types/game';
import { audioManager } from '../lib/audio';

interface DoodleCanvasProps {
  scenario: Scenario;
  onFinishDoodle: (dataUrl: string) => void;
}

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Orange', hex: '#EA580C' },
];

const BRUSH_SIZES = [
  { label: 'S', size: 4 },
  { label: 'M', size: 8 },
  { label: 'L', size: 16 },
];

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({
  scenario,
  onFinishDoodle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  
  // Undo history storing imageData snapshots
  const historyRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // 30-second countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const isSubmittedRef = useRef(false);
  const onFinishDoodleRef = useRef(onFinishDoodle);
  onFinishDoodleRef.current = onFinishDoodle;

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white initially
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state to history
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    setCanUndo(false);
  }, []);

  // Export helper: ensures white background, downscales to max 768px wide, returns PNG data URL
  const exportCanvasDataUrl = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    // Create offscreen canvas for export and downscaling
    const maxWidth = 768;
    const scale = canvas.width > maxWidth ? maxWidth / canvas.width : 1;
    const exportWidth = Math.round(canvas.width * scale);
    const exportHeight = Math.round(canvas.height * scale);

    const offscreen = document.createElement('canvas');
    offscreen.width = exportWidth;
    offscreen.height = exportHeight;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return canvas.toDataURL('image/png');

    // 1. Guaranteed white background
    offCtx.fillStyle = '#FFFFFF';
    offCtx.fillRect(0, 0, exportWidth, exportHeight);

    // 2. Draw scaled canvas image
    offCtx.drawImage(canvas, 0, 0, exportWidth, exportHeight);

    return offscreen.toDataURL('image/png');
  }, []);

  const handleFinish = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    const dataUrl = exportCanvasDataUrl();
    onFinishDoodleRef.current(dataUrl);
  }, [exportCanvasDataUrl]);

  const handleFinishRef = useRef(handleFinish);
  handleFinishRef.current = handleFinish;

  // Linear wall-clock countdown timer effect
  useEffect(() => {
    const durationMs = 30 * 1000;
    const endTime = Date.now() + durationMs;
    let lastPlayedTick = -1;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0 && remaining !== lastPlayedTick) {
        lastPlayedTick = remaining;
        audioManager.playTick();
      }

      if (now >= endTime || remaining <= 0) {
        clearInterval(timer);
        handleFinishRef.current();
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // Canvas drawing handlers
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#FFFFFF' : selectedColor;

    // Draw single dot in case of tap
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Record snapshot into history
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    setCanUndo(historyRef.current.length > 1);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pop current state
    historyRef.current.pop();
    const previous = historyRef.current[historyRef.current.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
    setCanUndo(historyRef.current.length > 1);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snapshot);
    setCanUndo(historyRef.current.length > 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-3">
      {/* Top Banner: Scenario tag & Timer */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="bg-marigold border-2 border-black rounded-lg px-3 py-1 shadow-brutal-sm flex items-center gap-2">
          <span className="text-lg">{scenario.emoji}</span>
          <span className="text-xs md:text-sm font-bold text-black truncate max-w-[200px] md:max-w-xs">
            {scenario.text}
          </span>
        </div>

        {/* 30s Countdown Display */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 border-3 border-black rounded-xl font-bungee text-sm md:text-base shadow-brutal-sm ${
            timeLeft <= 10
              ? 'bg-magenta text-white animate-pulse'
              : 'bg-white text-black'
          }`}
        >
          <span>⏳</span>
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative w-full aspect-[4/3] bg-white border-4 border-black rounded-2xl shadow-brutal-lg overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Toolbar: Colors, Brushes, Eraser, Undo, Clear, Finish */}
      <div className="w-full bg-cream border-3 border-black rounded-2xl p-2.5 mt-3 shadow-brutal flex flex-wrap items-center justify-between gap-2">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((col) => (
            <button
              key={col.hex}
              onClick={() => {
                setSelectedColor(col.hex);
                setIsEraser(false);
              }}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-black transition-transform ${
                !isEraser && selectedColor === col.hex
                  ? 'scale-125 ring-2 ring-black shadow-brutal-sm'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            />
          ))}
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center gap-1 bg-white p-1 border-2 border-black rounded-lg shadow-brutal-sm">
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.label}
              onClick={() => setBrushSize(b.size)}
              className={`px-2 py-0.5 rounded font-bungee text-xs ${
                brushSize === b.size ? 'bg-marigold text-black border border-black' : 'text-gray-600 hover:text-black'
              }`}
              title={`Brush ${b.label}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Actions: Eraser, Undo, Clear */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 border-2 border-black rounded-lg shadow-brutal-sm ${
              isEraser ? 'bg-magenta text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1.5 bg-white border-2 border-black rounded-lg shadow-brutal-sm text-black hover:bg-gray-100 disabled:opacity-40"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 bg-red-100 border-2 border-black rounded-lg shadow-brutal-sm text-red-600 hover:bg-red-200"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Done / Submit Button */}
        <button
          onClick={handleFinish}
          className="brutal-btn-primary px-4 py-1.5 text-xs md:text-sm flex items-center gap-1.5 ml-auto"
        >
          <CheckCircle className="w-4 h-4" />
          DONE
        </button>
      </div>
    </div>
  );
};
