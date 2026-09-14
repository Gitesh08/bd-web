"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NetflixPlayer } from "./NetflixPlayer";
import CelebrationLogo from "./CelebrationLogo";
import { BALA_TIMELINE } from "@/data/friendsData";

export default function FamilyCatalog() {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<{ url: string, isPortrait?: boolean } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const balaVideoUrl = "https://res.cloudinary.com/db7h39kx9/video/upload/v1789301273/WhatsApp_Video_2026-09-11_at_7.42.19_PM_txug6b.mp4";

  // Auto play hero video logic
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = isMuted;
      heroVideoRef.current.play().catch(() => { });
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-[#141414] text-white animate-fade-in pb-20 w-full overflow-x-hidden font-sans">

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-all pt-6 md:pt-8 pb-6 pointer-events-auto">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between px-4 md:px-12 gap-6 md:gap-4">

          <div className="flex justify-between items-center w-full">
            {/* Logo */}
            <div
              onClick={() => router.push('/browse')}
              className="cursor-pointer relative h-8 md:h-10 w-[120px] md:w-[200px] flex items-center"
            >
              <CelebrationLogo />
            </div>

            {/* Profile Icon (Top Right) */}
            <div
              onClick={() => router.push('/browse')}
              className="w-8 h-8 md:w-10 md:h-10 rounded bg-[#333] overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative flex-shrink-0"
            >
              <Image
                src="https://res.cloudinary.com/db7h39kx9/image/upload/v1789326840/balawithhritika_yz7foh.jpg"
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full min-h-[500px] h-[85vh] flex items-end pb-24 md:pb-32 px-4 md:px-12 lg:px-24 group">
        <div className="absolute inset-0 z-0">
          <video
            ref={heroVideoRef}
            src={balaVideoUrl}
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent" />
          {/* Dynamic Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/40 via-emerald-900/20 opacity-40 mix-blend-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl pt-24 w-full pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2 md:mb-4 pointer-events-auto">
                <span className="text-red-600 font-black text-xl md:text-3xl tracking-widest drop-shadow-lg">N</span>
                <span className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase font-bold drop-shadow-lg">Warm Wish</span>
              </div>
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] mb-2 md:mb-4 text-white drop-shadow-2xl tracking-wider leading-none">
                BALA
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 max-w-2xl leading-relaxed">
                A heartfelt birthday message from Bala. Click to play the heartfelt wish.
              </p>
              <div className="flex gap-3 sm:gap-4 pointer-events-auto">
                <button
                  onClick={() => setSelectedVideo({ url: balaVideoUrl, isPortrait: true })}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg hover:bg-white/80 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Play Message
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center border border-white/40 transition-colors backdrop-blur-sm"
                >
                  {isMuted ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                  ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Memory Lane Timeline */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12 py-10 md:py-20 mt-4 md:mt-10 overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bebas text-center mb-16 md:mb-24 text-white tracking-wide drop-shadow-lg">The Journey</h2>

        {/* The center line */}
        <div className="absolute left-1/2 top-32 bottom-0 w-[2px] bg-gradient-to-b from-white/0 via-emerald-500/50 to-transparent -translate-x-1/2 hidden md:block"></div>

        <div className="flex flex-col gap-20 md:gap-32 relative z-10">
          {BALA_TIMELINE.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Text Content */}
                <div className={`w-full md:w-1/2 flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center md:px-12`}>
                  <div className="text-emerald-500 font-bold text-sm md:text-base tracking-[0.2em] uppercase mb-2 md:mb-3">
                    {item.year}
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-sm">
                    {item.caption}
                  </p>
                </div>

                {/* Timeline Dot (Desktop only) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#141414] border-[3px] border-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                {/* Photo */}
                <div className={`w-full md:w-1/2 flex justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} px-2 md:px-12`}>
                  <div
                    className="bg-white p-2 pb-8 sm:p-3 sm:pb-12 shadow-2xl inline-block relative transition-transform duration-500 hover:scale-105 hover:z-30 hover:rotate-0 cursor-pointer max-w-[90vw] md:max-w-none"
                    style={{ transform: `rotate(${isLeft ? '-3deg' : '3deg'})` }}
                  >
                    <div className="relative h-auto md:h-96 w-full md:w-auto bg-gray-200 overflow-hidden flex justify-center border border-gray-100">
                      <img
                        src={item.imgUrl}
                        alt={item.title}
                        className={`h-auto md:h-full max-h-[50vh] md:max-h-none w-full md:w-auto max-w-full object-contain md:object-cover transition-all duration-700 ${item.isVintage ? 'sepia-[0.3] grayscale-[0.2]' : 'saturate-110'}`}
                      />
                    </div>
                    {/* Tape piece for extra scrapbook feel */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 backdrop-blur-sm shadow-sm border border-black/5 z-20" style={{ transform: `rotate(${isLeft ? '2deg' : '-2deg'})` }}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <NetflixPlayer
            src={selectedVideo.url}
            onClose={() => setSelectedVideo(null)}
            isPortrait={selectedVideo.isPortrait}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
