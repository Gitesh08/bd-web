import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BOYFRIEND_DATA } from "@/data/boyfriendData";
import CelebrationLogo from "./CelebrationLogo";

// --- Scratch Card Component ---
const ScratchCard = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual size in memory (scaled to account for extra pixel density)
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Fill with "scratchable" material
      ctx.fillStyle = "#2a2a2a"; // Dark scratch off material
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add "Scratch me!" text
      ctx.font = "italic 20px Georgia, serif";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scratch to reveal...", canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top
      };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current || isScratched) return;
      e.preventDefault();

      const { x, y } = getCoordinates(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Check percentage scratched (simplified - if they scratch a lot, just reveal it all)
      checkScratched(ctx, canvas);
    };

    // Throttle checkScratched for performance
    let checkTimeout: NodeJS.Timeout | null = null;
    const checkScratched = (context: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      if (checkTimeout) return;
      checkTimeout = setTimeout(() => {
        const imageData = context.getImageData(0, 0, cvs.width, cvs.height);
        let clearPixels = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] === 0) clearPixels++;
        }
        const clearPercentage = clearPixels / (cvs.width * cvs.height);
        if (clearPercentage > 0.4) {
          setIsScratched(true);
        }
        checkTimeout = null;
      }, 300);
    };

    const startPosition = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      scratch(e);
    };

    const finishedPosition = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("touchstart", startPosition, { passive: false });
    
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("touchmove", scratch, { passive: false });
    
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mouseout", finishedPosition);
    canvas.addEventListener("touchend", finishedPosition);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("touchstart", startPosition);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("mouseup", finishedPosition);
      canvas.removeEventListener("mouseout", finishedPosition);
      canvas.removeEventListener("touchend", finishedPosition);
    };
  }, [isScratched]);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm mx-auto h-[200px] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 group">
      {/* The content underneath */}
      <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center select-none">
        {children}
      </div>
      
      {/* The scratchable canvas overlay */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-1000 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
    </div>
  );
};

// --- 1. Hero Section ---
const HeroSection = ({ onOpenLetter }: { onOpenLetter: () => void }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isMuted]);

  const handlePlayVideo = () => {
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] flex items-end pb-12 md:pb-24 px-4 md:px-12 lg:px-24 group overflow-hidden">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          src={BOYFRIEND_DATA.hero.videoUrl}
          autoPlay 
          loop 
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-80"
        />
        {/* Mood gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
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

      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-all pt-6 md:pt-8 pb-6 pointer-events-auto">
        <div className="relative flex items-center justify-between px-4 md:px-12 w-full">
          {/* Logo */}
          <div
            onClick={() => router.push('/browse')}
            className="cursor-pointer relative h-8 md:h-10 w-[120px] md:w-[200px] flex items-center"
          >
            <CelebrationLogo />
          </div>

          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            {/* Animated Letter WebM Button */}
            <motion.button 
              onClick={onOpenLetter}
              whileHover={{ scale: 1.1 }}
              className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer bg-transparent z-50 group mr-1 md:mr-2"
            >
              <video 
                src="/love-letter.webm" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all scale-[1.7]" 
              />
            </motion.button>

            {/* Profile Icon */}
            <div
              onClick={() => router.push('/browse')}
              className="w-8 h-8 md:w-10 md:h-10 rounded bg-[#333] overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all relative flex-shrink-0"
            >
              <Image
                src="https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789407852/IMG_8813_uull4f.heic"
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl pt-24 w-full pointer-events-none">
        <div className="flex items-center gap-2 mb-2 md:mb-4 pointer-events-auto">
           <span className="text-[#E50914] font-bebas text-xl md:text-3xl tracking-widest drop-shadow-lg">N</span>
           <span className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase font-bold drop-shadow-lg">Original</span>
        </div>
        
        <h1 
          className="text-5xl sm:text-6xl md:text-8xl text-white mb-4 drop-shadow-2xl font-serif tracking-tight leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {BOYFRIEND_DATA.hero.title}
        </h1>

        <div className="flex items-center gap-3 mb-4 md:mb-6 pointer-events-auto">
           <span className="text-[#46d369] font-bold text-sm md:text-base drop-shadow-md">100% Match</span>
           <span className="text-gray-300 text-sm md:text-base drop-shadow-md">2024</span>
           <span className="border border-gray-400 text-gray-300 text-xs px-1 rounded-sm drop-shadow-md">LOVE</span>
        </div>
        
        <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 max-w-2xl leading-relaxed hidden sm:block">
          {BOYFRIEND_DATA.hero.subtitle}
        </p>

        <div className="flex gap-3 sm:gap-4 pointer-events-auto">
          <button 
            onClick={handlePlayVideo}
            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-lg hover:bg-white/80 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Play Message
          </button>
          
          <button 
            onClick={onOpenLetter}
            className="flex items-center justify-center gap-2 bg-gray-500/70 hover:bg-gray-500/90 text-white px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-lg transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Read Letter
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. Beautiful Photo Gallery ---
const GallerySection = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-20 md:py-32 px-4 bg-[#141414] relative z-10 flex flex-col items-center overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-serif text-white mb-24 text-center italic opacity-80">Our Favorite Moments</h2>
      
      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* The Vertical Rope (stops before the scratch card) */}
        <div className="absolute top-0 bottom-[300px] left-1/2 -translate-x-1/2 w-[3px] md:w-1 bg-[#d8b48f] opacity-80 z-0 drop-shadow-md"></div>

        {BOYFRIEND_DATA.photos.map((photo, index) => (
          <div key={photo.id} className="relative w-full flex flex-col items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="relative z-10 group"
              style={{ transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})` }}
            >
              {/* Polaroid aesthetic */}
              <div className={`bg-white p-3 pb-12 sm:p-4 sm:pb-16 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105 hover:rotate-0 hover:z-30 cursor-pointer max-w-[90vw] ${photo.isLandscape ? 'md:max-w-2xl' : 'md:max-w-md'}`}>
                <div className={`relative w-full bg-gray-200 overflow-hidden flex justify-center border border-gray-100 group/video ${photo.isLandscape ? 'aspect-[4/3] md:w-[600px]' : 'h-[50vh] md:h-[60vh] md:w-[350px]'}`}>
                  {photo.type === 'video' ? (
                    <>
                      <video 
                        src={photo.imgUrl} 
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="h-full w-full object-cover transition-all duration-700 sepia-[0.1] group-hover:sepia-0"
                      />
                      {/* Mute/Unmute Toggle */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                        className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover/video:opacity-100"
                      >
                        {isMuted ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        )}
                      </button>
                    </>
                  ) : (
                    <img 
                      src={photo.imgUrl} 
                      alt="Us" 
                      className="h-full w-full object-cover transition-all duration-700 sepia-[0.1] group-hover:sepia-0"
                    />
                  )}
                </div>
                {/* Polaroid Caption */}
                <div className="absolute bottom-2 sm:bottom-3 left-0 w-full text-center px-4">
                  <p 
                    className="text-gray-800 font-medium text-xs sm:text-sm md:text-base opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* The Red Heart on the rope between photos */}
            {index < BOYFRIEND_DATA.photos.length - 1 && (
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                className="py-12 md:py-20 relative z-20 flex justify-center items-center"
              >
                <div className="text-red-500 text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] animate-pulse">
                  ❤️
                </div>
              </motion.div>
            )}
            
          </div>
        ))}

        {/* The Final Hint (Scratch Card) */}
        <div className="relative z-20 mt-16 md:mt-24 mb-16 w-full px-4 flex justify-center">
          <ScratchCard>
            <p className="text-white/90 font-serif text-xl md:text-2xl italic leading-relaxed mb-3">
              "Stay tuned. Stay alert."
            </p>
            <p className="text-white/70 font-sans text-xs md:text-sm tracking-[0.2em] uppercase">
              Something special is coming in the morning...
            </p>
            <div className="mt-4 text-3xl animate-bounce">
              👀✨
            </div>
          </ScratchCard>
        </div>

      </div>
    </section>
  );
};

// --- 3. Letter Modal ---
const LetterModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#1a1a1a] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-white/60 font-serif italic text-lg">A Letter For You</h3>
              <button 
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Letter Content */}
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col items-center">
              {/* Hand-written letter on SVG background */}
              <div className="w-full max-w-xl relative flex justify-center shadow-2xl drop-shadow-2xl">
                <img 
                  src="/letter-gitesh.svg" 
                  alt="Blank Letter Paper" 
                  className="w-full h-auto drop-shadow-xl"
                />
                
                {/* Text overlaid on the SVG paper */}
                <div 
                  className="absolute inset-0 pt-[45%] sm:pt-[42%] pb-[25%] sm:pb-[20%] px-10 sm:px-16 md:px-20 flex flex-col items-center justify-start text-gray-900 leading-relaxed text-[11px] sm:text-[14px] md:text-lg whitespace-pre-wrap text-center overflow-hidden"
                  style={{ fontFamily: "'Dancing Script', 'Caveat', 'Comic Sans MS', cursive" }}
                >
                  {BOYFRIEND_DATA.hero.letter}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function BoyfriendCatalog() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden selection:bg-white/20">
      <HeroSection onOpenLetter={() => setIsLetterOpen(true)} />
      <GallerySection />
      
      {/* Decorative footer text */}
      <div className="pb-20 text-center text-white/30 font-serif italic text-sm">
        Happy Birthday
      </div>

      <LetterModal isOpen={isLetterOpen} onClose={() => setIsLetterOpen(false)} />
    </div>
  );
}
