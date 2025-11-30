import React, { useState, useRef, useEffect } from 'react';
import { LOCATIONS } from '../constants';
import { LocationData } from '../types';
import { MapPin, Navigation, SlidersHorizontal } from 'lucide-react';

interface JourneyMapProps {
  selectedLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ selectedLocation, onSelectLocation }) => {
  // Slider State
  const MIN_YEAR = 1911;
  const MAX_YEAR = 1941;
  const [range, setRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const visibleLocations = LOCATIONS.filter(l => {
    const year = parseInt(l.year);
    return year >= range[0] && year <= range[1];
  });

  // Handle Slider Interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      const value = Math.round(MIN_YEAR + percent * (MAX_YEAR - MIN_YEAR));

      setRange(prev => {
        const [currMin, currMax] = prev;
        if (isDragging === 'min') {
          // Prevent crossing
          const newMin = Math.min(value, currMax - 1);
          return [Math.max(MIN_YEAR, newMin), currMax];
        } else {
          // Prevent crossing
          const newMax = Math.max(value, currMin + 1);
          return [currMin, Math.min(MAX_YEAR, newMax)];
        }
      });
    };

    const handleMouseUp = () => setIsDragging(null);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Calculate percentages for slider UI
  const getPercent = (value: number) => ((value - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 h-full flex flex-col relative overflow-hidden group">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 group-hover:bg-blue-100 transition-colors"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 z-10">
        <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center drop-shadow-sm">
          <Navigation className="mr-2 text-ocean-blue" /> Bản Đồ Hành Trình
        </h3>

        {/* Filter / Slider Component */}
        <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
           <div className="flex justify-between items-center text-xs font-bold text-ocean-blue mb-3">
              <span className="flex items-center gap-1"><SlidersHorizontal size={14}/> Lọc theo năm</span>
              <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{range[0]} - {range[1]}</span>
           </div>
           
           <div className="relative h-6 flex items-center select-none" ref={sliderRef}>
              {/* Track Background */}
              <div className="absolute w-full h-2 bg-slate-200 rounded-full overflow-hidden"></div>
              
              {/* Active Range Track */}
              <div 
                className="absolute h-2 bg-gradient-to-r from-ocean-blue to-cyan-400 rounded-full shadow-sm"
                style={{ 
                  left: `${getPercent(range[0])}%`, 
                  width: `${getPercent(range[1]) - getPercent(range[0])}%` 
                }}
              ></div>

              {/* Min Thumb */}
              <div 
                className="absolute w-6 h-6 bg-white border-4 border-ocean-blue rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform z-10 ring-2 ring-white"
                style={{ left: `calc(${getPercent(range[0])}% - 12px)` }}
                onMouseDown={() => setIsDragging('min')}
              ></div>

              {/* Max Thumb */}
              <div 
                className="absolute w-6 h-6 bg-white border-4 border-ocean-blue rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform z-10 ring-2 ring-white"
                style={{ left: `calc(${getPercent(range[1])}% - 12px)` }}
                onMouseDown={() => setIsDragging('max')}
              ></div>
           </div>
        </div>
      </div>
      
      {/* Stylized Abstract Map Container */}
      <div className="relative w-full aspect-[16/9] bg-[#fdfbf7] rounded-xl overflow-hidden border border-slate-200 shadow-inner group-hover:shadow-md transition-all">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#0c4a6e 1px, transparent 1px), linear-gradient(90deg, #0c4a6e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* World Map Silhouette */}
        <svg className="absolute inset-0 w-full h-full text-slate-200 fill-current opacity-80 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M10,30 Q30,20 40,30 T55,25 T80,40 T90,70 L80,80 L10,80 Z" />
           <path d="M5,40 Q15,35 25,45 T30,70 L5,70 Z" />
        </svg>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-sm">
          <polyline 
            points={LOCATIONS.map(l => `${l.coordinates.x},${l.coordinates.y}`).join(' ')}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4 2"
            className="opacity-30" 
          />
          {/* Active Path for Visible Locations */}
           <polyline 
            points={visibleLocations.map(l => `${l.coordinates.x},${l.coordinates.y}`).join(' ')}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            className="opacity-90 drop-shadow-md"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Location Pins */}
        {visibleLocations.map((loc) => {
          const isSelected = selectedLocation.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 focus:outline-none animate-fade-in-up`}
              style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
              aria-label={`Select ${loc.title}`}
            >
              <div className={`relative flex flex-col items-center`}>
                {/* Pin Icon */}
                <div className={`
                  w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-300
                  ${isSelected ? 'bg-amber-400 border-ocean-blue scale-150 ring-4 ring-blue-100 z-20' : 'bg-ocean-blue border-white hover:bg-cyan-400 hover:scale-125'}
                `}></div>
                
                {/* Ripple Effect for selected */}
                {isSelected && (
                  <span className="absolute w-10 h-10 bg-ocean-blue rounded-full opacity-20 animate-ping -z-10"></span>
                )}

                {/* Label */}
                <div className={`
                  mt-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap
                  border border-slate-100 transition-all duration-300 transform
                  ${isSelected ? 'opacity-100 text-ocean-blue scale-110' : 'opacity-0 group-hover:opacity-100 text-slate-600 translate-y-2 group-hover:translate-y-0'}
                `}>
                  {loc.year}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Timeline Controls (Filtered) */}
      <div className="mt-6 flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x px-1">
        {visibleLocations.length > 0 ? (
          visibleLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className={`
                flex-shrink-0 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all snap-center animate-fade-in-up hover:-translate-y-1
                ${selectedLocation.id === loc.id 
                  ? 'bg-gradient-to-r from-ocean-blue to-cyan-500 text-white border-transparent shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:shadow-md'}
              `}
            >
              <span className="block font-bold">{loc.year}</span>
              <span className="text-xs opacity-90">{loc.title.split('(')[0]}</span>
            </button>
          ))
        ) : (
          <div className="w-full text-center py-6 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200 text-slate-400 italic">
            Không có địa điểm nào trong khoảng thời gian này.
          </div>
        )}
      </div>
    </div>
  );
};