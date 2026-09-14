"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Countdown } from "./Countdown";

export function Hero() {
  const router = useRouter();
  const [stage, setStage] = useState<'countdown' | 'celebration'>('countdown');
  const [reminderSet, setReminderSet] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showTease, setShowTease] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(false);
  const [quizOptions, setQuizOptions] = useState([
    { id: 1, original: 'Felix', name: 'Felix' },
    { id: 2, original: 'Lee Know', name: 'Lee Know' },
    { id: 3, original: 'Hyunjin', name: 'Hyunjin' },
    { id: 4, original: 'Bang Chan', name: 'Bang Chan' },
  ]);
  const [showQuizGif, setShowQuizGif] = useState(false);
  const [quizMessage, setQuizMessage] = useState("");
  const [isQuizDisabled, setIsQuizDisabled] = useState(false);
  const quizTryCountRef = useRef(0);

  const handleQuizClick = (index: number) => {
    if (isQuizDisabled) return;
    
    setIsQuizDisabled(true);
    setShowQuizGif(true);
    setQuizMessage("");
    quizTryCountRef.current += 1;
    const currentTry = quizTryCountRef.current;
    
    if (typeof window !== 'undefined') {
      const audio = new Audio('/fahhh.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    setQuizOptions(prev => {
      const newOpts = [...prev];
      newOpts[index].name = 'Gitesh';
      return newOpts;
    });
    
    setTimeout(() => {
      if (currentTry >= 2) {
        setQuizMessage("You know u can actually click on close(X) at top right to skip");
        // Leave options disabled and GIF visible
      } else {
        setShowQuizGif(false);
        setQuizMessage("okayyy sorry try again 🙃");
        setQuizOptions(prev => prev.map(opt => ({ ...opt, name: opt.original })));
        setIsQuizDisabled(false);
      }
    }, 3000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTease && clickCount === 1) {
      timer = setTimeout(() => setShowHint(true), 3000);
    } else {
      setShowHint(false);
    }
    return () => clearTimeout(timer);
  }, [showTease, clickCount]);

  const TEASES = [
    "",
    "Oops, did your finger slip? 🏃‍♀️",
    "Is your phone slow? 🐢",
    "Are you even trying? 🧐",
    "Okay okay, stop breaking the screen! 💥",
    "Fine... here you go. 🙄"
  ];

  useEffect(() => {
    if (stage === 'celebration') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, colors: ['#E50914', '#ffffff', '#46d369', '#3b82f6', '#facc15'] };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0 || stage !== 'celebration') {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [stage]);

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

  const handleCountdownComplete = () => {
    setStage('celebration');
  };

  const handlePlayClick = (e: any) => {
    if (showTease) return; 
    
    if (clickCount < 4) { // Reduced max clicks to 4
      setClickCount(prev => prev + 1);
      setShowTease(true);
      
      // The runaway button mechanic! (Dodges the click)
      if (typeof window !== 'undefined') {
        const randomX = (Math.random() - 0.5) * (window.innerWidth * 0.6);
        const randomY = (Math.random() - 0.5) * (window.innerHeight * 0.5);
        setBtnPos({ x: randomX, y: randomY });
      }
      
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      
      // Removed the setTimeout so it stays on screen until she clicks!
    } else if (clickCount === 4) {
      setClickCount(5);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { x, y },
        zIndex: 200,
        colors: ['#E50914', '#ffffff', '#46d369', '#3b82f6', '#facc15']
      });
      
      setTimeout(() => {
        localStorage.setItem('surprise_unlocked', 'true');
        router.push('/browse');
      }, 1000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-netflix-black flex flex-col selection:bg-netflix-red selection:text-white overflow-hidden">
      
      <AnimatePresence mode="wait">
        {stage === 'celebration' ? (
          <motion.div 
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#141414]"
          >
            {/* Cinematic subtle vignette background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            
            <motion.div 
              className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-4xl"
            >
              <h1 className="font-bebas text-[4.5rem] leading-[0.85] sm:text-8xl md:text-[10rem] text-[#E50914] drop-shadow-[0_0_40px_rgba(229,9,20,0.4)] tracking-wide flex flex-col items-center gap-2 mb-6">
                <div className="flex">
                  {"HAPPY".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)", y: 20 }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="flex">
                  {"BIRTHDAY".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)", y: 20 }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ delay: (5 + index) * 0.1, duration: 0.8, ease: "easeOut" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-white/80 text-[15px] sm:text-lg md:text-2xl font-light tracking-wide max-w-md md:max-w-2xl mb-12 leading-relaxed px-4"
              >
                Welcome to your exclusive premiere. <br className="hidden sm:block" /> I made this just for you.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="mt-2"
              >
                <motion.button
                  animate={{ 
                    x: btnPos.x,
                    y: btnPos.y,
                    scale: 1 
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  onClick={handlePlayClick}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 sm:px-8 sm:py-3 rounded md:rounded-md font-bold text-[14px] sm:text-lg hover:bg-white/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] whitespace-nowrap w-auto mx-auto"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  {clickCount === 0 && "Play"}
                  {clickCount === 1 && "Try Again"}
                  {clickCount === 2 && "Press Harder"}
                  {clickCount === 3 && "Are you trying?"}
                  {clickCount === 4 && "Fine, One More!"}
                  {clickCount >= 5 && "Loading..."}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Chaotic Tease Overlays - A different gag for every click! */}
            <AnimatePresence>
              {showTease && clickCount === 1 && (
                <motion.div
                  onClick={() => setShowTease(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-4 cursor-pointer"
                >
                  {showHint && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-10 w-full text-center"
                    >
                      <span className="text-white/60 text-xs font-light tracking-widest">
                        tap on screen yaar hritikaaa to continue
                      </span>
                    </motion.div>
                  )}
                  <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h2 className="text-2xl font-bold text-white text-center">Buffering your reflexes... 🐌</h2>
                </motion.div>
              )}

              {showTease && clickCount === 2 && (
                <motion.div
                  onClick={() => setShowTease(false)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 cursor-pointer"
                >
                  <div className="bg-[#1c1c1e] w-full max-w-[270px] rounded-[14px] flex flex-col items-center pt-5 overflow-hidden shadow-2xl border border-white/10 pointer-events-auto">
                    <h3 className="text-white font-bold text-[17px] mb-1">System Alert</h3>
                    <p className="text-white/80 text-[13px] text-center px-4 mb-4 leading-snug">Your phone has detected unusually slow tapping. Please wake up and try again.</p>
                    <div className="w-full border-t border-white/10">
                      <div className="text-[#0a84ff] font-bold text-[17px] py-3 text-center w-full bg-transparent">Dismiss</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {showTease && clickCount === 3 && (
                <motion.div
                  onClick={() => setShowTease(false)}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute top-0 left-0 w-full z-[100] bg-[#E50914] p-4 shadow-2xl flex flex-col items-center justify-center cursor-pointer h-[15vh]"
                >
                  <h2 className="text-sm sm:text-lg font-bold text-white text-center mb-2">Error H-7111: Tapping skills too weak. 🛑</h2>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="text-white/80 text-[11px] sm:text-sm font-medium tracking-wide"
                  >
                    Still trying? How cute. 🤭
                  </motion.span>
                </motion.div>
              )}

              {showTease && clickCount === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
                >
                  <div className="flex flex-col items-center w-full max-w-sm bg-[#141414] rounded-2xl p-5 relative border border-white/10 shadow-[0_0_50px_rgba(229,9,20,0.2)]">
                    <button onClick={() => setShowTease(false)} className="absolute top-3 right-3 text-white/40 hover:text-white p-2">✕</button>
                    
                    <h2 className="text-xl font-bold text-white mb-2 text-center tracking-wide mt-2">Choose your boyfriend:</h2>
                    
                    <div className="min-h-[40px] flex items-center justify-center w-full mb-3 px-2">
                      {quizMessage && (
                        <p className="text-[#E50914] text-xs sm:text-sm font-bold text-center animate-pulse leading-snug">{quizMessage}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 w-full mb-5 px-1">
                      {quizOptions.map((opt, i) => (
                        <button 
                          key={opt.id}
                          onClick={() => handleQuizClick(i)}
                          disabled={isQuizDisabled}
                          className={`w-full py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 ${opt.name === 'Gitesh' ? 'bg-[#E50914] text-white scale-105 shadow-[0_0_15px_rgba(229,9,20,0.4)] z-10 relative' : 'bg-[#222] text-white hover:bg-white/20'} ${isQuizDisabled && opt.name !== 'Gitesh' ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                    
                    {showQuizGif ? (
                      <img 
                        src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788466280/stray-kids-stray-kids-felix_gcif5x.gif" 
                        alt="Laughing Felix" 
                        className="w-32 rounded-xl border border-white/10" 
                      />
                    ) : (
                      <div className="w-32 h-[128px]"></div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : stage === 'countdown' ? (
          <motion.div 
            key="countdown"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="relative w-full flex-1 flex flex-col justify-center px-4 md:px-12 lg:px-24 z-10 pt-24 pb-12 max-w-[1400px] mx-auto"
          >
            {/* Top Navigation Bar */}
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

            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 w-full">
              
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

                {/* Title */}
                <h1 className="font-bebas text-[4.5rem] leading-[0.9] sm:text-8xl md:text-9xl lg:text-[10rem] mb-6 text-white drop-shadow-2xl tracking-wide w-full break-words">
                  SOMETHING WONDERFUL
                </h1>

                <div className="text-white text-[11px] leading-tight sm:text-sm md:text-base lg:text-xl font-medium mb-8 lg:mb-10 max-w-[85%] sm:max-w-xl lg:max-w-2xl drop-shadow-md text-netflix-light-gray mx-auto lg:mx-0">
                  An exclusive worldwide premiere. We can't tell you exactly what's coming, but the countdown has officially begun. Stay tuned.
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
                    Releasing In
                  </h3>
                  <Countdown onComplete={handleCountdownComplete} />
                </div>
              </div>

              {/* Cat GIF Section */}
              <div className="mt-8 lg:mt-0 flex-shrink-0">
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
