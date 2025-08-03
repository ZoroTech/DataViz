import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, StepForward, RotateCcw, Settings } from 'lucide-react';

interface AnimationControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  isPlaying: boolean;
  disabled?: boolean;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
}

export default function AnimationControls({
  onPlay,
  onPause,
  onStep,
  onReset,
  isPlaying,
  disabled = false,
  speed = 1,
  onSpeedChange
}: AnimationControlsProps) {
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(speed);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setCurrentSpeed(newSpeed);
    onSpeedChange?.(newSpeed);
  }, [onSpeedChange]);

  useEffect(() => {
    setCurrentSpeed(speed);
  }, [speed]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      <button
        onClick={onStep}
        disabled={disabled || isPlaying}
        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Step Forward"
      >
        <StepForward className="h-4 w-4" />
      </button>

      <button
        onClick={onReset}
        disabled={disabled}
        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowSpeedControls(!showSpeedControls)}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          title="Animation Speed"
        >
          <Settings className="h-4 w-4" />
        </button>

        {showSpeedControls && (
          <div className="absolute top-full mt-2 right-0 bg-navy-800 border border-indigo-500/20 rounded-lg shadow-lg p-4 z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Animation Speed</span>
                <span className="text-sm text-indigo-400">{currentSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={currentSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.25x</span>
                <span>2x</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}