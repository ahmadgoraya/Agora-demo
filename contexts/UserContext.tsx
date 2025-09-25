import React, { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  username: string;
  channel: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, channel: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, channel: string) => {
    setUser({ username, channel });
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
