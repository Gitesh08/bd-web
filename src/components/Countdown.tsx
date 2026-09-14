"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

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
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Exactly 15th Sept 2026, 12:00:00 AM (midnight)
    setTargetDate(new Date(2026, 8, 15, 0, 0, 0).getTime());
  }, []);

  useEffect(() => {
    if (!targetDate || hasCompleted.current) return;

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          
          // Fire confetti for 3 seconds so the user can enjoy the 00s
          const duration = 3 * 1000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 7,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#E50914', '#ffffff', '#facc15', '#ec4899']
            });
            confetti({
              particleCount: 7,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#E50914', '#ffffff', '#facc15', '#ec4899']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            } else {
              // After confetti finishes, trigger the next stage
              setTimeout(onComplete, 500);
            }
          };
          frame();
        }
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
  }, [targetDate, onComplete]);

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
