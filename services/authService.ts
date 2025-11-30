import { auth, googleProvider } from './firebase';
import { User } from '../types';

export const authService = {
  loginWithGoogle: async (): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!auth || !googleProvider) return { success: false, message: "Dịch vụ chưa sẵn sàng" };
    
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        if (user) {
            return {
                success: true,
                message: "Đăng nhập thành công",
                user: {
                    id: user.uid,
                    username: user.email || '',
                    fullName: user.displayName || 'Người dùng',
                    joinedAt: Date.now()
                }
            };
        }
        return { success: false, message: "Không tìm thấy thông tin người dùng" };
    } catch (error: any) {
        console.error("Google login error:", error);
        return { success: false, message: error.message || "Đăng nhập thất bại" };
    }
  },

  logout: async () => {
    if (auth) await auth.signOut();
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
      if (!auth) return () => {};
      return auth.onAuthStateChanged((firebaseUser: any) => {
          if (firebaseUser) {
              callback({
                  id: firebaseUser.uid,
                  username: firebaseUser.email || '',
                  fullName: firebaseUser.displayName || 'Người dùng',
                  joinedAt: Date.now()
              });
          } else {
              callback(null);
          }
      });
  }
};
