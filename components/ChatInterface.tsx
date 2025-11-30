
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Role, User as UserType, ChatSession } from '../types';
import { sendMessageToGemini, summarizeHistory } from '../services/geminiService';
import { authService } from '../services/authService';
import { database } from '../services/firebase';
import { AuthModal } from './AuthModal';
import { LOCATIONS } from '../constants';
import { Send, Ship, Calendar, List, Lock, User, RefreshCcw, LogOut, Plus, MessageSquare, Trash2, X, Clock, MapPin, ChevronRight, ArrowRight, Volume2, Pause, Play, Download, Sparkles, Star, Anchor, FileText, ExternalLink, Link as LinkIcon, Lightbulb, HelpCircle, Info, Mic } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  role: Role;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, role }) => {
  // Simple Markdown Parser
  const renderContent = (content: string) => {
    // 1. Split by newlines to handle paragraphs and lists
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Handle empty lines
      if (!line.trim()) return <div key={lineIndex} className="h-2"></div>;

      // Handle Bullet Points
      const isBullet = line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

      // Process Inline Formatting (Bold and Links)
      const parts = cleanLine.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      
      const parsedLine = parts.map((part, partIndex) => {
        // Handle Bold: **text**
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={partIndex} className={`font-bold ${role === Role.MODEL ? 'text-ocean-blue drop-shadow-sm' : 'text-white'}`}>
              {part.slice(2, -2)}
            </span>
          );
        }
        
        // Handle Links: [Title](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const title = linkMatch[1];
            const url = linkMatch[2];
            return (
                <a 
                    key={partIndex} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 font-medium underline underline-offset-2 transition-colors mx-1
                        ${role === Role.MODEL 
                            ? 'text-cyan-600 hover:text-ocean-blue decoration-cyan-200' 
                            : 'text-white hover:text-blue-100 decoration-white/50'}`}
                >
                    {title}
                    <ExternalLink size={12} className="inline-block" />
                </a>
            );
        }

        return part;
      });

      // Wrapper for Bullet Points vs Normal Text
      if (isBullet) {
        return (
            <div key={lineIndex} className="flex items-start gap-2 mb-1.5 ml-2">
                <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${role === Role.MODEL ? 'bg-cyan-400' : 'bg-white/70'}`}></span>
                <span className="leading-relaxed">{parsedLine}</span>
            </div>
        );
      }
      
      return (
        <div key={lineIndex} className="mb-2 leading-relaxed">
            {parsedLine}
        </div>
      );
    });
  };

  return (
    <div className={`whitespace-pre-wrap text-[15px] ${role === Role.MODEL ? 'text-slate-700' : 'text-white'}`}>
      {renderContent(text)}
    </div>
  );
};

// Custom Glowing Button Component (Light Theme)
const GlowingButton: React.FC<{
    onClick: (e: any) => void;
    icon: React.ReactNode;
    label?: string;
    active?: boolean;
    className?: string;
    title?: string;
}> = ({ onClick, icon, label, active, className, title }) => {
    return (
        <div className={`relative group p-[2px] rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 flex-shrink-0 ${active ? 'bg-gradient-to-r from-ocean-blue to-cyan-400 shadow-md' : 'hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-200'}`}>
            <button 
                onClick={onClick}
                title={title}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-[10px] w-full h-full font-medium text-sm whitespace-nowrap backdrop-blur-md transition-colors shadow-inner
                ${active 
                    ? 'bg-white text-ocean-blue font-bold shadow-sm' 
                    : 'bg-white/80 text-slate-600 hover:text-ocean-blue hover:bg-white'
                } ${className}`}
            >
                {icon}
                {label && <span>{label}</span>}
            </button>
        </div>
    );
};

export const ChatInterface: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // History / Session / Schedule / Help State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Audio State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Summary State
  const [summaryData, setSummaryData] = useState<{ isOpen: boolean; content: string; isLoading: boolean }>({
    isOpen: false,
    content: '',
    isLoading: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load Sessions when User Changes
  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- SESSION MANAGEMENT ---

  const loadSessions = () => {
    if (currentUser) {
      // Load from Firebase
      if (database) {
        const userSessionsRef = database.ref(`users/${currentUser.id}/sessions`);
        userSessionsRef.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedSessions: ChatSession[] = Array.isArray(data) ? data : Object.values(data);
                parsedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
                setSessions(parsedSessions);
                
                if (parsedSessions.length > 0) {
                    setCurrentSessionId(parsedSessions[0].id);
                    setMessages(parsedSessions[0].messages || []);
                } else {
                    startNewChat();
                }
            } else {
                startNewChat();
            }
        });
      }
    } else {
      // Load from LocalStorage (Guest)
      try {
        const stored = localStorage.getItem('chat_sessions_guest');
        if (stored) {
          const parsedSessions: ChatSession[] = JSON.parse(stored);
          parsedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
          setSessions(parsedSessions);

          if (parsedSessions.length > 0) {
            setCurrentSessionId(parsedSessions[0].id);
            setMessages(parsedSessions[0].messages);
          } else {
            startNewChat();
          }
        } else {
          startNewChat();
        }
      } catch (e) {
        console.error("Failed to load guest sessions", e);
        startNewChat();
      }
    }
  };

  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    
    if (currentUser && database) {
        // Save to Firebase
        database.ref(`users/${currentUser.id}/sessions`).set(updatedSessions);
    } else {
        // Save to LocalStorage
        localStorage.setItem('chat_sessions_guest', JSON.stringify(updatedSessions));
    }
  };

  const startNewChat = () => {
    const welcomeText = currentUser 
      ? `Chào ${currentUser.fullName}! Tôi là Trợ lý Hải Trình Độc Lập.\n\nDữ liệu đã được cập nhật. Bạn cần tìm hiểu thông tin gì về hành trình của Bác?`
      : 'Chào bạn! Tôi là Trợ lý Hải Trình Độc Lập.\n\nDữ liệu đã được cập nhật theo các tư liệu lịch sử chính xác nhất về hành trình cứu nước của Bác (1911-1941). Bạn cần tìm hiểu thông tin gì?';

    const initialMessage: ChatMessage = {
      id: 'welcome_' + Date.now(),
      role: Role.MODEL,
      text: welcomeText,
      timestamp: Date.now(),
      suggestions: [
        "Tiêu chuẩn người thanh niên Nguyễn Tất Thành là gì?",
        "Bác Hồ đã đi qua những nước nào?",
        "Ý nghĩa của tên gọi Nguyễn Ái Quốc?"
      ]
    };

    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([initialMessage]);
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa cuộc hội thoại này?')) {
      const updated = sessions.filter(s => s.id !== sessionId);
      saveSessionsToStorage(updated);
      
      if (sessionId === currentSessionId) {
        if (updated.length > 0) {
          setCurrentSessionId(updated[0].id);
          setMessages(updated[0].messages);
        } else {
          startNewChat();
        }
      }
    }
  };

  const handleSummarizeSession = async (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setSummaryData({ isOpen: true, content: '', isLoading: true });
    
    const summary = await summarizeHistory(session.messages);
    setSummaryData({ isOpen: true, content: summary, isLoading: false });
  };

  const clearAllHistory = () => {
    if (window.confirm('Xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.')) {
      saveSessionsToStorage([]);
      startNewChat();
    }
  };

  const exportChatHistory = () => {
    if (messages.length === 0) return;

    const content = messages.map(m => {
        const time = new Date(m.timestamp).toLocaleString('vi-VN');
        const role = m.role === Role.USER ? "BẠN" : "TRỢ LÝ";
        return `[${time}] ${role}:\n${m.text}\n-------------------`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HaiTrinh_LichSu_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadSpecificSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    if (window.innerWidth < 768) {
      setIsHistoryOpen(false); // Close drawer on mobile after selection
    }
  };

  // --- MESSAGING LOGIC ---

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: textToSend,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!overrideText) setInputText('');
    setIsLoading(true);

    let activeSessionId = currentSessionId;
    let updatedSessions = [...sessions];
    
    const existingSessionIndex = updatedSessions.findIndex(s => s.id === activeSessionId);
    
    if (existingSessionIndex === -1) {
      const newSession: ChatSession = {
        id: activeSessionId!,
        title: textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : ''),
        messages: updatedMessages,
        updatedAt: Date.now()
      };
      updatedSessions.unshift(newSession);
    } else {
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        messages: updatedMessages,
        updatedAt: Date.now(),
        title: updatedSessions[existingSessionIndex].messages.length <= 1 
          ? (textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : ''))
          : updatedSessions[existingSessionIndex].title
      };
      const s = updatedSessions.splice(existingSessionIndex, 1)[0];
      updatedSessions.unshift(s);
    }

    saveSessionsToStorage(updatedSessions);
    const responseRaw = await sendMessageToGemini(updatedMessages, textToSend);

    // PARSE RESPONSE FOR SUGGESTIONS
    const separator = "---RELATED_QUESTIONS---";
    const [responseText, suggestionsRaw] = responseRaw.split(separator);
    
    let suggestions: string[] = [];
    if (suggestionsRaw) {
        suggestions = suggestionsRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      text: responseText ? responseText.trim() : "...",
      timestamp: Date.now(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };

    const finalMessages = [...updatedMessages, modelMsg];
    setMessages(finalMessages);
    setIsLoading(false);

    const finalSessions = [...updatedSessions];
    const currentIndex = finalSessions.findIndex(s => s.id === activeSessionId);
    if (currentIndex !== -1) {
      finalSessions[currentIndex].messages = finalMessages;
      finalSessions[currentIndex].updatedAt = Date.now();
      saveSessionsToStorage(finalSessions);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      authService.logout();
      setSessions([]); 
    }
  };

  const handleScheduleSelect = (year: string, title: string) => {
    const question = `Hãy kể chi tiết về sự kiện năm ${year} tại ${title} và các hoạt động của Bác trong thời gian này.`;
    setIsScheduleOpen(false);
    handleSend(question);
  };

  const toggleAudio = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    if (playingAudioId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.onended = () => setPlayingAudioId(null);
      audio.play().catch(e => console.error("Audio playback error:", e));
      audioRef.current = audio;
      setPlayingAudioId(id);
    }
  };

  const sampleQuestions = [
    "Tiêu chuẩn người thanh niên Nguyễn Tất Thành lúc ra đi là gì?",
    "Quy trình hoạt động của Bác tại Pháp diễn ra như thế nào?",
    "Thời gian Bác ở Liên Xô là bao nhiêu năm?",
    "Nguyên tắc hoạt động bí mật của Bác tại Quảng Châu là gì?",
    "Bác đã làm những nghề gì để kiếm sống ở Anh?",
    "Ý nghĩa của sự kiện Bác trở về Pác Bó năm 1941?"
  ];

  return (
    <div className="flex flex-col h-full font-sans relative overflow-hidden text-slate-800">
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* --- HELP GUIDE MODAL --- */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-slate-100">
             <div className="p-5 bg-gradient-to-r from-ocean-blue to-cyan-600 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <HelpCircle size={22} className="text-yellow-300" /> Hướng dẫn sử dụng
                </h3>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                   <X size={20} />
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ocean-blue flex-shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Trò chuyện với AI</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                    Hỏi đáp tự nhiên về lịch sử, sự kiện và nhân vật trong hành trình cứu nước. Nhấn vào các gợi ý câu hỏi để mở rộng kiến thức.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ocean-blue flex-shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Lịch trình thời gian</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                    Bấm vào nút <strong>Lịch trình</strong> để xem dòng thời gian (1911-1941). Chọn một mốc để nghe thuyết minh hoặc hỏi chi tiết về sự kiện đó.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ocean-blue flex-shrink-0">
                                <List size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Quản lý Lịch sử</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                    Xem lại các cuộc hội thoại cũ, tạo hội thoại mới, hoặc xuất file văn bản về máy. Sử dụng tính năng <strong>Tóm tắt</strong> để nắm ý chính nhanh chóng.
                                </p>
                            </div>
                        </div>

                         <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ocean-blue flex-shrink-0">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Tài khoản & Lưu trữ</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                    Đăng nhập bằng Google để đồng bộ lịch sử trò chuyện trên nhiều thiết bị và bảo mật dữ liệu cá nhân.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Lightbulb size={16} className="text-yellow-500" /> Mẹo sử dụng hiệu quả:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
                        <li>Sử dụng câu hỏi cụ thể như "Năm 1911 Bác ở đâu?" thay vì câu hỏi quá chung chung.</li>
                        <li>Bấm vào biểu tượng loa <Volume2 size={12} className="inline text-ocean-blue" /> trong phần Lịch trình để nghe giọng đọc.</li>
                        <li>Bạn có thể tải xuống nội dung cuộc trò chuyện để làm tài liệu tham khảo.</li>
                    </ul>
                </div>
             </div>
             
             <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="px-6 py-2 bg-ocean-blue text-white rounded-lg text-sm font-bold hover:bg-ocean-dark transition-colors shadow-sm hover:shadow-md"
                >
                  Đã hiểu
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- SUMMARY MODAL --- */}
      {summaryData.isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSummaryData({...summaryData, isOpen: false})}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100">
             <div className="p-5 bg-gradient-to-r from-ocean-blue to-cyan-600 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <Sparkles size={18} className="text-yellow-300" /> Tóm tắt hội thoại
                </h3>
                <button 
                  onClick={() => setSummaryData({...summaryData, isOpen: false})}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                   <X size={20} />
                </button>
             </div>
             <div className="p-6">
                {summaryData.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                     <div className="w-8 h-8 border-4 border-slate-200 border-t-ocean-blue rounded-full animate-spin"></div>
                     <p className="text-slate-500 text-sm animate-pulse">Đang phân tích nội dung...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm text-slate-700 leading-relaxed">
                     <p>{summaryData.content}</p>
                  </div>
                )}
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setSummaryData({...summaryData, isOpen: false})}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR HISTORY DRAWER (LEFT) --- */}
      <div 
        className={`fixed inset-y-0 left-0 z-[60] w-80 glass-panel-light border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 bg-gradient-to-r from-blue-50 to-white text-ocean-dark flex justify-between items-center shadow-sm border-b border-blue-100">
           <h2 className="font-bold flex items-center gap-2 drop-shadow-sm text-lg">
             <Clock size={20} className="text-ocean-blue" /> Lịch sử trò chuyện
           </h2>
           <button onClick={() => setIsHistoryOpen(false)} className="hover:bg-slate-200 p-1.5 rounded-full transition-colors text-slate-500 hover:text-red-500">
             <X size={20} />
           </button>
        </div>

        <div className="p-4 border-b border-blue-50 flex flex-col gap-2 bg-white/50">
           <button 
             onClick={() => {
               startNewChat();
               if (window.innerWidth < 768) setIsHistoryOpen(false);
             }}
             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-ocean-blue to-cyan-500 hover:from-ocean-dark hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-200 transform hover:-translate-y-0.5 active:scale-95"
           >
             <Plus size={18} /> Cuộc hội thoại mới
           </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2 bg-white/30">
           {sessions.length === 0 ? (
             <div className="text-center text-slate-400 py-10 flex flex-col items-center animate-pulse">
                <MessageSquare size={40} className="mb-2 opacity-30" />
                <p>Chưa có lịch sử trò chuyện</p>
             </div>
           ) : (
             sessions.map((session) => (
               <div 
                 key={session.id}
                 onClick={() => loadSpecificSession(session)}
                 className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer border transition-all hover:shadow-md
                    ${currentSessionId === session.id 
                      ? 'bg-white border-ocean-blue/30 shadow-sm ring-1 ring-ocean-blue/20' 
                      : 'bg-white/40 border-transparent hover:bg-white'
                    }`}
               >
                  <div className="flex items-start gap-3 overflow-hidden flex-grow">
                     <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${currentSessionId === session.id ? 'bg-ocean-blue text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                        <MessageSquare size={14} />
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className={`font-semibold truncate text-sm ${currentSessionId === session.id ? 'text-ocean-dark' : 'text-slate-600 group-hover:text-ocean-blue'}`}>
                          {session.title || "Cuộc hội thoại mới"}
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-500 flex items-center gap-1">
                          <Clock size={8} />
                          {new Date(session.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => handleSummarizeSession(e, session)}
                        className="p-1.5 hover:bg-cyan-50 text-cyan-500 hover:text-cyan-700 rounded-lg transition-all"
                        title="Tóm tắt"
                    >
                        <FileText size={14} />
                    </button>
                    <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all"
                        title="Xóa"
                    >
                        <Trash2 size={14} />
                    </button>
                  </div>
               </div>
             ))
           )}
        </div>

        <div className="p-4 border-t border-blue-100 bg-white/60 flex flex-col gap-2">
             <button 
               onClick={exportChatHistory}
               className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-ocean-blue font-semibold bg-white border border-slate-200 py-2.5 rounded-lg transition-all hover:shadow-md hover:border-ocean-blue/30"
             >
               <Download size={16} /> Xuất lịch sử
             </button>
             {sessions.length > 0 && (
                <button 
                onClick={clearAllHistory}
                className="w-full text-xs text-red-400 hover:text-red-600 font-medium underline transition-colors pt-1"
                >
                Xóa toàn bộ lịch sử
                </button>
             )}
        </div>
      </div>

      {/* --- SCHEDULE DRAWER (RIGHT) --- */}
      <div 
        className={`fixed inset-y-0 right-0 z-[60] w-80 md:w-96 glass-panel-light border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isScheduleOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 bg-gradient-to-l from-blue-50 to-white text-ocean-dark flex justify-between items-center shadow-sm border-b border-blue-100">
           <h2 className="font-bold flex items-center gap-2 text-lg drop-shadow-sm">
             <MapPin size={20} className="text-ocean-blue" /> Hành trình 1911 - 1941
           </h2>
           <button onClick={() => setIsScheduleOpen(false)} className="hover:bg-slate-200 p-1.5 rounded-full transition-colors text-slate-500 hover:text-red-500">
             <X size={20} />
           </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-white/30">
           <div className="relative border-l-2 border-ocean-blue/30 ml-3 space-y-8">
              {LOCATIONS.sort((a,b) => parseInt(a.year) - parseInt(b.year)).map((loc, index) => (
                <div key={loc.id} className="relative pl-8 group">
                   {/* Timeline Dot */}
                   <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-ocean-blue group-hover:scale-125 group-hover:border-cyan-400 transition-all z-10 shadow-md"></div>
                   
                   {/* Card Content */}
                   <div 
                     onClick={() => handleScheduleSelect(loc.year, loc.title)}
                     className="bg-white/80 p-4 rounded-xl border border-white shadow-sm hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1 relative group-hover:bg-white group-hover:border-ocean-blue/30"
                   >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold text-ocean-blue font-serif bg-blue-50 px-2 py-0.5 rounded">{loc.year}</span>
                        {/* Audio Button */}
                        {loc.audio && (
                           <button 
                             onClick={(e) => toggleAudio(e, loc.audio!, loc.id)}
                             className={`p-2 rounded-full transition-all shadow-sm ${playingAudioId === loc.id ? 'bg-ocean-blue text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:bg-ocean-blue hover:text-white'}`}
                             title="Nghe thuyết minh"
                           >
                              {playingAudioId === loc.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                           </button>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{loc.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{loc.description}</p>
                      
                      <div className="mt-3 flex items-center text-xs font-bold text-cyan-600 group-hover:text-ocean-blue group-hover:underline">
                         <span>Hỏi chi tiết</span>
                         <ArrowRight size={12} className="ml-1" />
                      </div>
                   </div>
                </div>
              ))}
              
              {/* End Marker */}
               <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-ocean-dark z-10 shadow-lg ring-2 ring-white"></div>
                  <p className="text-xs text-slate-500 italic bg-white/50 inline-block px-2 rounded">Hành trình mở ra kỷ nguyên độc lập...</p>
               </div>
           </div>
        </div>
      </div>

      {/* Backdrop for Drawers */}
      {(isHistoryOpen || isScheduleOpen) && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-[55] backdrop-blur-sm transition-opacity"
          onClick={() => {
            setIsHistoryOpen(false);
            setIsScheduleOpen(false);
          }}
        ></div>
      )}

      {/* HEADER */}
      <header className="glass-panel-light px-4 md:px-6 py-3 shadow-sm flex flex-col md:flex-row items-center justify-between z-50 sticky top-0 relative transition-all">
         
         {/* Left: Logo & Title */}
         <div className="flex items-center w-full md:w-auto mb-3 md:mb-0 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean-blue to-deep-navy rounded-xl rotate-3 flex items-center justify-center text-white shadow-lg shadow-blue-300/50 border border-white/50 mr-4 transition-transform hover:rotate-6 flex-shrink-0">
              <Anchor size={22} strokeWidth={2.5} className="transform -rotate-3" />
            </div>
            <div className="flex flex-col">
               <h1 className="font-bold text-xl leading-none tracking-tight text-slate-800 drop-shadow-sm whitespace-nowrap">
                 Trợ lý Hải Trình
               </h1>
               <p className="text-xs text-ocean-blue font-semibold tracking-wide mt-1 uppercase bg-blue-50 inline-block px-1 rounded self-start">Vươn tầm tri thức</p>
            </div>
         </div>

         {/* Right: Action Buttons - Fixed Layout */}
         <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide px-1 justify-start md:justify-end">
             <GlowingButton 
                onClick={() => {
                  setIsScheduleOpen(!isScheduleOpen);
                  setIsHistoryOpen(false);
                }}
                active={isScheduleOpen}
                icon={<Calendar size={18} />}
                label="Lịch trình"
             />
             
             <GlowingButton 
                onClick={() => {
                  setIsHistoryOpen(!isHistoryOpen);
                  setIsScheduleOpen(false);
                }}
                active={isHistoryOpen}
                icon={<List size={18} />}
                label={`Lịch sử`}
             />

             <GlowingButton 
                onClick={() => setIsHelpOpen(true)}
                icon={<HelpCircle size={18} />}
                label="Hướng dẫn"
                title="Xem hướng dẫn sử dụng"
             />

             {currentUser ? (
               <GlowingButton 
                 onClick={handleLogout}
                 icon={<User size={18} />}
                 label={currentUser.fullName.split(' ')[0]}
                 className="min-w-[120px] border border-blue-100"
               />
             ) : (
               <GlowingButton 
                 onClick={() => setIsAuthModalOpen(true)}
                 icon={<Lock size={18} />}
                 className="border border-blue-100"
               />
             )}
         </div>
      </header>

      {/* MAIN CHAT AREA */}
      <div className={`flex-grow flex flex-col w-full max-w-5xl mx-auto overflow-hidden relative transition-all duration-300 ${isScheduleOpen ? 'md:pr-96' : ''} ${isHistoryOpen ? 'md:pl-80' : ''}`}>
          <div className="flex-grow overflow-y-auto px-4 py-6 md:px-8 custom-scrollbar">
             
             {/* SUGGESTION GRID */}
             {messages.length <= 2 && (
               <div className="mb-10 animate-fade-in-up">
                  <h3 className="text-ocean-blue font-bold text-xs uppercase tracking-wider mb-4 ml-1 flex items-center gap-2">
                    <Star size={14} className="fill-current animate-pulse" /> Câu hỏi phổ biến (1911 - 1941)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {sampleQuestions.map((q, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:shadow-blue-200/50 hover:border-ocean-blue/50 text-left text-slate-700 text-[15px] font-medium transition-all hover:-translate-y-1 group flex items-center justify-between relative overflow-hidden"
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span className="relative z-10">{q}</span>
                           <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 text-ocean-blue relative z-10">
                              <Send size={16} />
                           </span>
                        </button>
                     ))}
                  </div>
               </div>
             )}

             {/* MESSAGES */}
             <div className="space-y-6 pb-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col animate-fade-in-up w-full ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}>
                        <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md relative z-10 transition-transform duration-300 hover:scale-110
                                ${msg.role === Role.USER 
                                ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'
                                : 'bg-gradient-to-br from-ocean-blue to-deep-navy text-white ring-2 ring-white ring-offset-2 ring-offset-blue-50'}`
                            }>
                                {msg.role === Role.USER 
                                    ? <User size={20} />
                                    : (
                                      <>
                                        <Ship size={20} className="fill-current" />
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                        </span>
                                      </>
                                    )
                                }
                            </div>

                            {/* Bubble */}
                            <div className={`p-5 rounded-2xl shadow-sm text-[15px] relative group transition-all duration-300 backdrop-blur-sm
                                ${msg.role === Role.USER
                                ? 'bg-gradient-to-br from-ocean-blue to-cyan-600 text-white rounded-tr-none shadow-blue-200 shadow-lg'
                                : 'bg-white border border-blue-50 text-slate-700 rounded-tl-none hover:shadow-md'
                                }
                            `}>
                                {/* Decoration for Bot Message */}
                                {msg.role === Role.MODEL && (
                                    <Sparkles size={16} className="absolute -top-3 -left-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm animate-pulse" />
                                )}
                                <MessageBubble text={msg.text} role={msg.role} />
                            </div>
                        </div>

                        {/* FOLLOW-UP SUGGESTIONS (Only for Bot Messages) */}
                        {msg.role === Role.MODEL && msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 ml-14 max-w-[80%] animate-fade-in-up animation-delay-500">
                                {msg.suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(suggestion)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-cyan-100 text-cyan-700 text-xs font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-cyan-50 hover:border-cyan-200 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <Lightbulb size={12} className="text-yellow-500" />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                   <div className="flex w-full justify-start animate-fade-in-up">
                      <div className="flex gap-4 max-w-[80%]">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-blue to-deep-navy flex items-center justify-center text-white ring-2 ring-white ring-offset-2 ring-offset-blue-50 shadow-md">
                            <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                         </div>
                         <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-blue-50 shadow-md flex items-center gap-2">
                            <span className="w-2 h-2 bg-ocean-blue rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-ocean-blue rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-ocean-blue rounded-full animate-bounce delay-200"></span>
                         </div>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
             </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white/70 backdrop-blur-xl border-t border-blue-100 relative z-20 shadow-lg">
             <div className="max-w-4xl mx-auto flex gap-3 items-center">
                 <button 
                   onClick={() => startNewChat()}
                   className="p-3 text-slate-400 hover:text-ocean-blue hover:bg-blue-50 rounded-full transition-all hover:scale-110 active:scale-90 shadow-sm border border-transparent hover:border-blue-100" 
                   title="Tạo cuộc hội thoại mới"
                 >
                    <Plus size={20} />
                 </button>
                 
                 <div className="flex-grow bg-white rounded-2xl shadow-inner border border-slate-200 flex items-center p-1.5 focus-within:ring-2 focus-within:ring-ocean-blue/30 focus-within:border-ocean-blue transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentUser ? `Nhập câu hỏi của ${currentUser.fullName}...` : "Nhập nội dung câu hỏi..."}
                        className="flex-grow bg-transparent border-none outline-none px-4 py-2 text-slate-700 placeholder-slate-400"
                        disabled={isLoading}
                    />
                    <div className="relative group">
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputText.trim() || isLoading}
                            title="Gửi tin nhắn"
                            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group
                                ${!inputText.trim() || isLoading 
                                ? 'bg-slate-100 text-slate-400' 
                                : 'bg-gradient-to-r from-ocean-blue to-cyan-500 text-white shadow-lg shadow-blue-300/50 hover:shadow-cyan-400/50 active:scale-95'
                                }`}
                        >
                             {/* Shimmer Effect */}
                            {inputText.trim() && !isLoading && (
                               <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer-slide bg-gradient-to-r from-transparent via-white/40 to-transparent z-0" />
                            )}
                            <Send size={20} className={`relative z-10 ${isLoading ? 'opacity-0' : ''}`} />
                            {isLoading && <div className="absolute w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin z-20"></div>}
                        </button>
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform scale-90 group-hover:scale-100 whitespace-nowrap z-50">
                            Gửi tin nhắn
                            {/* Little arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                    </div>
                 </div>
             </div>
             <p className="text-center text-xs text-slate-400 mt-3 font-medium flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> 
                Hệ thống sẵn sàng phục vụ
             </p>
          </div>
      </div>
    </div>
  );
};
