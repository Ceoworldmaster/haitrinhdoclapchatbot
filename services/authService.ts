import { auth, googleProvider, database } from './firebase';
import { User } from '../types';

export const authService = {
  // Login with Google
  loginWithGoogle: async (): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!auth || !googleProvider) return { success: false, message: "Dịch vụ chưa sẵn sàng" };
    
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        if (user) {
            // Ensure user profile exists in DB
            await database?.ref(`users/${user.uid}/profile`).update({
                email: user.email,
                fullName: user.displayName,
                lastLogin: Date.now()
            });

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

  // Register with Email/Password
  registerWithEmailAndPassword: async (email: string, password: string, fullName: string): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!auth) return { success: false, message: "Dịch vụ chưa sẵn sàng" };

    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        const user = result.user;
        
        if (user) {
            // Update Auth Profile
            await user.updateProfile({
                displayName: fullName
            });

            // Create User Record in Database
            await database?.ref(`users/${user.uid}/profile`).set({
                email: email,
                fullName: fullName,
                joinedAt: Date.now()
            });

            return {
                success: true,
                message: "Đăng ký thành công",
                user: {
                    id: user.uid,
                    username: email,
                    fullName: fullName,
                    joinedAt: Date.now()
                }
            };
        }
        return { success: false, message: "Không thể tạo tài khoản" };
    } catch (error: any) {
        console.error("Registration error:", error);
        let msg = "Đăng ký thất bại";
        if (error.code === 'auth/email-already-in-use') msg = "Email này đã được sử dụng.";
        if (error.code === 'auth/weak-password') msg = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
        return { success: false, message: msg };
    }
  },

  // Login with Email/Password
  loginWithEmailAndPassword: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!auth) return { success: false, message: "Dịch vụ chưa sẵn sàng" };

    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        const user = result.user;
        
        if (user) {
            // Update last login
            await database?.ref(`users/${user.uid}/profile`).update({
                lastLogin: Date.now()
            });

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
        return { success: false, message: "Lỗi xác thực" };
    } catch (error: any) {
        console.error("Login error:", error);
        let msg = "Đăng nhập thất bại";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') msg = "Email hoặc mật khẩu không đúng.";
        return { success: false, message: msg };
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