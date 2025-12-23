
import React, { useState, useRef, useEffect } from 'react';
import { LocationData } from '../types';
import { SlidersHorizontal, Map as MapIcon, Globe, Compass, ExternalLink } from 'lucide-react';

interface JourneyMapProps {
  locations: LocationData[];
  selectedLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  mapSource: 'national' | 'local';
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ locations, selectedLocation, onSelectLocation, mapSource }) => {
  const MIN_YEAR = 1911;
  const MAX_YEAR = 1976;
  const [range, setRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [viewMode, setViewMode] = useState<'abstract' | 'real'>('abstract'); 
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset range when map source changes
  useEffect(() => {
      if (mapSource === 'national') setRange([1911, 1941]);
      else setRange([1929, 1976]);
  }, [mapSource]);

  const visibleLocations = locations.filter(l => {
    const year = parseInt(l.year);
    return year >= range[0] && year <= range[1];
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      const value = Math.round(MIN_YEAR + percent * (MAX_YEAR - MIN_YEAR));

      setRange(prev => {
        const [currMin, currMax] = prev;
        if (isDragging === 'min') {
          const newMin = Math.min(value, currMax - 1);
          return [Math.max(MIN_YEAR, newMin), currMax];
        } else {
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

  const getPercent = (value: number) => ((value - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col relative overflow-hidden transition-all duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 p-4 border-b border-slate-100 pl-40 md:pl-44">
        <h3 className="text-lg font-bold text-slate-800 flex items-center hidden md:flex">
          <Compass className="mr-2 text-blue-600" size={20} /> Bản Đồ
        </h3>

        <div className="w-full md:w-auto flex flex-col gap-3">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 min-w-[280px]">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><SlidersHorizontal size={14}/> NIÊN ĐẠI</span>
                    <span className={`bg-white px-2 py-0.5 rounded border border-slate-200 ${mapSource === 'local' ? 'text-green-600' : 'text-blue-600'}`}>{range[0]} - {range[1]}</span>
                </div>
                
                <div className="relative h-6 flex items-center select-none" ref={sliderRef}>
                    <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
                    <div 
                        className={`absolute h-1.5 rounded-full ${mapSource === 'local' ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ 
                        left: `${getPercent(range[0])}%`, 
                        width: `${getPercent(range[1]) - getPercent(range[0])}%` 
                        }}
                    ></div>

                    <div 
                        className={`absolute w-5 h-5 bg-white border-2 rounded-full cursor-pointer shadow hover:scale-110 transition-transform z-10 ${mapSource === 'local' ? 'border-green-600' : 'border-blue-600'}`}
                        style={{ left: `calc(${getPercent(range[0])}% - 10px)` }}
                        onMouseDown={() => setIsDragging('min')}
                    ></div>

                    <div 
                        className={`absolute w-5 h-5 bg-white border-2 rounded-full cursor-pointer shadow hover:scale-110 transition-transform z-10 ${mapSource === 'local' ? 'border-green-600' : 'border-blue-600'}`}
                        style={{ left: `calc(${getPercent(range[1])}% - 10px)` }}
                        onMouseDown={() => setIsDragging('max')}
                    ></div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className={`relative w-full flex-grow overflow-hidden ${mapSource === 'local' ? 'bg-green-50/30' : 'bg-blue-50/30'}`}>
        
        <div className="absolute top-3 right-3 z-30 flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <button 
                onClick={() => setViewMode('abstract')}
                className={`p-2 flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'abstract' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <MapIcon size={14} /> Minh họa
            </button>
            <div className="w-[1px] bg-slate-200"></div>
            <button 
                onClick={() => setViewMode('real')}
                className={`p-2 flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'real' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Globe size={14} /> Vệ tinh
            </button>
        </div>

        {viewMode === 'abstract' ? (
            <>
                {/* SVG Maps */}
                {mapSource === 'national' ? (
                    <svg className="absolute inset-0 w-full h-full text-slate-200 fill-current pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M10,30 Q30,20 40,30 T55,25 T80,40 T90,70 L80,80 L10,80 Z" />
                        <path d="M5,40 Q15,35 25,45 T30,70 L5,70 Z" />
                    </svg>
                ) : (
                    // Stylized shape for Binh Phuoc
                     <svg className="absolute inset-0 w-full h-full text-green-200/50 fill-current pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M30,20 L60,15 L80,40 L70,70 L40,80 L20,60 Z" />
                     </svg>
                )}
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline 
                    points={locations.map(l => `${l.coordinates.x},${l.coordinates.y}`).join(' ')}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <polyline 
                    points={visibleLocations.map(l => `${l.coordinates.x},${l.coordinates.y}`).join(' ')}
                    fill="none"
                    stroke={mapSource === 'local' ? "#16a34a" : "#2563eb"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                </svg>

                {/* Location Pins */}
                {visibleLocations.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                const activeColor = mapSource === 'local' ? 'bg-green-600 border-green-200' : 'bg-blue-600 border-blue-200';
                const activeText = mapSource === 'local' ? 'text-green-700' : 'text-blue-700';

                return (
                    <button
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 focus:outline-none"
                    style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                    >
                    <div className="flex flex-col items-center">
                        <div className={`
                        w-4 h-4 rounded-full border-2 shadow-sm transition-all duration-300 flex items-center justify-center
                        ${isSelected ? `${activeColor} border-white ring-2 scale-125 z-20` : 'bg-white border-slate-400 hover:scale-110'}
                        `}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        
                        <div className={`
                        mt-2 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm whitespace-nowrap
                        transition-all duration-300 transform
                        ${isSelected ? `opacity-100 ${activeText} translate-y-0` : 'opacity-0 group-hover:opacity-100 text-slate-600 translate-y-1 group-hover:translate-y-0'}
                        `}>
                        {loc.year}
                        </div>
                    </div>
                    </button>
                );
                })}
            </>
        ) : (
            <div className="w-full h-full relative animate-fade-in group">
                <iframe
                    title="Google Map Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&t=h&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="absolute inset-0 w-full h-full"
                ></iframe>
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-lg max-w-[200px]">
                    <h4 className="text-xs font-bold text-slate-800 mb-1">{selectedLocation.title}</h4>
                    <p className="text-[10px] text-slate-500">
                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                        Mở rộng <ExternalLink size={10} />
                    </a>
                </div>
            </div>
        )}
      </div>

      {/* Timeline Controls */}
      <div className="bg-white p-2 border-t border-slate-100 flex overflow-x-auto gap-2 scrollbar-hide">
        {visibleLocations.length > 0 ? (
          visibleLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                onSelectLocation(loc);
              }}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${selectedLocation.id === loc.id 
                  ? `${mapSource === 'local' ? 'bg-green-600' : 'bg-blue-600'} text-white shadow-md` 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
              `}
            >
              <span className="font-bold mr-1">{loc.year}</span>
              <span className="opacity-80">{loc.title.split('(')[0]}</span>
            </button>
          ))
        ) : (
          <div className="w-full text-center py-2 text-slate-400 text-xs italic">
            Không tìm thấy sự kiện.
          </div>
        )}
      </div>
    </div>
  );
};
