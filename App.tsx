
import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden relative font-sans">
      {/* Full Screen Chat Interface */}
      <div className="flex-grow flex flex-col h-full w-full bg-white shadow-xl z-10">
          <ChatInterface />
      </div>
    </div>
  );
};

export default App;
