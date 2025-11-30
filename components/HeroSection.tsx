import React from 'react';
import { Compass, Map as MapIcon } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-red-700 to-red-900 text-white overflow-hidden shadow-xl">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
      <div className="container mx-auto px-6 py-12 md:py-16 relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-sm">
          <Compass className="w-8 h-8 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-bold tracking-widest uppercase">Hải Trình Độc Lập</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
          30 Năm Tìm Đường <br/>
          <span className="text-yellow-400">Cứu Nước</span>
        </h1>
        <p className="text-lg md:text-xl text-red-100 max-w-2xl mb-8 font-light">
          Khám phá hành trình vĩ đại của Chủ tịch Hồ Chí Minh từ Bến Nhà Rồng đến Pác Bó qua bản đồ số tương tác và hướng dẫn viên AI.
        </p>
        <button 
          onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2"
        >
          <MapIcon size={20} />
          Bắt Đầu Hành Trình
        </button>
      </div>
    </div>
  );
};
