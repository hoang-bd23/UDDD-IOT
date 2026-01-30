/**
 * Firebase Auth Service
 * Handles user authentication with Firebase
 */

import auth from '@react-native-firebase/auth';

export const firebaseAuth = {
    /**
     * Get current user
     */
    getCurrentUser: () => {
        return auth().currentUser;
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn: () => {
        return !!auth().currentUser;
    },

    /**
     * Register new user with email and password
     */
    register: async (email, password, displayName) => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // Update display name
            if (displayName) {
                await userCredential.user.updateProfile({
                    displayName: displayName,
                });
            }

            return {
                success: true,
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: displayName || userCredential.user.email.split('@')[0],
                },
            };
        } catch (error) {
            console.error('Firebase register error:', error);
            return {
                success: false,
                error: getErrorMessage(error.code),
            };
        }
    },

    /**
     * Login with email and password
     */
    login: async (email, password) => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);

            return {
                success: true,
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
                },
            };
        } catch (error) {
            console.error('Firebase login error:', error);
            return {
                success: false,
                error: getErrorMessage(error.code),
            };
        }
    },

    /**
     * Logout current user
     */
    logout: async () => {
        try {
            await auth().signOut();
            return { success: true };
        } catch (error) {
            console.error('Firebase logout error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send password reset email
     */
    resetPassword: async (email) => {
        try {
            await auth().sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error('Firebase reset password error:', error);
            return {
                success: false,
                error: getErrorMessage(error.code),
            };
        }
    },

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChanged: (callback) => {
        return auth().onAuthStateChanged(callback);
    },
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Email này đã được sử dụng';
        case 'auth/invalid-email':
            return 'Email không hợp lệ';
        case 'auth/weak-password':
            return 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
        case 'auth/user-not-found':
            return 'Không tìm thấy tài khoản với email này';
        case 'auth/wrong-password':
            return 'Mật khẩu không đúng';
        case 'auth/too-many-requests':
            return 'Quá nhiều lần thử, vui lòng thử lại sau';
        case 'auth/network-request-failed':
            return 'Lỗi kết nối mạng';
        case 'auth/user-disabled':
            return 'Tài khoản đã bị vô hiệu hóa';
        default:
            return 'Đã xảy ra lỗi, vui lòng thử lại';
    }
}

export default firebaseAuth;
