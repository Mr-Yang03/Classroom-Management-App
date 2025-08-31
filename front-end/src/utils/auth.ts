export interface InstructorData {
  id: string;
  name: string;
  phone: string;
}

export const authUtils = {
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('user-token');
    return !!token;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user-token');
  },

  getInstructorData: (): InstructorData | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('user-data');
    return data ? JSON.parse(data) : null;
  },

  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-data');
    localStorage.removeItem('role');
  },

  isTokenValid: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  },

  requireAuth: (): boolean => {
    if (typeof window === 'undefined') return true;
    
    const isAuth = authUtils.isAuthenticated();
    const isValid = authUtils.isTokenValid();
    
    if (!isAuth || !isValid) {
      authUtils.clearAuth();
      return false;
    }
    
    return true;
  }
};
