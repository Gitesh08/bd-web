"use client";

import { useState } from "react";
import Image from "next/image";
import { Countdown } from "./Countdown";

export function Hero() {
  const [isComplete, setIsComplete] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const handleRemindMe = () => {
    setReminderSet(true);
    
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Herflix//Countdown//EN
BEGIN:VEVENT
DTSTART:20260915T000000
DTEND:20260915T235959
SUMMARY:Something Wonderful
DESCRIPTION:An exclusive worldwide premiere. We can't tell you exactly what's coming, but it's worth the wait.
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'the-big-surprise.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full min-h-screen bg-netflix-black flex flex-col selection:bg-netflix-red selection:text-white pb-12 overflow-x-hidden">
      
      {/* Top Navigation Bar - without the HERFLIX logo */}
      <header className="absolute top-0 left-0 w-full px-4 py-4 md:px-12 md:py-6 flex justify-end items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-netflix-gray/30 overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative">
          <Image 
            src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788116547/felix-skz_pbqgti.gif" 
            alt="Profile" 
            fill 
            className="object-cover" 
            unoptimized 
          />
        </div>
      </header>

      {/* Hero Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 md:px-12 lg:px-24 z-10 pt-24 max-w-[1400px] mx-auto w-full">
        <div className="animate-fade-in flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 w-full">
          
          <div className="max-w-3xl flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* N Series / Top 10 Badge */}
            <div className="flex items-center gap-3 mb-4 w-full justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="text-netflix-red font-bebas text-xl md:text-2xl tracking-widest">N</span>
                <span className="text-netflix-gray text-xs md:text-sm tracking-[0.2em] uppercase font-bold">Series</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6 w-full justify-center lg:justify-start">
              <div className="bg-netflix-red text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-sm flex items-center">
                TOP <span className="ml-1 text-[8px] md:text-[10px]">10</span>
              </div>
              <span className="text-white text-xs sm:text-sm md:text-lg font-medium drop-shadow-md">
                #1 in Movies Today
              </span>
            </div>

            {/* Title - Secretive */}
            <h1 className="font-bebas text-[4.5rem] leading-[0.9] sm:text-8xl md:text-9xl lg:text-[10rem] mb-6 text-white drop-shadow-2xl tracking-wide w-full break-words">
              SOMETHING WONDERFUL
            </h1>

            <div className="text-white text-[11px] leading-tight sm:text-sm md:text-base lg:text-xl font-medium mb-8 lg:mb-10 max-w-[85%] sm:max-w-xl lg:max-w-2xl drop-shadow-md text-netflix-light-gray mx-auto lg:mx-0">
              {isComplete 
                ? "The wait is over. A new chapter begins now."
                : "An exclusive worldwide premiere. We can't tell you exactly what's coming, but the countdown has officially begun. Stay tuned."}
            </div>

            {/* Netflix Release Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10 lg:mb-12 w-full">
              <button 
                onClick={handleRemindMe}
                className={`flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-xl transition-all duration-300 ${
                  reminderSet 
                    ? "bg-transparent text-white border border-white/40 hover:bg-white/10" 
                    : "bg-white text-black hover:bg-white/80"
                }`}
              >
                {reminderSet ? (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Reminder Set
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Remind Me
                  </>
                )}
              </button>
            </div>

            {/* Countdown Section */}
            <div className="border-t border-netflix-gray/30 pt-6 w-full flex flex-col items-center lg:items-start">
              <h3 className="text-netflix-gray font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest mb-4 sm:mb-6">
                {isComplete ? "Streaming Now" : "Releasing In"}
              </h3>
              {!isComplete && <Countdown onComplete={() => setIsComplete(true)} />}
            </div>
          </div>

          {/* Cat GIF Section */}
          <div className="mt-8 lg:mt-0 flex-shrink-0 animate-fade-in delay-300">
            <div className="relative w-[200px] h-[236px] sm:w-[250px] sm:h-[295px] md:w-[316px] md:h-[374px] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image 
                src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788115732/cat-waiting_zj3idp.gif" 
                alt="Patiently waiting"
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                unoptimized
              />
              <div className="absolute bottom-2 right-3">
                <span className="text-[10px] text-white/50 font-medium tracking-wide uppercase bg-black/40 px-2 py-1 rounded">Patiently Waiting</span>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
