
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Role, ChatSession } from '../types';
import { sendMessageToGemini, generateSessionTitle } from '../services/geminiService';
import { LOCATIONS } from '../constants';
import { Send, Sparkles, Calendar, List, Plus, X, Volume2, Copy, Check, BrainCircuit, Loader2, Compass, History, Download, HelpCircle, MessageSquare, Zap, Route, Eye, EyeOff, Layers, MapPin, Trash2, BookOpen, ArrowDown, MessageCircle, Star, Timer } from 'lucide-react';

// --- TRANSLATIONS & CONSTANTS ---

const TRANSLATIONS = {
    vi: {
        appTitle: "Hải Trình Độc Lập",
        appSubtitle: "Bảo tàng số • Trợ lý AI",
        history: "Lưu trữ cá nhân",
        newChat: "Cuộc trò chuyện mới",
        deepThinkingOn: "Bật Tư duy sâu",
        deepThinkingOff: "Tắt Tư duy sâu",
        copy: "Sao chép",
        copied: "Đã sao chép",
        readAloud: "Đọc to",
        inputPlaceholder: "Nhập câu hỏi lịch sử...",
        inputPlaceholderThinking: "Đặt câu hỏi chuyên sâu...",
        send: "Gửi",
        processing: "AI đang suy nghĩ...",
        processingDeep: "Đang phân tích chuyên sâu...",
        guide: "Hướng dẫn",
        guideTitle: "Hướng Dẫn Trải Nghiệm",
        guideSubtitle: "Khám phá sức mạnh của AI trong việc tái hiện lịch sử hào hùng.",
        startNow: "Bắt đầu ngay",
        features: "Tính năng nổi bật",
        featureChat: "Chat Thông Minh",
        featureChatDesc: "Hỏi đáp ngữ cảnh, liên kết lịch sử thế giới.",
        featureDeep: "Tư duy sâu",
        featureDeepDesc: "Phân tích chuyên sâu, đa chiều.",
        featureCopy: "Sao chép",
        featureCopyDesc: "Dễ dàng sao chép nội dung cho tài liệu học tập.",
        featureSim: "Mô phỏng",
        featureSimDesc: "Trải nghiệm kể chuyện nhập vai sống động.",
        toolHint: "Sử dụng các công cụ để học tập hiệu quả hơn.",
        welcomeTitle: "Xin chào!",
        welcomeDesc: "Tôi là Giáo sư Lịch sử Số. Tôi ở đây để cùng bạn tái hiện hành trình 30 năm tìm đường cứu nước của Bác Hồ.",
        suggestions: [
            "Tại sao Bác chọn đi sang phương Tây?",
            "Bác làm gì ở Boston năm 1912?", 
            "Ý nghĩa của Bản Yêu sách 1919?"
        ],
        toolSimulate: "Mô phỏng hành trình",
        toolOutline: "Tạo đề cương",
        toolFlashcard: "Flashcards",
        flashcardQuiz: "Đố vui lịch sử",
        showAnswer: "Xem đáp án",
        hideAnswer: "Ẩn đáp án",
        poweredBy: "Sử dụng công nghệ Gemini 2.5 Flash",
        simulationPrompt: "Hãy mô phỏng chuyến đi lịch sử bắt đầu từ Bến Nhà Rồng năm 1911. Hãy kể như một người dẫn chuyện.",
        outlinePrompt: "Tạo đề cương ôn tập lịch sử về giai đoạn Nguyễn Ái Quốc ở Pháp (1917-1923).",
        flashcardPrompt: "Hãy chơi đố vui lịch sử. Bạn ra câu hỏi, tôi trả lời.",
        downloadChat: "Tải hội thoại",
        deleteSession: "Xóa hội thoại",
        greetingVi: "Chào bạn! Tôi là trợ lý AI chuyên về lịch sử. Hôm nay chúng ta sẽ cùng nhau khám phá giai đoạn nào trong hành trình của Bác?",
        greetingEn: "Hello! I am your AI History Assistant. Which part of Uncle Ho's journey shall we explore today?"
    },
    en: {
        appTitle: "Independent Journey",
        appSubtitle: "Digital Archive • AI Assistant",
        history: "Personal History",
        newChat: "New Chat",
        deepThinkingOn: "Enable Deep Thinking",
        deepThinkingOff: "Disable Deep Thinking",
        copy: "Copy",
        copied: "Copied",
        readAloud: "Read Aloud",
        inputPlaceholder: "Type a history question...",
        inputPlaceholderThinking: "Ask a deep question...",
        send: "Send",
        processing: "AI is thinking...",
        processingDeep: "Deeply analyzing...",
        guide: "Guide",
        guideTitle: "Experience Guide",
        guideSubtitle: "Discover the power of AI in recreating heroic history.",
        startNow: "Start Now",
        features: "Key Features",
        featureChat: "Smart Chat",
        featureChatDesc: "Contextual Q&A, global history connection.",
        featureDeep: "Deep Thinking",
        featureDeepDesc: "In-depth analysis, connecting historical contexts.",
        featureCopy: "Copy Text",
        featureCopyDesc: "Easily copy content for study materials.",
        featureSim: "Simulation",
        featureSimDesc: "Immersive storytelling experience.",
        toolHint: "Use tools for effective learning.",
        welcomeTitle: "Hello!",
        welcomeDesc: "I am your Digital History Professor. I am here to recreate Uncle Ho's 30-year journey with you.",
        suggestions: [
            "Why did he choose the West?",
            "What did he do in Boston in 1912?",
            "Meaning of the 1919 Petition?"
        ],
        toolSimulate: "Simulate Journey",
        toolOutline: "Create Outline",
        toolFlashcard: "Play Flashcards",
        flashcardQuiz: "History Quiz",
        showAnswer: "Show Answer",
        hideAnswer: "Hide Answer",
        poweredBy: "Powered by Gemini 2.5 Flash",
        simulationPrompt: "Simulate the historical journey starting from Nha Rong Wharf in 1911. Tell it like a narrator.",
        outlinePrompt: "Create a history revision outline for the period of Nguyen Ai Quoc in France (1917-1923).",
        flashcardPrompt: "Let's play history quiz. You ask, I answer.",
        downloadChat: "Download Chat",
        deleteSession: "Delete Session",
        greetingVi: "Chào bạn! Tôi là trợ lý AI chuyên về lịch sử. Hôm nay chúng ta sẽ cùng nhau khám phá giai đoạn nào trong hành trình của Bác?",
        greetingEn: "Hello! I am your AI History Assistant. Which part of Uncle Ho's journey shall we explore today?"
    }
};

// --- SUB-COMPONENTS ---

const VNFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-5 rounded-sm object-cover shadow-sm border border-slate-100">
    <rect width="900" height="600" fill="#DA251D"/>
    <path fill="#FFCD00" d="M450 125l92.2 285.2-242.6-176.3h300.8L357.8 410.2z"/>
  </svg>
);

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-5 rounded-sm object-cover shadow-sm border border-slate-100">
    <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);


/**
 * Background Effects Component
 * Renders stars and shooting stars
 */
const BackgroundEffects: React.FC = () => {
    const stars = useRef([...Array(50)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        duration: `${Math.random() * 3 + 2}s`,
        opacity: Math.random() * 0.7 + 0.3
    }))).current;

    return (
        <div className="star-bg absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-100 opacity-20"></div>
             {stars.map((s, i) => (
                 <div key={i} className="star" style={{top: s.top, left: s.left, width: s.size, height: s.size, '--duration': s.duration, '--opacity': s.opacity} as any}></div>
             ))}
             <div className="shooting-star" style={{ top: '20%', left: '80%', animationDelay: '0s' }}></div>
             <div className="shooting-star" style={{ top: '40%', left: '60%', animationDelay: '5s' }}></div>
             <div className="shooting-star" style={{ top: '10%', left: '40%', animationDelay: '12s' }}></div>
        </div>
    );
};

const Tooltip: React.FC<{ children: React.ReactNode; text: string; position?: 'top' | 'bottom' }> = ({ children, text, position = 'top' }) => {
    return (
        <div className="group relative flex items-center justify-center">
            {children}
            <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50`}>
                <div className="bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                    {text}
                    <div className={`tooltip-arrow ${position === 'top' ? 'bottom-[-3px]' : 'top-[-3px] rotate-[-135deg]'}`}></div>
                </div>
            </div>
        </div>
    );
};

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in ring-1 ring-white/50 border border-white/50 flex flex-col md:flex-row h-[80vh] md:h-auto">
        
        {/* Left Side: Hero */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-900 to-blue-900 p-8 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0">
                 <div className="star" style={{top: '20%', left: '20%', width: '2px', height: '2px', '--duration': '3s', '--opacity': 1} as any}></div>
                 <div className="star" style={{top: '60%', left: '80%', width: '3px', height: '3px', '--duration': '4s', '--opacity': 0.8} as any}></div>
                 <div className="shooting-star" style={{ top: '15%', left: '90%', animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                    <Compass size={28} className="text-yellow-300"/>
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2 leading-tight">
                    {lang === 'vi' ? 'Hướng Dẫn' : 'User'}<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">{lang === 'vi' ? 'Trải Nghiệm' : 'Guide'}</span>
                </h2>
                <p className="text-blue-200 text-sm leading-relaxed opacity-90">{t.guideSubtitle}</p>
            </div>

            <div className="relative z-10 mt-8">
                <button onClick={onClose} className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 group">
                    {t.startNow} <ArrowDown size={16} className="-rotate-90 group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>
        </div>

        {/* Right Side: Grid */}
        <div className="w-full md:w-2/3 p-6 md:p-8 bg-white/50 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">{t.features}</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"><X size={20}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0"><MessageCircle size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{t.featureChat}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{t.featureChatDesc}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1.5 bg-purple-100 rounded-bl-xl"><Star size={12} className="text-purple-600 fill-purple-600 animate-pulse"/></div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform flex-shrink-0"><BrainCircuit size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">{t.featureDeep}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{t.featureDeepDesc}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform flex-shrink-0"><Copy size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-green-600 transition-colors">{t.featureCopy}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{t.featureCopyDesc}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform flex-shrink-0"><Route size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{t.featureSim}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{t.featureSimDesc}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400"><Plus size={20}/></div>
                <p className="text-xs text-slate-500">{t.toolHint}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// HELPER: Robust Bilingual Parsing
const extractBilingualParts = (text: string) => {
    const viMarker = ":::VI:::";
    const enMarker = ":::EN:::";
    
    const viIndex = text.indexOf(viMarker);
    const enIndex = text.indexOf(enMarker);
    
    let vi = "";
    let en = "";

    // If VI marker exists
    if (viIndex !== -1) {
        const viStart = viIndex + viMarker.length;
        if (enIndex !== -1 && enIndex > viIndex) {
            // EN marker exists after VI
            vi = text.substring(viStart, enIndex).trim();
            en = text.substring(enIndex + enMarker.length).trim();
        } else {
            // EN marker missing or invalid, assume rest is VI
            vi = text.substring(viStart).trim();
        }
    } else {
        // VI marker missing
        if (enIndex !== -1) {
             // Weird edge case: only EN found
             vi = text.substring(0, enIndex).trim(); // Assume start is VI
             en = text.substring(enIndex + enMarker.length).trim();
        } else {
             // No markers, fallback to full text as VI
             vi = text;
        }
    }

    return { vi, en };
};

interface MessageBubbleProps {
  text: string;
  role: Role;
  timestamp: number;
  onUpdate?: () => void;
  isThinking?: boolean;
  currentLanguage: 'vi' | 'en';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, role, timestamp, onUpdate, isThinking, currentLanguage }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null); // Track copied ID

  const t = TRANSLATIONS[currentLanguage];

  useEffect(() => {
    if (role === Role.USER || (Date.now() - timestamp > 10000)) {
        setDisplayedText(text);
        setIsTyping(false);
        return;
    }

    if (text && !isTyping && displayedText === '') {
        setIsTyping(true);
        let currentIndex = 0;
        const baseSpeed = text.length > 300 ? 3 : 10;
        
        const typingInterval = setInterval(() => {
            if (currentIndex >= text.length) {
                clearInterval(typingInterval);
                setDisplayedText(text);
                setIsTyping(false);
            } else {
                currentIndex += 5; // Faster typing for split view to populate quickly
                if (currentIndex > text.length) currentIndex = text.length;
                setDisplayedText(text.substring(0, currentIndex));
            }
            if (onUpdate) onUpdate();
        }, baseSpeed);
        return () => clearInterval(typingInterval);
    } else if (!isTyping && displayedText !== text) {
        setDisplayedText(text);
    }
  }, [text, role, timestamp]);

  const handleSpeak = (content: string, lang: 'vi' | 'en') => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      let cleanText = content.replace(/\*\*/g, '');
      cleanText = cleanText.replace(/:::FLASHCARD/g, '').replace(/Q:/g, '').replace(/A:/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = (content: string, id: string) => {
      navigator.clipboard.writeText(content);
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
  };

  const renderFlashcard = (content: string) => {
      const parts = content.split("A:");
      const question = parts[0]?.replace("Q:", "").trim();
      const answer = parts[1]?.trim();

      return (
          <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 mt-2 w-full max-w-sm mx-auto shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-indigo-50 pb-2">
                  <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                     <Timer size={16} />
                  </div>
                  <span className="text-indigo-900 text-xs font-bold uppercase tracking-wider">
                      {t.flashcardQuiz}
                  </span>
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-4 leading-relaxed">{question}</h3>
              <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${showAnswer ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 text-sm font-bold shadow-inner flex items-start gap-2">
                      <Check size={16} className="mt-0.5 flex-shrink-0"/>
                      {answer}
                  </div>
              </div>
              <button onClick={() => setShowAnswer(!showAnswer)} className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${showAnswer ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {showAnswer ? <><EyeOff size={16}/> {t.hideAnswer}</> : <><Eye size={16}/> {t.showAnswer}</>}
              </button>
          </div>
      );
  };

  const renderContent = (content: string) => {
    if (content.includes(":::FLASHCARD")) {
        return renderFlashcard(content.replace(":::FLASHCARD", ""));
    }

    return content.split('\n').map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-2"></div>;
      
      const isBullet = line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().substring(1).trim() : line;
      
      const parts = cleanLine.split(/(\*\*[\s\S]*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const text = part.slice(2, -2);
          const isLocation = LOCATIONS.some(l => text.includes(l.title) || l.title.includes(text));
          
          if (isLocation && role === Role.MODEL) {
             return (
                 <span key={pIdx} className="font-bold text-blue-600 bg-blue-50 px-1 rounded mx-0.5 border border-blue-100 inline-block cursor-default">
                    <MapPin size={12} className="inline mr-0.5 mb-0.5"/>{text}
                 </span>
             );
          }
          return <span key={pIdx} className="font-bold text-slate-900">{text}</span>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2.5 mb-2 ml-1">
             <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
             <p className="leading-7">{parts}</p>
          </div>
        );
      }
      return <p key={idx} className="mb-2 leading-7">{parts}</p>;
    });
  };

  const { vi, en } = extractBilingualParts(displayedText);
  const hasVi = vi && vi.length > 0;
  const hasEn = en && en.length > 0;

  if (role === Role.MODEL) {
      return (
        <div className="w-full text-[15px] text-slate-700">
             <div className="flex flex-col md:flex-row gap-4 w-full">
                {hasVi && (
                    <div className={`${hasEn ? 'flex-1' : 'w-full'} bg-white/60 border border-red-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative group/vi`}>
                        <div className="flex items-center justify-between mb-3 border-b border-red-50 pb-2">
                            <div className="flex items-center gap-2">
                                <VNFlag /> <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Tiếng Việt</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover/vi:opacity-100 transition-opacity">
                                <button onClick={() => handleSpeak(vi, 'vi')} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-red-600 transition-colors" title={t.readAloud}><Volume2 size={14} /></button>
                                <button onClick={() => handleCopy(vi, 'vi')} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-red-600 transition-colors" title={t.copy}>
                                    {isCopied === 'vi' ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="min-h-[60px]">{renderContent(vi)}</div>
                    </div>
                )}

                {hasEn && (
                    <div className={`${hasVi ? 'flex-1' : 'w-full'} bg-white/60 border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative group/en`}>
                        <div className="flex items-center justify-between mb-3 border-b border-blue-50 pb-2">
                            <div className="flex items-center gap-2">
                                <UKFlag /> <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">English</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover/en:opacity-100 transition-opacity">
                                <button onClick={() => handleSpeak(en, 'en')} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-blue-600 transition-colors" title={t.readAloud}><Volume2 size={14} /></button>
                                <button onClick={() => handleCopy(en, 'en')} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-blue-600 transition-colors" title={t.copy}>
                                    {isCopied === 'en' ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="min-h-[60px]">{renderContent(en)}</div>
                    </div>
                )}
             </div>
             
             {isTyping && (
                <div className="flex gap-1 mt-3 justify-center">
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`} style={{animationDelay: '0.1s'}}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`} style={{animationDelay: '0.2s'}}></span>
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="text-[15px] text-white">
      {renderContent(displayedText)}
      {isTyping && (
          <div className="flex gap-1 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`} style={{animationDelay: '0.1s'}}></span>
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isThinking ? 'bg-purple-400' : 'bg-blue-400'}`} style={{animationDelay: '0.2s'}}></span>
          </div>
      )}
    </div>
  );
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>('vi');
  const [showGuide, setShowGuide] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLanguage];

  // --- LOCAL STORAGE LOGIC ---
  const LOCAL_STORAGE_KEY = 'haitrinhdoclap_sessions_v2';

  const loadLocalSessions = () => {
      try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
              const sessions: ChatSession[] = JSON.parse(stored);
              setChatSessions(sessions.sort((a, b) => b.updatedAt - a.updatedAt));
          }
      } catch (e) {
          console.error("Failed to load sessions", e);
      }
  };

  const saveLocalSessions = (sessions: ChatSession[]) => {
      try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
          setChatSessions(sessions.sort((a, b) => b.updatedAt - a.updatedAt));
      } catch (e) {
          console.error("Failed to save sessions", e);
      }
  };

  useEffect(() => {
      loadLocalSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Welcome Message Logic
  const triggerWelcome = () => {
      const welcomeMsg: ChatMessage = {
          id: 'welcome',
          role: Role.MODEL,
          text: `:::VI:::${t.greetingVi}:::EN:::${t.greetingEn}`,
          timestamp: Date.now(),
          isThinking: false
      };
      setMessages([welcomeMsg]);
  };

  const loadSession = (session: ChatSession) => {
      setCurrentSessionId(session.id);
      setMessages(session.messages || []);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
      e.stopPropagation();
      if (!confirm(t.deleteSession + "?")) return;
      
      const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
      saveLocalSessions(updatedSessions);
      
      if (currentSessionId === sessionId) {
          handleNewChat();
      }
  };

  const handleDownloadHistory = () => {
    if (messages.length === 0) return;

    const content = messages.map(m => {
        const time = new Date(m.timestamp).toLocaleString('vi-VN');
        const role = m.role === Role.USER ? "BẠN" : "GIÁO SƯ AI";
        let cleanText = m.text.replace(/:::VI:::/g, '[VIETNAMESE]:\n').replace(/:::EN:::/g, '\n[ENGLISH]:\n');
        return `[${time}] ${role}:\n${cleanText}\n--------------------------------------------------`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hoi-thoai-Hai-Trinh-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewChat = () => {
      setCurrentSessionId(null);
      // Automatically trigger welcome message for new chat
      triggerWelcome();
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  // If initial load and no messages, trigger welcome
  useEffect(() => {
      if (!currentSessionId && messages.length === 0) {
          triggerWelcome();
      }
  }, []);

  const handleSendMessage = async () => {
      if (!input.trim()) return;
      
      const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: Role.USER,
          text: input,
          timestamp: Date.now(),
          isThinking: isThinking
      };

      const tempMessages = [...messages, userMessage];
      setMessages(tempMessages);
      setInput('');
      setIsLoading(true);

      const loadingId = (Date.now() + 1).toString();
      
      try {
          const responseText = await sendMessageToGemini(
              tempMessages, 
              input, 
              undefined, 
              isThinking,
              currentLanguage
          );

          const aiMessage: ChatMessage = {
              id: loadingId,
              role: Role.MODEL,
              text: responseText,
              timestamp: Date.now(),
              isThinking: isThinking
          };

          const newMessages = [...tempMessages, aiMessage];
          setMessages(newMessages);

          // Save to Local Storage
          await saveToStorage(newMessages);

      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };

  const saveToStorage = async (msgs: ChatMessage[]) => {
      let sid = currentSessionId;
      let title = "Cuộc trò chuyện mới";
      let newSessions = [...chatSessions];

      if (!sid) {
          sid = Date.now().toString();
          // Generate title
          const firstUserMsg = msgs.find(m => m.role === Role.USER);
          const firstAiMsg = msgs.find(m => m.role === Role.MODEL && m.id !== 'welcome');
          
          if (firstUserMsg && firstAiMsg) {
             title = await generateSessionTitle(firstUserMsg.text, firstAiMsg.text);
          }
          
          const newSession: ChatSession = {
              id: sid,
              title,
              messages: msgs,
              updatedAt: Date.now()
          };
          newSessions.push(newSession);
          setCurrentSessionId(sid);
      } else {
          // Update existing
          const idx = newSessions.findIndex(s => s.id === sid);
          if (idx !== -1) {
              newSessions[idx] = {
                  ...newSessions[idx],
                  messages: msgs,
                  updatedAt: Date.now()
              };
          }
      }
      
      saveLocalSessions(newSessions);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-slate-50 relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
             <BackgroundEffects />
        </div>
        
        <GuideModal 
            isOpen={showGuide}
            onClose={() => setShowGuide(false)}
            lang={currentLanguage}
        />

        {/* Sidebar */}
        <div className={`
            absolute md:relative z-40 h-full w-[300px] bg-white/95 backdrop-blur-2xl border-r border-slate-200 flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-100 bg-white/50">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 text-white">
                        <Compass size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-slate-800 leading-tight text-lg">{t.appTitle}</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.appSubtitle}</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400">
                        <X size={20}/>
                    </button>
                </div>
                
                <button 
                    onClick={handleNewChat}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-slate-200 active:scale-95 text-sm font-bold group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" /> {t.newChat}
                </button>
            </div>

            {/* Session List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 px-3 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <History size={12}/> {t.history}
                </div>
                
                {chatSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40 text-center px-4">
                        <div className="bg-slate-100 p-4 rounded-full mb-3">
                            <MessageSquare size={24} className="text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Lịch sử chat sẽ lưu tại đây.<br/>An toàn & Riêng tư.</p>
                    </div>
                ) : (
                    chatSessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => loadSession(session)}
                            className={`
                                group flex items-center justify-between w-full p-3 rounded-xl text-sm transition-all cursor-pointer border
                                ${currentSessionId === session.id 
                                    ? 'bg-blue-50/80 text-blue-700 font-bold border-blue-200 shadow-sm' 
                                    : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-100'}
                            `}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare size={16} className={`flex-shrink-0 ${currentSessionId === session.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                <div className="flex flex-col overflow-hidden">
                                    <p className="truncate w-full pr-1">{session.title || "Cuộc trò chuyện"}</p>
                                    <span className={`text-[10px] font-normal ${currentSessionId === session.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                        {new Date(session.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={(e) => handleDeleteSession(e, session.id)}
                                className={`
                                    p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                                    hover:bg-red-100 hover:text-red-500 text-slate-400
                                `}
                                title={t.deleteSession}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white/60">
                <div className="flex justify-between items-center bg-slate-100/50 p-1 rounded-lg">
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentLanguage('vi')} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${currentLanguage === 'vi' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}>VI</button>
                        <button onClick={() => setCurrentLanguage('en')} className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${currentLanguage === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}>EN</button>
                    </div>
                    <button onClick={() => setShowGuide(true)} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-white transition-all"><HelpCircle size={16}/></button>
                </div>
            </div>
        </div>

        {/* Main Area */}
        <div className="flex-grow flex flex-col h-full relative z-10 bg-white/30">
            {/* Header */}
            <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <List size={24} />
                    </button>
                    <div className="hidden md:block font-bold text-slate-700 text-lg truncate">
                         {currentSessionId && chatSessions.find(s => s.id === currentSessionId)?.title 
                            ? chatSessions.find(s => s.id === currentSessionId)?.title 
                            : t.newChat}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <Tooltip text={t.downloadChat} position="bottom">
                            <button 
                                onClick={handleDownloadHistory} 
                                className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                            >
                                <Download size={20} />
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto px-4 py-6 md:px-8 lg:px-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                 {/* Suggestions are now rendered inside the list if it's the start, otherwise regular chat */}
                 <div className="space-y-8 max-w-6xl mx-auto pb-4">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[98%] md:max-w-[90%] ${msg.role === Role.USER ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm shadow-xl shadow-blue-200' : ''} p-0 transition-all hover:scale-[1.005]`}>
                                    {msg.role === Role.USER ? (
                                    <div className="p-4 px-5">
                                        <MessageBubble 
                                            text={msg.text} 
                                            role={msg.role} 
                                            timestamp={msg.timestamp}
                                            currentLanguage={currentLanguage}
                                        />
                                    </div>
                                    ) : (
                                    <MessageBubble 
                                        text={msg.text} 
                                        role={msg.role} 
                                        timestamp={msg.timestamp}
                                        isThinking={msg.isThinking}
                                        currentLanguage={currentLanguage}
                                    />
                                    )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
                                <Loader2 className="animate-spin text-blue-500" size={18} />
                                <span className="text-sm text-slate-500 font-medium">{isThinking ? t.processingDeep : t.processing}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="max-w-6xl mx-auto relative">
                     {/* Smart Suggestions above input if new chat */}
                     {messages.length <= 1 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {t.suggestions.map((s, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => { setInput(s); document.querySelector('textarea')?.focus(); }}
                                    className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm flex items-center gap-1.5"
                                >
                                    <Sparkles size={12} className="text-blue-400" />
                                    {s}
                                </button>
                            ))}
                        </div>
                     )}

                    {/* Toolbar */}
                    <div className="absolute bottom-full mb-3 left-0 flex gap-2 animate-fade-in">
                        <Tooltip text={isThinking ? t.deepThinkingOff : t.deepThinkingOn}>
                            <button 
                                onClick={() => setIsThinking(!isThinking)}
                                className={`p-2.5 rounded-full transition-all border shadow-sm ${isThinking ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-purple-100' : 'bg-white text-slate-500 hover:text-purple-600 border-slate-200 hover:border-purple-200'}`}
                            >
                                <BrainCircuit size={18} />
                            </button>
                        </Tooltip>
                        
                        <div className="w-px h-8 bg-slate-200 mx-1 self-center"></div>

                        <Tooltip text={t.toolSimulate}>
                            <button onClick={() => setInput(t.simulationPrompt)} className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
                                <Route size={18} />
                            </button>
                        </Tooltip>
                        <Tooltip text={t.toolOutline}>
                            <button onClick={() => setInput(t.outlinePrompt)} className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                <List size={18} />
                            </button>
                        </Tooltip>
                        <Tooltip text={t.toolFlashcard}>
                             <button onClick={() => setInput(t.flashcardPrompt)} className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                <Layers size={18} />
                            </button>
                        </Tooltip>
                    </div>

                    <div className={`
                        flex items-end gap-2 bg-slate-50 border transition-all duration-300 rounded-[2rem] p-3 pl-6 shadow-inner
                        ${isThinking ? 'border-purple-200 bg-purple-50/30 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300' : 'border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 focus-within:bg-white'}
                    `}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isThinking ? t.inputPlaceholderThinking : t.inputPlaceholder}
                            className="flex-grow bg-transparent border-none focus:outline-none resize-none py-2 max-h-60 text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed custom-scrollbar"
                            rows={3}
                            style={{minHeight: '80px'}}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`
                                p-3.5 rounded-full flex-shrink-0 transition-all mb-1
                                ${input.trim() && !isLoading 
                                    ? (isThinking ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 hover:-translate-y-0.5' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5')
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                            `}
                        >
                            <Send size={22} className={isLoading ? 'opacity-0' : ''} />
                            {isLoading && <Loader2 size={22} className="animate-spin absolute" />}
                        </button>
                    </div>
                    <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
                        <Zap size={10} className="text-yellow-500 fill-yellow-500"/>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {t.poweredBy}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
