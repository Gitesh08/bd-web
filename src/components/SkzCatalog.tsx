"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { NetflixPlayer } from "./NetflixPlayer";
import CelebrationLogo from "./CelebrationLogo";

const EPISODES = [
  {
    id: 1,
    ep: "E1",
    title: "City of Stars",
    desc: "It started with 'La La Land'. Then, an Instagram reel appeared: Felix singing 'City of Stars' at the MBC Music Festival. That deep, mesmerizing voice changed everything.",
    img: "https://img.youtube.com/vi/WR9gzUoAjgY/maxresdefault.jpg",
    duration: "2m",
    videoEmbed: "https://www.youtube.com/embed/WR9gzUoAjgY?si=Q2YJTD0_YIfFHckv&autoplay=1"
  },
  {
    id: 2,
    ep: "E2",
    title: "The Algorithm Takes Over",
    desc: "A quick search to find the guy with the deep voice revealed he belongs to 'Stray Kids'. Suddenly, the Instagram algorithm flooded the feed with their videos. There was no going back.",
    img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Lee_Felix_zz8mxd.jpg",
    duration: "Hours",
    isInstagramUI: true
  },
  {
    id: 3,
    ep: "E3",
    title: "5-Star Michelin",
    desc: "The true turning point. 'God's Menu' plays. The line drops at 1:20: 'Cooking like a chef, I'm a five star Michelin'. That single moment hit hard. A STAY was officially born.",
    img: "https://img.youtube.com/vi/TQTlCHxyuu8/maxresdefault.jpg",
    duration: "3m",
    videoEmbed: "https://www.youtube.com/embed/TQTlCHxyuu8?si=aNBexDA13hPxyDrc&start=80&autoplay=1"
  },
  {
    id: 4,
    ep: "E4",
    title: "The Final Push",
    desc: "An old college friend, Tanvi, confirmed what was already known: Felix and Hyunjin are incredible, and their leader is just as amazing. The fandom was sealed forever.",
    img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/bang-chan_uqcw4g.jpg",
    duration: "Forever"
  }
];

const CAST = [
  { name: "Bang Chan", role: "Leader", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/bang-chan_uqcw4g.jpg" },
  { name: "Lee Know", role: "Dancer", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/lee-know_axhnie.jpg" },
  { name: "Changbin", role: "Rapper", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/Changbin_lgah2e.jpg" },
  { name: "Hyunjin", role: "Dancer", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/Hwang_Hyunjin_aajzhr.jpg" },
  { name: "Han", role: "Rapper", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Han_jisung_erenox.jpg" },
  { name: "Felix", role: "Dancer", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Lee_Felix_zz8mxd.jpg" },
  { name: "Seungmin", role: "Vocalist", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Kim_Seung_Min_kkvgbx.jpg" },
  { name: "I.N", role: "Vocalist", img: "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/I_N_kvbols.jpg" }
];

export function SkzCatalog() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Letter Modal State
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [isKorean, setIsKorean] = useState(true);

  // Netflix Fullscreen Player State
  const [showNetflixPlayer, setShowNetflixPlayer] = useState(false);

  const handlePlayVideo = async () => {
    // Request fullscreen synchronously to bypass mobile browser permission checks
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
        await (window.screen.orientation as any).lock("landscape");
      }
    } catch (e) {
      console.warn("Fullscreen/Orientation lock failed", e);
    }

    setShowNetflixPlayer(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClosePlayer = () => {
    setShowNetflixPlayer(false);
    if (videoRef.current && !isMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Force video playback and sync mute state to bypass strict browser autoplay policies
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      // If we just unmuted, we might need user interaction first, but muted autoplay should always work
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-netflix-black text-white animate-fade-in pb-20 w-full overflow-x-hidden font-sans">
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full px-4 py-4 md:px-12 md:py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent transition-all">
        <div 
          onClick={() => router.push('/browse')}
          className="cursor-pointer relative h-8 md:h-10 w-[150px] md:w-[200px] flex items-center mt-3 ml-2 md:mt-0 md:ml-0"
        >
          <CelebrationLogo />
        </div>
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          {/* Animated Letter WebM Button */}
          <motion.button 
            onClick={() => setShowLetterModal(true)}
            whileHover={{ scale: 1.1 }}
            className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer bg-transparent z-50 group mr-1 md:mr-2"
          >
            <video 
              src="/love-letter.webm" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all scale-[1.7] md:scale-[2]" 
            />
          </motion.button>

          <div 
            onClick={() => router.push('/browse')}
            className="w-8 h-8 md:w-10 md:h-10 rounded bg-netflix-gray/30 overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative flex-shrink-0"
          >
            <Image 
              src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788116547/felix-skz_pbqgti.gif" 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>
        </div>
      </header>

      {/* Video Hero */}
      <div className="relative w-full min-h-[500px] h-[85vh] flex items-end pb-12 md:pb-24 px-4 md:px-12 lg:px-24 group">
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            src="https://res.cloudinary.com/db7h39kx9/video/upload/v1788604914/stray-kids-wishing_dgheai.mp4"
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/40 to-transparent" />
        </div>

        {/* Mute/Unmute Toggle Button */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-[20%] right-4 md:right-12 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border border-white/40 transition-colors backdrop-blur-sm"
        >
          {isMuted ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>

        <div className="relative z-10 max-w-3xl pt-24 w-full pointer-events-none">
          <div className="flex items-center gap-2 mb-2 md:mb-4 pointer-events-auto">
             <span className="text-netflix-red font-bebas text-xl md:text-3xl tracking-widest drop-shadow-lg">N</span>
             <span className="text-netflix-gray text-xs md:text-sm tracking-[0.2em] uppercase font-bold drop-shadow-lg">Original</span>
          </div>
          <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] mb-2 md:mb-4 text-white drop-shadow-2xl tracking-wider leading-none">
            STRAY KIDS
          </h1>
          <div className="flex items-center gap-3 mb-4 md:mb-6 pointer-events-auto">
             <span className="text-[#46d369] font-bold text-sm md:text-base drop-shadow-md">100% Match for Hritika</span>
             <span className="text-gray-300 text-sm md:text-base drop-shadow-md">2024</span>
             <span className="border border-gray-400 text-gray-300 text-xs px-1 rounded-sm drop-shadow-md">TV-MA</span>
             <span className="text-gray-300 text-sm md:text-base drop-shadow-md">8 Members</span>
          </div>
          <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 max-w-2xl leading-relaxed hidden sm:block">
            Stray Kids has a special birthday message just for you.
          </p>
          <div className="flex gap-3 sm:gap-4 pointer-events-auto">
            <button 
              onClick={handlePlayVideo}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-lg hover:bg-white/80 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play Message
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-8 md:-mt-16 space-y-10 md:space-y-16 px-4 md:px-12 lg:px-24">
        
        {/* Episodes Row */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-white text-lg md:text-2xl font-bold">Season 1: The STAY Journey</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {EPISODES.map((ep, i) => (
              <div 
                key={ep.id} 
                className="group relative flex flex-row md:flex-col gap-4 bg-[#181818] rounded-md overflow-hidden cursor-pointer hover:bg-[#282828] transition-colors border-b border-[#404040] md:border-none p-4 md:p-0"
                onClick={() => setSelectedItem(ep)}
              >
                <div className="relative w-32 h-20 md:w-full md:h-36 flex-shrink-0 rounded md:rounded-t-md md:rounded-b-none overflow-hidden">
                  <Image src={ep.img} alt={ep.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold text-white">
                    {ep.duration}
                  </div>
                  {/* Play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-white">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1 md:p-4">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <h3 className="text-white font-bold text-sm md:text-base">{ep.ep} - {ep.title}</h3>
                  </div>
                  <p className="text-[#a3a3a3] text-xs md:text-sm line-clamp-3 md:line-clamp-none">
                    {ep.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cast Row */}
        <div>
          <h2 className="text-white text-lg md:text-2xl font-bold mb-6">Cast</h2>
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CAST.map((member, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-none snap-start">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#141414] to-[#2a2a2a] border border-[#404040] flex items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer hover:border-white transition-colors">
                  {member.img ? (
                    <Image src={member.img} alt={member.name} fill className="object-cover object-top group-hover:scale-110 transition-transform duration-500" unoptimized />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bebas text-[#666] group-hover:text-white transition-colors">{member.name[0]}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-white text-sm md:text-base font-medium">{member.name}</p>
                  <p className="text-[#808080] text-xs md:text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Netflix Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              <button 
                className="absolute top-4 right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="relative w-full h-48 sm:h-64 md:h-[400px] flex-shrink-0 bg-black">
                {selectedItem.isInstagramUI ? (
                  <InstagramExploreHero />
                ) : selectedItem.videoEmbed ? (
                  <iframe 
                    className="w-full h-full" 
                    src={selectedItem.videoEmbed} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Image src={selectedItem.img} alt={selectedItem.title} fill className="object-cover" unoptimized />
                )}
                
                {!selectedItem.videoEmbed && !selectedItem.isInstagramUI && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10 pointer-events-none">
                       <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-lg">{selectedItem.ep} - {selectedItem.title}</h2>
                    </div>
                  </>
                )}
              </div>

              <div className="p-5 md:p-10 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                   <span className="text-[#46d369] font-bold text-xs md:text-base">100% Match</span>
                   <span className="border border-gray-600 text-gray-300 text-[10px] md:text-xs px-1 rounded-sm">TV-MA</span>
                   <span className="text-xs md:text-sm text-gray-300">{selectedItem.duration}</span>
                </div>
                <p className="text-white text-sm md:text-lg leading-relaxed mb-6 font-sans font-light">
                  {selectedItem.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKZ Letter Modal */}
      <AnimatePresence>
        {showLetterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLetterModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative w-[90vw] sm:w-full max-w-[400px] md:max-w-[min(500px,calc(75vh*0.66))] aspect-[2/3] max-h-[75vh] flex flex-col items-center justify-center mt-8 mb-16"
            >
              <button 
                className="absolute -top-12 right-0 z-20 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
                onClick={() => setShowLetterModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788611419/Note_skz_1_orstxh.svg" 
                  alt="SKZ Letter" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
                
                {/* Text Overlay Area */}
                <div 
                  className="absolute top-[20%] left-[24%] right-[18%] bottom-[20%] overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  style={{ transform: 'rotate(-5deg)' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isKorean ? "korean" : "english"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-black font-medium leading-snug md:leading-relaxed text-[9px] sm:text-[10px] md:text-[10px] whitespace-pre-wrap mt-2 md:mt-4"
                      style={{ fontFamily: isKorean ? "'Malgun Gothic', sans-serif" : "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" }}
                    >
                      {/* Polaroid Picture */}
                      <div className="float-right ml-3 sm:ml-4 mr-1 md:mr-2 mb-2 w-16 sm:w-24 bg-white p-1 pb-3 sm:p-1.5 sm:pb-5 shadow-[2px_5px_12px_rgba(0,0,0,0.35)] rotate-[6deg] flex flex-col items-center justify-start relative z-10 hover:scale-105 transition-transform duration-300 border border-black/5">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-3 sm:h-4 bg-white/70 backdrop-blur-md -rotate-3 shadow-sm border border-black/5 z-20"></div>
                        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#e0e0e0]">
                          <Image src="https://res.cloudinary.com/db7h39kx9/image/upload/v1788708719/IMG_4424_r22t0p.jpg" alt="Memory" fill className="object-cover object-top" unoptimized />
                        </div>
                      </div>

                      {isKorean ? (
                        <>
                          <p className="mb-2 sm:mb-3">사랑하는 흐리티카에게,</p>
                          <p className="mb-2 sm:mb-3">25번째 생일 진심으로 축하해! 🍓👑</p>
                          <p className="mb-2 sm:mb-3">기테쉬(Gitesh)가 네가 우리를 얼마나 사랑하는지 다 말해줬어. 정말 너무 감동받았어! 기테쉬가 너의 특별한 25번째 생일을 잊지 못할 추억으로 만들어주고 싶어 했는데, 우리가 함께할 수 있어서 너무 기뻐.</p>
                          <p className="mb-2 sm:mb-3">네가 얼마나 노력하고 있는지 다 알고 있고, 우린 네가 너무 자랑스러워. 지칠 때면 우리가 항상 곁에서 응원하고 있다는 걸 기억해줘. 넌 너무 잘하고 있어 (Grow Up).</p>
                          <p className="mb-3 sm:mb-4">우리의 힘이 되어줘서 고마워. 앞으로도 오래오래 함께하자. You make Stray Kids STAY!</p>
                          <p className="mb-1">사랑을 담아, 너의 8명의 소년들이,</p>
                          <p className="font-bold">Stray Kids Everywhere All Around The World! 🖤</p>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 sm:mb-3">Dearest Hritika,</p>
                          <p className="mb-2 sm:mb-3">Happy 25th Birthday! 🍓👑</p>
                          <p className="mb-2 sm:mb-3">Gitesh told us all about how much you love us, and we are so incredibly touched. He really wanted to make this milestone birthday unforgettable for you, and we're honored to be a part of it.</p>
                          <p className="mb-2 sm:mb-3">We know how hard you've been working, and we are so proud of you. Whenever things get tough, just remember we are right here by your side. You are doing so well—never doubt yourself (Grow Up).</p>
                          <p className="mb-3 sm:mb-4">Thank you for being our strength. Let's stay together for a very long time. You make Stray Kids STAY!</p>
                          <p className="mb-1">With love, your 8 boys,</p>
                          <p className="font-bold">Stray Kids Everywhere All Around The World! 🖤</p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Translate Button */}
              <button 
                onClick={() => setIsKorean(!isKorean)}
                className="absolute -bottom-14 md:-bottom-12 z-20 flex items-center justify-center gap-2 bg-white text-black px-6 py-3 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-xs shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 15h4.498" /></svg>
                {isKorean ? "Translate to English" : "한국어로 번역하기 (Translate to Korean)"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Netflix Player */}
      {showNetflixPlayer && (
        <NetflixPlayer 
          src="https://res.cloudinary.com/db7h39kx9/video/upload/v1788604914/stray-kids-wishing_dgheai.mp4" 
          onClose={handleClosePlayer} 
        />
      )}
    </div>
  );
}


// -----------------------------
// Instagram Explore UI Component
// -----------------------------
const INSTAGRAM_PICS = [
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/bang-chan_uqcw4g.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/lee-know_axhnie.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/Changbin_lgah2e.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609592/Hwang_Hyunjin_aajzhr.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Han_jisung_erenox.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Lee_Felix_zz8mxd.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/Kim_Seung_Min_kkvgbx.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788609591/I_N_kvbols.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1788610793/LALALALA_xfkml4.jpg"
];

export function InstagramExploreHero() {
  const images = [...INSTAGRAM_PICS, ...INSTAGRAM_PICS.reverse()]; // 18 images for good height

  return (
    <div className="w-full h-full relative overflow-hidden bg-black flex gap-1 p-1">
      {/* Col 1: Up */}
      <InstaColumn images={images} duration={25} />
      
      {/* Col 2: Down */}
      <InstaColumn images={images.slice().reverse()} duration={35} reverse />
      
      {/* Col 3: Up Faster */}
      <InstaColumn images={[...images].sort(() => Math.random() - 0.5)} duration={20} />

      {/* Central IG Search Bar & Heart Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
          className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-white drop-shadow-md">
             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <span className="font-sans font-bold tracking-wide text-lg md:text-xl">#StrayKids</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30">
             <motion.svg animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></motion.svg>
             <span className="text-xs md:text-sm text-white font-medium">Following</span>
          </div>
        </motion.div>
      </div>
      
      {/* Netflix gradient overlay to blend into the modal body */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent z-0 pointer-events-none" />
    </div>
  );
}

function InstaColumn({ images, duration, reverse }: { images: string[], duration: number, reverse?: boolean }) {
  const content = (
    <>
      {images.map((src, i) => <InstaPost key={i} src={src} />)}
    </>
  );
  return (
    <div className="flex-1 h-[200%] overflow-hidden relative opacity-40 md:opacity-60">
      <motion.div 
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }} 
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="flex flex-col gap-1 absolute w-full top-0"
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
}

function InstaPost({ src }: { src: string }) {
  return (
    <div className="relative aspect-square w-full bg-[#111] rounded-sm overflow-hidden">
      <Image src={src} alt="post" fill className="object-cover" unoptimized />
      {/* Reel Icon */}
      <svg className="absolute top-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 text-white drop-shadow-md opacity-90" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12l4-3v6z"/></svg>
    </div>
  );
}
