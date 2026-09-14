"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PhotoLightboxProps {
  photo: {
    imgUrl: string;
    caption: string;
    date: string;
  };
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
      >
        {/* Dark overlay backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
          onClick={onClose} 
        />
        
        {/* GenZ Scrapbook Polaroid style modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30, rotate: -3 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30, rotate: 3 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="relative w-full max-w-[500px] bg-white p-4 pb-16 md:p-6 md:pb-24 rounded shadow-2xl z-10 rotate-[2deg] hover:rotate-0 transition-transform duration-500"
        >
          <button 
            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-white"
            onClick={onClose}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {/* Tape on top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/50 backdrop-blur-md -rotate-2 shadow-sm border border-black/5 z-20"></div>

          <div className="relative w-full aspect-[4/5] bg-[#f0f0f0] overflow-hidden border border-black/5">
            <Image 
              src={photo.imgUrl} 
              alt={photo.caption} 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>

          {/* Handwritten Caption */}
          <div className="absolute bottom-4 md:bottom-8 left-0 w-full text-center px-4">
            <p 
              className="text-black font-bold text-lg md:text-2xl leading-tight"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" }}
            >
              {photo.caption}
            </p>
            <p 
              className="text-gray-500 font-medium text-xs md:text-sm mt-1"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" }}
            >
              {photo.date}
            </p>
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
