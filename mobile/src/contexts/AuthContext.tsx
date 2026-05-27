import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface AuthContextData {
  token: string | null;
  userName: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token when app loads
    const loadStorageData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('viaAlerta_token');
        if (storedToken) {
          setToken(storedToken);
          await fetchUserName(storedToken);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const fetchUserName = async (activeToken: string) => {
    try {
      const res = await axios.get('http://192.168.1.133:3333/users/me', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      setUserName(res.data.user?.name || null);
    } catch (e) {
      console.log('Could not fetch user name', e);
    }
  };

  const signIn = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('viaAlerta_token', newToken);
      setToken(newToken);
      await fetchUserName(newToken);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('viaAlerta_token');
      setToken(null);
      setUserName(null);
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, userName, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
