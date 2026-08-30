"use client";

import { useEffect, useState } from "react";

// September 15, 2026, 00:00:00 local time
const TARGET_DATE = new Date(2026, 8, 15, 0, 0, 0).getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (!timeLeft) return <div className="h-[72px] sm:h-24" />; // prevent layout shift

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex gap-2 sm:gap-4 md:gap-8 items-center z-10 animate-fade-in mx-auto">
      <TimeBlock value={pad(timeLeft.days)} label="Days" />
      <span className="text-xl sm:text-3xl md:text-4xl text-netflix-gray font-light mb-4 sm:mb-5 md:mb-6">:</span>
      <TimeBlock value={pad(timeLeft.hours)} label="Hours" />
      <span className="text-xl sm:text-3xl md:text-4xl text-netflix-gray font-light mb-4 sm:mb-5 md:mb-6">:</span>
      <TimeBlock value={pad(timeLeft.minutes)} label="Minutes" />
      <span className="text-xl sm:text-3xl md:text-4xl text-netflix-gray font-light mb-4 sm:mb-5 md:mb-6">:</span>
      <TimeBlock value={pad(timeLeft.seconds)} label="Seconds" />
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px] md:min-w-[80px]">
      <span className="font-bebas text-[2.5rem] leading-[1] sm:text-6xl md:text-7xl text-white tracking-wide">
        {value}
      </span>
      <span className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] text-netflix-gray font-medium">
        {label}
      </span>
    </div>
  );
}
