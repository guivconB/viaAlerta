import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token when app loads
    const loadStorageData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('viaAlerta_token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('viaAlerta_token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('viaAlerta_token');
      setToken(null);
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
