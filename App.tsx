import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen font-sans bg-slate-50 flex flex-col overflow-hidden relative text-slate-800">
      
      {/* --- CINEMATIC ANIMATED BACKGROUND (LIGHT THEME) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>
        
        {/* Animated Orbs/Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000"></div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow w-full h-full flex flex-col">
        <ChatInterface />
      </main>

    </div>
  );
};

export default App;