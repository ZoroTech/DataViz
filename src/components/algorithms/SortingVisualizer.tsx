import React, { useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface SortingVisualizerProps {
  array: number[];
  isSorting: boolean;
  onSort: () => void;
  algorithm: string;
}

export default function SortingVisualizer({ array, isSorting, onSort, algorithm }: SortingVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawArray(ctx);
      }
    }
  }, [array]);

  const drawArray = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (array.length === 0) return;

    const maxValue = Math.max(...array);
    const padding = 40;
    const availableWidth = canvas.width - (padding * 2);
    const availableHeight = canvas.height - (padding * 2);
    
    const barWidth = Math.min(50, (availableWidth / array.length) - 10);
    const spacing = 10;
    const scaleFactor = availableHeight / maxValue;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '14px sans-serif';

    array.forEach((value, index) => {
      const x = padding + index * (barWidth + spacing);
      const height = value * scaleFactor;
      const y = canvas.height - padding - height;

      // Draw bar
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(x, y, barWidth, height);
      
      // Draw border
      ctx.strokeStyle = '#818cf8';
      ctx.strokeRect(x, y, barWidth, height);
      
      // Draw value
      ctx.fillStyle = '#ffffff';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">{algorithm} Sort</h3>
        <button 
          onClick={onSort} 
          disabled={isSorting || array.length === 0} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSorting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isSorting ? 'Sorting...' : 'Sort'}</span>
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="bg-navy-900/50 rounded-lg w-full"
      />
    </div>
  );
}