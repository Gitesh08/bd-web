"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FireworkBurst({ delay, color, top, left }: { delay: number, color: string, top: string, left: string }) {
  return (
    <div className="absolute z-0" style={{ top, left }}>
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const distance = 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1.2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeOut" }}
            className={`absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${color}`}
          />
        );
      })}
    </div>
  );
}

export default function CelebrationLogo() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 0 ? (
          <motion.div
            key="25"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="flex items-center justify-center relative w-16 md:w-20"
          >
            {/* Fireworks */}
            <FireworkBurst delay={0} color="bg-red-500" top="-10px" left="0px" />
            <FireworkBurst delay={0.4} color="bg-yellow-400" top="10px" left="40px" />
            <FireworkBurst delay={0.8} color="bg-blue-400" top="30px" left="-5px" />
            
            {/* Sparkles */}
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="absolute -left-3 -top-2 text-yellow-400 text-sm md:text-base drop-shadow-md z-10"
            >✨</motion.span>
            
            {/* Core Logo 25 */}
            <span className="font-bebas text-4xl md:text-5xl tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] relative z-10">
              25
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="hritika"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="flex items-center relative"
          >
            {/* Floating Crown */}
            <motion.span 
              animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-5 -left-2 text-xl md:text-2xl drop-shadow-lg z-10"
            >
              👑
            </motion.span>
            
            {/* Floating Balloon */}
            <motion.span
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -right-4 -top-3 text-lg md:text-xl drop-shadow-lg z-10"
            >
              🎈
            </motion.span>

            {/* Core Name with gold gradient */}
            <span className="font-bebas text-3xl md:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">
              HRITIKA
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
