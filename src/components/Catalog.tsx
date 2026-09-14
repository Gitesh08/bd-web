"use client";

import { useState } from "react";
import Image from "next/image";

// Placeholder data - replace with your real memories
const CATEGORIES = [
  {
    title: "Season 1: How We Met",
    items: [
      { id: 1, title: "The First Glance", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80", desc: "I still remember what you were wearing..." },
      { id: 2, title: "Our First Date", img: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=500&q=80", desc: "Nervous laughs and endless conversations that lasted until 3 AM." },
      { id: 3, title: "The First Kiss", img: "https://images.unsplash.com/photo-1621252179027-94459d278660?w=500&q=80", desc: "Time stood still. It felt exactly like a movie scene." },
    ]
  },
  {
    title: "Top Picks For You: Best Adventures",
    items: [
      { id: 4, title: "That One Road Trip", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80", desc: "Singing terribly in the car for 4 hours straight and getting lost twice." },
      { id: 5, title: "Lost in the City", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&q=80", desc: "We had no idea where we were, but as long as I was with you, I didn't care." },
      { id: 6, title: "The Beach Day", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80", desc: "Sunburns, smiles, and the perfect sunset." },
    ]
  },
  {
    title: "Because You Watched: Reasons I Love You",
    items: [
      { id: 7, title: "Your Smile", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80", desc: "It lights up literally every room you walk into, and it's my favorite thing to see." },
      { id: 8, title: "Your Kindness", img: "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?w=500&q=80", desc: "The way you care about everyone around you. You have the biggest heart." },
      { id: 9, title: "Our Future", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80", desc: "I can't wait to see what happens next. Happy Birthday, my love." },
    ]
  }
];

export function Catalog({ profile }: { profile?: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="min-h-screen bg-netflix-black text-white animate-fade-in pb-20 w-full overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full px-4 py-4 md:px-12 md:py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent transition-all">
        <div className="font-bebas text-3xl md:text-4xl text-netflix-red tracking-wide hover:scale-105 transition-transform cursor-pointer">
          HERFLIX
        </div>
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

      {/* Catalog Hero */}
      <div className="relative w-full h-[60vh] md:h-[80vh] flex items-end pb-12 md:pb-24 px-4 md:px-12 lg:px-24">
        {/* Background - user can replace with a video later */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1600&q=80" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-60"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl pt-24">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-netflix-red font-bebas text-xl md:text-3xl tracking-widest">N</span>
             <span className="text-netflix-gray text-xs md:text-sm tracking-[0.2em] uppercase font-bold">Original</span>
          </div>
          <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 text-white drop-shadow-2xl tracking-wide leading-none">
            OUR STORY
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90 drop-shadow-md mb-8 max-w-xl">
            A Netflix Original Series spanning countless laughs, a few tears, and an infinite amount of love. Starring You and Me. Happy Birthday.
          </p>
          <div className="flex gap-3 sm:gap-4">
            <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-lg hover:bg-white/80 transition-colors">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play Video
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-500/50 text-white px-6 py-2 md:px-8 md:py-3 rounded md:rounded-md font-bold text-sm md:text-lg hover:bg-gray-500/70 transition-colors backdrop-blur-md">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="relative z-20 -mt-8 md:-mt-16 space-y-8 md:space-y-12">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className="pl-4 md:pl-12 lg:pl-24">
            <h2 className="text-white text-sm sm:text-base md:text-xl font-bold mb-3 md:mb-4 px-1">{cat.title}</h2>
            <div className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-4 px-1 snap-x snap-mandatory">
              {cat.items.map(item => (
                <div 
                  key={item.id} 
                  className="relative flex-none w-[140px] h-[80px] sm:w-48 sm:h-28 md:w-64 md:h-36 rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 snap-start group border border-white/5 hover:border-white/40"
                  onClick={() => setSelectedItem(item)}
                >
                  <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 md:p-3">
                    <span className="font-medium text-[10px] md:text-sm text-white drop-shadow-md">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Netflix Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col max-h-[90vh]">
            
            {/* Modal Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Modal Hero */}
            <div className="relative w-full h-48 sm:h-64 md:h-80 flex-shrink-0">
              <Image src={selectedItem.img} alt={selectedItem.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10">
                 <h2 className="font-bebas text-3xl sm:text-5xl md:text-6xl text-white drop-shadow-lg">{selectedItem.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 md:p-10 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                 <span className="text-[#46d369] font-bold text-xs md:text-base">99% Match</span>
                 <span className="border border-gray-600 text-gray-300 text-[10px] md:text-xs px-1">TV-MA</span>
                 <span className="text-xs md:text-sm text-gray-300">Season 1</span>
              </div>
              <p className="text-white text-sm md:text-lg leading-relaxed mb-6 font-sans font-light">
                {selectedItem.desc}
              </p>
              <p className="text-netflix-gray text-xs md:text-sm italic">
                Starring: You, Me <br/>
                Genres: Romantic, Comedy, Adventure
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
