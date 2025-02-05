"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function CircularProgress({
  size = 24,
  strokeWidth = 2,
  className,
  duration = 10000,
  onComplete,
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      const remaining = Math.max(Math.ceil((duration - elapsed) / 1000), 0);

      setProgress(newProgress);
      setTimeLeft(remaining);

      if (newProgress >= 1) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-100 ease-linear"
        />
      </svg>
      <span className="absolute text-[10px] font-medium">{timeLeft}s</span>
    </div>
  );
}
