import { useState, useCallback, useRef, useEffect } from 'react';

interface AnimationStep {
  execute: () => void;
  reverse?: () => void;
}

export default function useAnimation(initialSpeed = 1) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(initialSpeed);
  const stepsRef = useRef<AnimationStep[]>([]);
  const timeoutRef = useRef<number>();

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    clear();
  }, [clear]);

  const addStep = useCallback((step: AnimationStep) => {
    stepsRef.current.push(step);
  }, []);

  const clearSteps = useCallback(() => {
    stepsRef.current = [];
    reset();
  }, [reset]);

  const executeStep = useCallback((step: number) => {
    if (step >= 0 && step < stepsRef.current.length) {
      stepsRef.current[step].execute();
      setCurrentStep(step);
    }
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < stepsRef.current.length - 1) {
      executeStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, executeStep]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0 && stepsRef.current[currentStep].reverse) {
      stepsRef.current[currentStep].reverse!();
      executeStep(currentStep - 1);
    }
  }, [currentStep, executeStep]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clear();
  }, [clear]);

  useEffect(() => {
    if (isPlaying && currentStep < stepsRef.current.length - 1) {
      timeoutRef.current = window.setTimeout(() => {
        stepForward();
      }, 1000 / speed);
    } else if (currentStep >= stepsRef.current.length - 1) {
      setIsPlaying(false);
    }

    return () => clear();
  }, [isPlaying, currentStep, speed, stepForward, clear]);

  return {
    isPlaying,
    currentStep,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    addStep,
    clearSteps,
    totalSteps: stepsRef.current.length
  };
}