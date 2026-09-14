"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FRIENDS_PROFILE_IMAGES = [
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280671/WhatsApp_Image_2026-09-08_at_11.42.28_AM_jweirc.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280654/WhatsApp_Image_2026-09-10_at_9.35.22_PM_1_w5l0fm.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280654/WhatsApp_Image_2026-09-10_at_9.35.21_PM_xyxs6a.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280666/WhatsApp_Image_2026-09-08_at_11.38.18_AM_pdacmq.jpg",
  "https://res.cloudinary.com/db7h39kx9/image/upload/v1789280648/WhatsApp_Image_2026-09-10_at_9.35.10_PM_1_z9tknv.jpg"
];

const ProfileSliderImage = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % FRIENDS_PROFILE_IMAGES.length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {FRIENDS_PROFILE_IMAGES.map((img, i) => (
        <Image 
          key={img}
          src={img} 
          alt="Friends Profile" 
          fill 
          className={`object-cover transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`} 
          unoptimized 
        />
      ))}
    </>
  );
};

const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789408827/IMG_1735_emx9r5.heic",
  "https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789408711/IMG_9982_rqabsc.heic",
  "https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789408676/IMG_8184_v0dqcl.heic",
  "https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789408676/IMG_6831_axdoyz.heic",
  "https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789408653/IMG_0443_zgiyki.jpg"
];

const HeroBackgroundSlider = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[75%] sm:h-full -z-20">
      {BACKGROUND_IMAGES.map((img, i) => (
        <Image 
          key={img}
          src={img} 
          alt="Cinematic Background" 
          fill
          className={`object-cover object-top transition-opacity duration-[2000ms] ease-in-out ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          unoptimized 
        />
      ))}
      {/* Heavy gradient fading into black at the bottom (mobile) and dark overlay (desktop) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/60 to-[#141414] h-full w-full sm:bg-black/60 sm:via-transparent sm:to-transparent"></div>
    </div>
  );
};

export interface ProfileType {
  id: string;
  name: string;
  img: string;
  color?: string;
}

export const PROFILES: ProfileType[] = [
  { id: 'her', name: 'hritika 🍓', img: 'https://res.cloudinary.com/db7h39kx9/image/upload/v1789299805/40EF5E68-3B96-4DB4-96B9-2BB36B6C8C7B_xxqery.jpg' },
  { id: 'family', name: 'Bala', img: 'https://res.cloudinary.com/db7h39kx9/image/upload/v1789326840/balawithhritika_yz7foh.jpg' },
  { id: 'skz', name: 'SKZ ✨', img: 'https://res.cloudinary.com/db7h39kx9/image/upload/v1788116547/felix-skz_pbqgti.gif' },
  { id: 'friends', name: 'Friends 👯‍♀️', img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&q=80' },
  { id: 'boyfriend', name: 'Hathi 🌻', img: 'https://res.cloudinary.com/db7h39kx9/image/upload/f_auto,q_auto/v1789407852/IMG_8813_uull4f.heic' }
];

const NetflixSmile = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <circle cx="30" cy="40" r="4.5" fill="white" />
    <circle cx="70" cy="40" r="4.5" fill="white" />
    <path d="M 30 65 Q 50 80 70 65" stroke="white" strokeWidth="5.5" fill="transparent" strokeLinecap="round" />
  </svg>
);

interface ProfileSelectionProps {
  onSelectProfile: (profile: any) => void;
}

export function ProfileSelection({ onSelectProfile }: ProfileSelectionProps) {
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);

  const handleProfileClick = (profile: any) => {
    setLoadingProfileId(profile.id);
    setTimeout(() => {
      onSelectProfile(profile);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#141414] z-50 overflow-hidden w-full h-full"
    >
      {/* MOBILE SPECIFIC UI (Matches screenshot exactly) */}
      <div className="sm:hidden absolute inset-0 flex flex-col justify-end w-full h-full">
        <HeroBackgroundSlider />

        {/* The Curved Background Layer lifting the profiles */}
        <div className="absolute bottom-0 left-0 w-full h-[35vh] -z-10 overflow-hidden pointer-events-none">
           <div className="absolute w-[200%] h-[100vh] left-[-50%] top-0 bg-[#222222] rounded-[100%] shadow-[0_-15px_40px_rgba(0,0,0,0.5)]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full px-4 pb-[6vh] h-full justify-end">
          {/* Logo & Title Placeholder for the poster */}
          <div className="flex flex-col items-center mb-8">
            <span className="text-[#e50914] text-[10px] tracking-[0.2em] font-bold mb-1">A NETFLIX ORIGINAL</span>
            <h2 className="text-white text-3xl font-serif tracking-widest mb-4 drop-shadow-lg">OUR STORY</h2>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center bg-[#e50914] rounded-[3px] px-[4px] py-[2px] min-w-[28px] shadow-sm">
                <span className="text-white text-[6px] font-bold leading-none tracking-wider mb-[1px]">TOP</span>
                <span className="text-white text-[14px] font-bold leading-none">10</span>
              </div>
              <span className="text-white text-[13px] font-bold drop-shadow-md">#1 in My Heart Today</span>
            </div>
          </div>

          <h1 className="text-white/90 text-[14px] font-light mb-8 text-center w-full">
            Who's watching?
          </h1>
          
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 max-w-[280px] mx-auto w-full">
            {PROFILES.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center cursor-pointer w-full"
                onClick={() => handleProfileClick(profile)}
              >
                <div 
                  className="relative w-full pt-[100%] rounded-[12px] overflow-hidden mb-3 shadow-lg"
                  style={{ backgroundColor: profile.color || 'transparent' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {profile.id === 'friends' ? (
                      <ProfileSliderImage />
                    ) : profile.img ? (
                      <Image src={profile.img} alt={profile.name} fill className="object-cover" unoptimized />
                    ) : (
                      <NetflixSmile />
                    )}
                  </div>
                  
                  {loadingProfileId === profile.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <div className="w-[30%] h-[30%] border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <span className="text-[12px] font-light text-white text-center w-full leading-tight line-clamp-2 px-1">
                  {profile.name}
                </span>
              </motion.div>
            ))}

            {/* Mobile Edit Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: PROFILES.length * 0.1, duration: 0.4 }}
              className="flex flex-col items-center cursor-pointer w-full"
            >
              <div className="relative w-full pt-[100%] rounded-[12px] overflow-hidden mb-3 bg-[#333333] shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.127l-3.196 1.066a.375.375 0 01-.473-.473l1.066-3.196a4.5 4.5 0 011.127-1.89l13.37-13.37z" />
                  </svg>
                </div>
              </div>
              <span className="text-[12px] font-light text-white text-center w-full leading-tight">
                Edit
              </span>
            </motion.div>
          </div>
        </div>
      </div>
              
      {/* DESKTOP SPECIFIC UI (Standard Netflix Web) */}
      <div className="hidden sm:flex flex-col items-center justify-center w-full h-full max-w-[1920px] px-4 relative">
        <HeroBackgroundSlider />
        
        <h1 className="text-white text-[3vw] md:text-[3.5vw] font-light mb-[3%] tracking-normal text-center w-full relative z-10 drop-shadow-lg">
          Who's watching?
        </h1>
        
        <div className="flex flex-row flex-wrap justify-center items-start gap-[2vw] max-w-[80%] mx-auto relative z-10">
          {PROFILES.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center group cursor-pointer w-[12vw] md:w-[10vw] max-w-[150px] min-w-[84px]"
              onClick={() => handleProfileClick(profile)}
            >
              <div 
                className="relative w-full pt-[100%] rounded md:rounded-md overflow-hidden mb-[4%] border-[3px] border-transparent group-hover:border-white transition-all duration-300"
                style={{ backgroundColor: profile.color || 'transparent' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {profile.id === 'friends' ? (
                    <ProfileSliderImage />
                  ) : profile.img ? (
                    <Image src={profile.img} alt={profile.name} fill className="object-cover" unoptimized />
                  ) : (
                    <NetflixSmile />
                  )}
                </div>
              
                {/* Loading Overlay */}
                {loadingProfileId === profile.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="w-[30%] h-[30%] border-[3px] border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <span className={`text-[1.5vw] md:text-[1.2vw] font-light transition-colors duration-300 text-center w-full leading-tight mt-[4%] ${loadingProfileId === profile.id ? 'text-white' : 'text-[#808080] group-hover:text-white'}`}>
                {profile.name}
              </span>
            </motion.div>
          ))}
        </div>
        
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-[5%] px-[1.5em] py-[0.5em] border border-gray-500 text-gray-500 hover:border-white hover:text-white uppercase tracking-[0.2em] text-[1vw] md:text-[1.2vw] transition-colors bg-transparent"
        >
          Manage Profiles
        </motion.button>
      </div>
    </motion.div>
  );
}
