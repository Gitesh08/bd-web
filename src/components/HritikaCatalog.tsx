"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { hritikaScrapbookData } from "../data/hritikaJourneyData";
import { NetflixPlayer } from "./NetflixPlayer";
import CelebrationLogo from "./CelebrationLogo";
import { useRouter } from "next/navigation";
import { Fireworks } from '@fireworks-js/react';

export function HritikaCatalog({ profile }: { profile: any }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Intro State Machine: 'calendar' -> 'fireworks' -> 'ready' (scrollable)
  const [day, setDay] = useState(12);
  const [introStage, setIntroStage] = useState<'calendar' | 'fireworks' | 'ready'>('calendar');

  // September 2001 calendar logic
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const emptyDays = Array(6).fill(null);
  const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // For the interactive thread timeline
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Custom cursor position for ambient background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Stage 1: Calendar Sequence
  useEffect(() => {
    if (introStage !== 'calendar') return;
    let currentDay = 12;
    const interval = setInterval(() => {
      if (currentDay < 15) {
        currentDay++;
        setDay(currentDay);
      } else if (currentDay === 15) {
        clearInterval(interval);
        setTimeout(() => setIntroStage('fireworks'), 600);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [introStage]);

  // Stage 2: Fireworks Timeout
  useEffect(() => {
    if (introStage === 'fireworks') {
      const t = setTimeout(() => {
        setIntroStage('ready');
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [introStage]);

  // Lock scroll until ready
  useEffect(() => {
    if (introStage !== 'ready') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [introStage]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 font-sans">
      
      {/* Intro Phase 1: Calendar */}
      <AnimatePresence>
        {introStage === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          >
            {/* Ambient Spotlight */}
            <motion.div 
              animate={{ opacity: day === 15 ? 1 : 0 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1),transparent_70%)] pointer-events-none z-10"
            />

            {/* Physical Paper Calendar */}
            <motion.div 
              initial={{ y: 50, opacity: 0, rotateZ: -2 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative z-20 bg-[#f8f9fa] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.05)] w-full max-w-sm md:max-w-md overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-12 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-50"
            >
              {/* Red Header Bar */}
              <div className="bg-[#dc2626] py-4 px-6 shadow-md relative z-10 flex justify-between items-center border-b-4 border-[#b91c1c]">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">September</h2>
                <h3 className="text-xl font-medium text-white/90">2001</h3>
                
                {/* Spiral Bind Holes */}
                <div className="absolute -top-3 left-4 w-4 h-6 bg-[#0a0a0a] rounded-full border-2 border-gray-400 shadow-inner"></div>
                <div className="absolute -top-3 right-4 w-4 h-6 bg-[#0a0a0a] rounded-full border-2 border-gray-400 shadow-inner"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#0a0a0a] rounded-full border-2 border-gray-400 shadow-inner"></div>
              </div>
              
              <div className="p-6 pb-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] relative z-0">
                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center">
                  {daysOfWeek.map((d, i) => (
                    <span key={i} className="text-gray-500 text-xs md:text-sm font-bold uppercase">{d}</span>
                  ))}
                </div>

                {/* Grid of Days */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 md:gap-4 text-center relative z-10">
                  {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10"></div>
                  ))}
                  
                  {monthDays.map((d) => (
                    <div key={d} className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mx-auto text-black">
                      {/* Realistic Red Marker Circle Animation */}
                      {day === 15 && d === 15 && (
                        <svg className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 z-0" viewBox="0 0 100 100">
                          <motion.path 
                            d="M 50,5 C 75,5 95,25 95,50 C 95,75 75,95 50,95 C 25,95 5,75 5,50 C 5,25 25,5 50,5 Z"
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="6"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ filter: 'url(#roughpaper)' }}
                          />
                          <filter id="roughpaper">
                            <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                          </filter>
                        </svg>
                      )}

                      <span className={`relative z-10 text-sm md:text-lg font-bold ${day === d ? 'text-black' : 'text-gray-600'}`}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Phase 2 & 3: Image overlay and Fireworks */}
      {(introStage === 'fireworks' || introStage === 'ready') && (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden z-40 bg-[#050505]">
          
          <AnimatePresence>
            {introStage === 'fireworks' && (
              <motion.div 
                key="fireworks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0"
              >
                <Fireworks
                  options={{
                    opacity: 1,
                    particles: 60,
                    explosion: 6,
                    intensity: 15,
                    hue: { min: 0, max: 360 },
                    delay: { min: 30, max: 60 },
                    friction: 0.95,
                    gravity: 1.5,
                  }}
                  style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Birthday Image - pinned perfectly to the bottom */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="absolute bottom-0 z-10 w-[90vw] max-w-md flex justify-center items-end"
          >
            <img 
              src="https://res.cloudinary.com/db7h39kx9/image/upload/v1789334230/Untitled_-_September_14_2026_at_02.38.46_wyi4fl.png" 
              alt="Birthday Surprise"
              className="w-full h-auto object-contain drop-shadow-2xl origin-bottom"
            />

            {/* Scroll Hint Arrow overlaid on the image, appears only when ready */}
            <AnimatePresence>
              {introStage === 'ready' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-12 flex flex-col items-center justify-center drop-shadow-lg pointer-events-none"
                >
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-white text-xs font-bold uppercase tracking-[0.2em] bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      Pull The Thread
                    </span>
                    <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Main Content / Scrapbook Thread Timeline - Only renders/accessible when ready */}
      {introStage === 'ready' && (
        <div className="relative w-full pb-48">
          
          {/* Top Navigation Bar */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-0 left-0 w-full px-4 py-4 md:px-12 md:py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent transition-all pointer-events-auto"
          >
            <div 
              onClick={() => router.push('/browse')}
              className="cursor-pointer relative h-8 md:h-10 w-[150px] md:w-[200px] flex items-center mt-3 ml-2 md:mt-0 md:ml-0"
            >
              <CelebrationLogo />
            </div>
            <div 
              onClick={() => router.push('/browse')}
              className="w-8 h-8 md:w-10 md:h-10 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative flex-shrink-0"
            >
              <img 
                src={profile.img} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.header>

          {/* Aesthetic Grain & Ambient Orbs */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[1] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat"></div>
          <motion.div 
            animate={{ x: mousePosition.x * -100, y: mousePosition.y * -100 }}
            transition={{ type: "spring", damping: 50, stiffness: 100 }}
            className="fixed top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-rose-900/10 rounded-full blur-[100px] pointer-events-none z-[1]"
          />
          
          {/* 3D Realistic Thread Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-2 -translate-x-1/2 bg-[#8B5A2B]/20 z-10 block">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-full origin-top shadow-[2px_0_8px_rgba(0,0,0,0.8)] z-10"
              style={{ 
                scaleY,
                // A textured thread look (realistic jute/string brown and cream pattern)
                backgroundImage: 'repeating-linear-gradient(45deg, #d4a373, #d4a373 3px, #faedcd 3px, #faedcd 6px)'
              }} 
            />
          </div>

          {/* The Timeline Elements */}
          <div className="relative z-20 max-w-[1200px] mx-auto px-4 pt-32 min-h-screen">
            <div className="flex flex-col gap-32 md:gap-48 pb-32">
              {hritikaScrapbookData.map((item, index) => (
                <TimelineItem 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  onPlay={() => setSelectedVideo(item)} 
                />
              ))}
            </div>
          </div>

          {/* Footer Note with Background Video */}
          <div className="relative z-10 w-full min-h-[60vh] flex flex-col items-center justify-center text-center pb-10 px-4 mt-32">
            <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
              <video 
                src="https://res.cloudinary.com/db7h39kx9/video/upload/v1788604914/stray-kids-wishing_dgheai.mp4"
                autoPlay loop muted playsInline
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5"
            >
              <p className="text-rose-100/90 text-2xl md:text-4xl font-serif leading-relaxed mb-6 drop-shadow-lg font-light italic">
                "so proud of the person you've become. you did that. happy birthday, hritika."
              </p>
              <p className="text-white/50 text-xs tracking-[0.4em] uppercase drop-shadow-md">keep going.</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Video Modal overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
          <NetflixPlayer
            src={selectedVideo.imageUrl} 
            onClose={() => setSelectedVideo(null)}
            isPortrait={selectedVideo.isPortrait}
          />
        </div>
      )}
    </div>
  );
}

// Separate component for the timeline items to handle scroll-triggered animations cleanly
function TimelineItem({ item, index, onPlay }: { item: any, index: number, onPlay: () => void }) {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={`flex flex-row w-full items-center justify-center gap-4 sm:gap-8 md:gap-16 lg:gap-32 relative ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Thread Connection Pin (Visual flair for the thread) */}
      <div className="block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-5 md:h-5 bg-[#8B5A2B] rounded-full border-2 md:border-4 border-[#faedcd] z-30 shadow-[0_0_15px_rgba(139,90,43,0.6)]"></div>
      <div className={`block absolute left-1/2 top-1/2 -translate-y-1/2 h-[2px] w-6 sm:w-16 lg:w-32 bg-[#d4a373] z-20 ${isLeft ? '-translate-x-full' : ''}`}></div>

      {/* Photo Side */}
      <div className="w-1/2 flex justify-center z-20 px-1 sm:px-0">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 0 }}
          className="relative flex flex-col group cursor-pointer w-[42vw] sm:w-[280px] md:w-[380px] translate-y-4 md:translate-y-8"
          style={{ rotate: item.rotation || (isLeft ? -4 : 4) }}
        >
          <div className="bg-[#f8f9fa] p-2 md:p-4 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-colors duration-300">
            <div className={`relative w-full overflow-hidden ${item.isPortrait ? 'aspect-[3/4] max-h-[350px] md:max-h-[450px]' : 'aspect-square md:aspect-[4/3] max-h-[250px] md:max-h-[350px]'} mb-2 md:mb-6 pointer-events-none border border-black/10`}>
              <img 
                src={item.imageUrl} 
                alt={item.title || "memory"} 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-hover:saturate-110"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* The date written like a marker on the polaroid bottom */}
            <div className="px-1 md:px-2 pb-1 md:pb-2 flex justify-between items-center text-black/60 font-serif italic text-[10px] md:text-base">
              <span>{item.date}</span>
              <span className="text-sm md:text-xl">❤️</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Text / Caption Side */}
      <div className={`w-1/2 flex flex-col justify-center px-2 md:px-0 ${isLeft ? 'items-start text-left' : 'items-end text-right'}`}>
        <motion.div 
          initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ type: "spring", damping: 20, delay: 0.2 }}
          className="max-w-[42vw] sm:max-w-xs md:max-w-md"
        >
          <h3 className="text-sm sm:text-xl md:text-3xl font-serif text-rose-200 mb-1 md:mb-4">{item.title}</h3>
          <p className="text-white/70 font-light text-[10px] sm:text-sm md:text-lg leading-tight md:leading-relaxed lowercase">
            {item.caption}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
