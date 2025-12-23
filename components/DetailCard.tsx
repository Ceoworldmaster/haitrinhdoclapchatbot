import React, { useRef, useState } from 'react';
import { LocationData } from '../types';
import { Calendar, Play, Pause, ArrowUpRight } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col overflow-hidden">
      
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={location.image} 
          alt={location.title}
          className="w-full h-full object-cover"
        />
        
        {location.audio && (
            <button 
                onClick={toggleAudio}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-blue-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                title="Nghe thuyết minh"
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <div className="flex items-center text-blue-600 font-bold mb-1 text-xs uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>NĂM {location.year}</span>
          </div>
          <h2 className="text-slate-800 text-xl font-bold leading-tight">{location.title}</h2>
        </div>
        
        <div className="mb-4">
            <p className="text-sm font-medium text-slate-500 italic border-l-2 border-blue-500 pl-3">
              {location.description}
            </p>
        </div>
        
        <div className="text-slate-600 text-sm leading-relaxed flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <p>
            {location.details}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-3 text-xs text-slate-400 font-mono">
            <span>LAT: {location.lat.toFixed(2)}</span>
            <span>LNG: {location.lng.toFixed(2)}</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors hover:underline">
            Xem thêm
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};