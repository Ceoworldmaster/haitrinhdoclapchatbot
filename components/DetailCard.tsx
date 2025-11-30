import React, { useRef, useState } from 'react';
import { LocationData } from '../types';
import { BookOpen, Calendar, MapPin, Play, Pause, Volume2, ArrowUpRight } from 'lucide-react';

interface DetailCardProps {
  location: LocationData;
}

export const DetailCard: React.FC<DetailCardProps> = ({ location }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!location.audio) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(location.audio);
        audioRef.current.onended = () => setIsPlaying(false);
      }
      audioRef.current.play().catch(e => console.error("Error playing audio", e));
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col group hover:shadow-2xl transition-all duration-500">
      <div className="relative h-56 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
        <img 
          src={location.image} 
          alt={location.title}
          className="relative w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center text-cyan-300 font-bold mb-2 bg-black/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-white/10">
            <Calendar className="w-3 h-3 mr-2" />
            <span>{location.year}</span>
          </div>
          <h2 className="text-white text-3xl font-serif font-bold drop-shadow-md leading-tight">{location.title}</h2>
        </div>
        
        {/* Play Button Overlay */}
        {location.audio && (
            <button 
                onClick={toggleAudio}
                className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 backdrop-blur-md p-3 rounded-full text-white transition-all shadow-lg border border-white/40 group-hover:scale-110 active:scale-95"
            >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col bg-white relative">
        <div className="mb-5">
            <p className="text-lg font-medium text-slate-700 italic border-l-4 border-ocean-blue pl-4 py-2 bg-slate-50 rounded-r-lg flex items-start gap-3 shadow-sm">
              <span className="mt-1 flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-ocean-blue"><Volume2 size={16} /></span>
              <span className="leading-relaxed">"{location.description}"</span>
            </p>
        </div>
        
        <div className="prose prose-slate text-slate-600 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <p className="leading-relaxed text-base text-justify">
            {location.details}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-xs font-bold text-ocean-blue rounded-md uppercase tracking-wider border border-blue-100">Lịch sử</span>
            <span className="px-2.5 py-1 bg-slate-100 text-xs font-bold text-slate-500 rounded-md uppercase tracking-wider border border-slate-200">Tư liệu</span>
          </div>
          <button className="text-white bg-ocean-blue hover:bg-ocean-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 group/btn">
            <BookOpen size={16} />
            <span>Thư viện ảnh</span>
            <ArrowUpRight size={14} className="opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};