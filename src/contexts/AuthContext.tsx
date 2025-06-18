
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const AdminEmail = import.meta.env.VITE_ADMIN_LOGIN;
  const AdminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // Check for existing authentication on mount
  useEffect(() => {
    const savedAuth = Cookies.get('auth_token');
    const savedUser = Cookies.get('user_email');
    
    if (savedAuth && savedUser) {
      setIsAuthenticated(true);
      setUser({ email: savedUser });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication - in a real app, this would call an API
    if (email === AdminEmail && password === AdminPassword) {
      setIsAuthenticated(true);
      setUser({ email });
      
      // Save to cookies (expires in 7 days)
      Cookies.set('auth_token', 'authenticated', { expires: 7 });
      Cookies.set('user_email', email, { expires: 7 });
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Remove cookies
    Cookies.remove('auth_token');
    Cookies.remove('user_email');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
