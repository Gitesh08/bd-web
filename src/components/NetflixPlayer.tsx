"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NetflixPlayerProps {
  src: string;
  isPortrait?: boolean;
  onClose: () => void;
}

export function NetflixPlayer({ src, isPortrait, onClose }: NetflixPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  // Interactive Menus State
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Netflix hides controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  useEffect(() => {
    // Attempt fullscreen and orientation lock
    const lockOrientation = async () => {
      try {
        if (containerRef.current && containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
          await (window.screen.orientation as any).lock(isPortrait ? "portrait" : "landscape");
        }
      } catch (err) {
        // Suppress orientation lock errors (expected on desktop and iOS Safari)
      }
    };
    lockOrientation();

    return () => {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (window.screen && window.screen.orientation && (window.screen.orientation as any).unlock) {
          (window.screen.orientation as any).unlock();
        }
      } catch (e) {}
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * val;
      setProgress(val);
    }
  };

  const skip = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handlePlaybackRate = (e: React.MouseEvent, rate: number) => {
    e.stopPropagation();
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center font-sans overflow-hidden"
      onClick={() => setShowControls(!showControls)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 md:p-8 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }} 
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h3 className="text-white font-bold md:text-xl drop-shadow-md text-sm sm:text-base truncate px-2 max-w-[200px] sm:max-w-none">A Message for Hritika</h3>
              <div className="w-10 md:w-12"></div> {/* Spacer for center alignment */}
            </div>

            {/* Middle Big Controls */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 pointer-events-auto">
              <button onClick={(e) => skip(e, -10)} className="text-white/80 hover:text-white transition-colors">
                 <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 3C17.15 3 21 6.85 21 11.5S17.15 20 12.5 20c-3.74 0-7.01-2.45-8.13-5.87L6.26 13.5C7.06 15.93 9.54 18 12.5 18 16.09 18 19 15.09 19 11.5S16.09 5 12.5 5c-2.4 0-4.52 1.31-5.64 3.25l2.42.53-4.73 2.11L2 5.92l2.47.53C5.9 3.79 8.98 3 12.5 3zM11 8v5l4.25 2.52.75-1.23-3.5-2.07V8h-1.5z"/></svg>
              </button>
              <button onClick={togglePlay} className="text-white hover:scale-105 transition-transform">
                {isPlaying ? (
                  <svg className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button onClick={(e) => skip(e, 10)} className="text-white/80 hover:text-white transition-colors">
                 <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 24 24"><path d="M11.5 3C6.85 3 3 6.85 3 11.5S6.85 20 11.5 20c3.74 0 7.01-2.45 8.13-5.87l-1.89-.63C16.94 15.93 14.46 18 11.5 18 7.91 18 5 15.09 5 11.5S7.91 5 11.5 5c2.4 0 4.52 1.31 5.64 3.25l-2.42.53 4.73 2.11L22 5.92l-2.47.53C18.1 3.79 15.02 3 11.5 3zm1 5v5l4.25 2.52.75-1.23-3.5-2.07V8h-1.5z"/></svg>
              </button>
            </div>

            {/* Bottom Timeline Controls */}
            <div className="flex flex-col px-4 pb-6 md:px-10 md:pb-8 gap-4 pointer-events-auto w-full">
              <div className="flex items-center justify-between gap-3 w-full group relative">
                <span className="text-white font-medium text-xs md:text-sm drop-shadow-md w-10 text-right">{formatTime(currentTime)}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress}
                  onChange={handleSeek}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-1.5 bg-gray-500/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#E50914] [&::-webkit-slider-thumb]:rounded-full hover:h-2 transition-all"
                  style={{ background: `linear-gradient(to right, #E50914 ${progress}%, rgba(107, 114, 128, 0.5) ${progress}%)` }}
                />
                <span className="text-white font-medium text-xs md:text-sm drop-shadow-md w-10">{formatTime(duration - currentTime)}</span>
              </div>
              
              {/* Netflix Action Row */}
              <div className="flex items-center justify-between text-white/90 relative">
                <div className="flex items-center gap-4 sm:gap-6">
                  <button className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium">Episodes</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowAudioMenu(false); }}
                      className={`flex flex-col items-center gap-1 transition-colors group ${showSpeedMenu ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-medium">Speed</span>
                    </button>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowAudioMenu(!showAudioMenu); setShowSpeedMenu(false); }}
                      className={`flex flex-col items-center gap-1 transition-colors group ${showAudioMenu ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-medium">Audio & Sub</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Menu Popup */}
      <AnimatePresence>
        {showSpeedMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 md:bottom-32 right-8 md:right-16 bg-[#181818] rounded-md shadow-2xl overflow-hidden z-[1010] min-w-[150px] border border-[#404040]"
          >
            <div className="p-3 border-b border-[#333] text-white/70 text-xs font-bold uppercase tracking-wider text-center">Playback Speed</div>
            <div className="flex flex-col">
              {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                <button 
                  key={rate} 
                  onClick={(e) => handlePlaybackRate(e, rate)}
                  className={`px-6 py-3 text-sm flex items-center justify-between hover:bg-[#333] transition-colors ${playbackRate === rate ? 'text-white font-bold bg-[#222]' : 'text-gray-300'}`}
                >
                  <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                  {playbackRate === rate && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio & Subtitles Menu Popup */}
      <AnimatePresence>
        {showAudioMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 md:inset-auto md:bottom-24 md:right-12 md:w-[600px] md:h-auto bg-black/95 md:bg-[#181818] z-[1010] flex flex-col md:rounded-md shadow-2xl border-none md:border md:border-[#404040]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#333]">
              <h2 className="text-white text-lg md:text-xl font-bold">Audio & Subtitles</h2>
              <button onClick={(e) => { e.stopPropagation(); setShowAudioMenu(false); }} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex flex-row p-4 md:p-8 gap-8 md:gap-16 justify-center flex-1">
              {/* Audio Column */}
              <div className="flex flex-col flex-1 gap-4">
                <h3 className="text-gray-400 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">Audio</h3>
                <div className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span className="font-bold text-base md:text-lg">English (Original)</span>
                </div>
              </div>
              
              {/* Subtitles Column */}
              <div className="flex flex-col flex-1 gap-4">
                <h3 className="text-gray-400 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">Subtitles</h3>
                <div className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span className="font-bold text-base md:text-lg">Off</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" onClick={() => alert("Sorry, we haven't translated the members' hearts to text yet! 🖤")}>
                  <div className="w-5 h-5"></div>
                  <span className="text-base md:text-lg font-medium">English</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
