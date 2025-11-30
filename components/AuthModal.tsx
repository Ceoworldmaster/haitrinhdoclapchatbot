import React, { useState } from 'react';
import { Lock, X, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await authService.loginWithGoogle();
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setError(result.message);
      }
    } catch (e: any) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-white/50 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 text-center relative border-b border-blue-50">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 bg-white p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
          
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-ocean-blue to-cyan-500 rounded-2xl rotate-3 flex items-center justify-center text-white shadow-xl">
                <Lock size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-800">
            Đăng Nhập
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Mở khóa đầy đủ tính năng trợ lý ảo
          </p>
        </div>

        {/* Form */}
        <div className="p-8 bg-white">
          <div className="space-y-5">
             <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="text-ocean-blue flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-slate-600 leading-relaxed">
                   Chúng tôi sử dụng bảo mật tiêu chuẩn cao để bảo vệ dữ liệu hành trình cá nhân của bạn.
                </p>
             </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-ocean-blue rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Tiếp tục với Google</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium animate-pulse">
                {error}
              </div>
            )}
            
            <p className="text-center text-[10px] text-slate-400 mt-4">
                Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng và chính sách quyền riêng tư.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};