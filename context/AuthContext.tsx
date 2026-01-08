import React, { createContext, useContext, useState } from "react";
import { apiService } from "../services/apiService";
import { User, AuthResponse, CommonResponse } from "../interfaces/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<AuthResponse>;
  register: (userData: any) => Promise<CommonResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider to manage user sessions and state.
 * Integrated with ApiService for centralized network and token management.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Industry standard login flow with state updates
  const login = async (credentials: any): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        // Sync the token with the centralized API service
        apiService.setToken(response.token);
      }
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: "An unexpected error occurred during login." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Centralized registration handler
  const register = async (userData: any): Promise<CommonResponse> => {
    setIsLoading(true);
    try {
      return await apiService.register(userData);
    } catch (error) {
      return { 
        success: false, 
        message: "Registration failed. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Resets session and clears local service token
  const logout = () => {
    setUser(null);
    setToken(null);
    apiService.setToken(""); 
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing authentication state and methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};