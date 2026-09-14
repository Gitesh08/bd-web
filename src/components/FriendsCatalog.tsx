"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NetflixPlayer } from "./NetflixPlayer";
import { PhotoLightbox } from "./PhotoLightbox";
import { FRIENDS_DATA } from "@/data/friendsData";
import CelebrationLogo from "./CelebrationLogo";

const PROFILE_IMAGES = [
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280671/WhatsApp_Image_2026-09-08_at_11.42.28_AM_jweirc.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280654/WhatsApp_Image_2026-09-10_at_9.35.22_PM_1_w5l0fm.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280654/WhatsApp_Image_2026-09-10_at_9.35.21_PM_xyxs6a.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280666/WhatsApp_Image_2026-09-08_at_11.38.18_AM_pdacmq.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280648/WhatsApp_Image_2026-09-10_at_9.35.10_PM_1_z9tknv.jpg"
];

function ProfileSlider({ onClick }: { onClick: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % PROFILE_IMAGES.length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onClick={onClick}
      className="w-8 h-8 md:w-10 md:h-10 rounded bg-[#333] overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative flex-shrink-0"
    >
      {PROFILE_IMAGES.map((img, i) => (
        <Image 
          key={img}
          src={img} 
          alt="Profile" 
          fill 
          className={`object-cover transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`} 
          unoptimized 
        />
      ))}
    </div>
  );
}

export default function FriendsCatalog() {
  const router = useRouter();
  const [activeFriendId, setActiveFriendId] = useState<keyof typeof FRIENDS_DATA>("sneha");
  const [selectedVideo, setSelectedVideo] = useState<{url: string, isPortrait?: boolean} | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const activeFriend = FRIENDS_DATA[activeFriendId];
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Auto play hero video logic
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = isMuted;
      heroVideoRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-[#141414] text-white animate-fade-in pb-20 w-full overflow-x-hidden font-sans">
      
      {/* Top Navigation Bar & Friend Selector */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-all pt-6 md:pt-8 pb-6 pointer-events-auto">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between px-4 md:px-12 gap-6 md:gap-4">
          
          <div className="flex justify-between items-center w-full md:w-auto">
            {/* Logo */}
            <div 
              onClick={() => router.push('/browse')}
              className="cursor-pointer relative h-8 md:h-10 w-[120px] md:w-[200px] flex items-center"
            >
              <CelebrationLogo />
            </div>

            {/* Profile Slider (Mobile) */}
            <div className="md:hidden">
              <ProfileSlider onClick={() => router.push('/browse')} />
            </div>
          </div>
          
          {/* Friend Selector (Instagram Stories style - Left) */}
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x py-4 px-3 w-full md:w-auto justify-start md:flex-1 md:ml-6 mt-2 md:mt-0">
            {Object.values(FRIENDS_DATA).map((friend) => (
              <div 
                key={friend.id}
                onClick={() => setActiveFriendId(friend.id as any)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group snap-start"
              >
                <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full p-[3px] transition-all duration-300 ${activeFriendId === friend.id ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-110' : 'bg-gray-700 hover:bg-gray-400'}`}>
                  <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative bg-[#141414]">
                    <Image src={friend.avatar} alt={friend.name} fill className="object-cover" unoptimized />
                  </div>
                </div>
                <span className={`text-[10px] md:text-xs font-bold transition-colors ${activeFriendId === friend.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {friend.name}
                </span>
              </div>
            ))}
          </div>

          {/* Profile Slider (Desktop) */}
          <div className="hidden md:block flex-shrink-0">
            <ProfileSlider onClick={() => router.push('/browse')} />
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full min-h-[500px] h-[85vh] flex items-end pb-24 md:pb-32 px-4 md:px-12 lg:px-24 group">
        <div className="absolute inset-0 z-0">
          <video 
            ref={heroVideoRef}
            key={activeFriend.id + "-bg"}
            src={activeFriend.warmWish.videoUrl}
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent" />
          {/* Dynamic Color Overlay based on selected friend */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${activeFriend.color} opacity-40 transition-colors duration-1000 mix-blend-overlay`} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl pt-24 w-full pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFriend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2 md:mb-4 pointer-events-auto">
                <span className="text-red-600 font-black text-xl md:text-3xl tracking-widest drop-shadow-lg">N</span>
                <span className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase font-bold drop-shadow-lg">Warm Wish</span>
              </div>
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] mb-2 md:mb-4 text-white drop-shadow-2xl tracking-wider leading-none">
                {activeFriend.name.toUpperCase()}
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 max-w-2xl leading-relaxed">
                A heartfelt birthday message from {activeFriend.name}. Click to play the heartfelt wish.
              </p>
              <div className="flex gap-3 sm:gap-4 pointer-events-auto">
                <button 
                  onClick={() => setSelectedVideo({ url: activeFriend.warmWish.videoUrl, isPortrait: true })}
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

      {/* Content Sections */}
      <div className="px-4 md:px-12 lg:px-24 -mt-4 md:-mt-12 relative z-20 flex flex-col gap-12 md:gap-20">

        {/* Unforgettable Moments Row (Vertical Reels style) */}
        {activeFriend.moments && activeFriend.moments.length > 0 && (
          <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFriend.id + "-moments"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-white text-lg md:text-2xl font-bold mb-4 md:mb-6 px-2">{activeFriend.name}'s Unforgettable Moments</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 pt-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {activeFriend.moments.map((moment) => (
                  <motion.div 
                    key={moment.id} 
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group relative flex flex-col w-36 md:w-48 flex-none snap-start bg-[#181818] rounded-md overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300"
                    onClick={() => setSelectedVideo({ url: moment.videoUrl, isPortrait: true })}
                  >
                    <div className="relative w-full aspect-[9/16] flex-shrink-0 bg-black">
                      <Image src={moment.thumbnail} alt={moment.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />
                      
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      
                      {/* Title & Duration */}
                      <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col gap-1">
                        <h3 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md">{moment.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-red-500 fill-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                          <span className="text-gray-300 text-xs font-medium">{moment.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        )}

        {/* Photos Row (GenZ Scrapbook style) */}
        <div className="mb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFriend.id + "-photos"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-white text-lg md:text-2xl font-bold mb-4 md:mb-6 px-2">{activeFriend.name}'s Core Memories</h2>
            <div className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar py-8 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center">
              {activeFriend.photos.map((photo: any, i: number) => (
                <motion.div 
                  key={photo.id} 
                  whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 2 : -2, zIndex: 30 }}
                  initial={{ rotate: i % 2 === 0 ? -4 : 4 }}
                  className="group relative flex-none snap-start cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* Polaroid Frame */}
                  <div className="bg-white p-2 pb-7 sm:p-3 sm:pb-10 shadow-xl border border-gray-200 inline-block relative">
                    <div className="relative h-40 sm:h-56 md:h-72 w-auto bg-gray-200 overflow-hidden flex justify-center">
                      <img 
                        src={photo.imgUrl} 
                        alt={photo.title} 
                        className="h-full w-auto max-w-none object-cover sepia-[0.2] group-hover:sepia-0 transition-all duration-500" 
                      />
                    </div>
                    
                    {/* Handwritten small caption */}
                    <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-0 w-full text-center px-2">
                      <p 
                        className="text-gray-800 font-bold text-[10px] sm:text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" }}
                      >
                        {photo.date}
                      </p>
                    </div>
                    
                    {/* Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4 sm:h-5 bg-white/40 backdrop-blur-sm shadow-sm border border-black/5 z-20" style={{ transform: `rotate(${i % 2 === 0 ? '3deg' : '-3deg'})` }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Netflix Video Player Overlay */}
      {selectedVideo && (
        <NetflixPlayer 
          src={selectedVideo.url} 
          isPortrait={selectedVideo.isPortrait}
          onClose={() => setSelectedVideo(null)} 
        />
      )}

      {/* Photo Lightbox Overlay */}
      {selectedPhoto && (
        <PhotoLightbox 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}

    </div>
  );
}
