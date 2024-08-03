import React, { createContext, useState } from 'react';
import { User } from '../types/user';

interface ContextData {
  user: User | null;
  setUser: (user: User | null) => void;
}

const InitialValues: ContextData = {
  user: null,
  setUser: () => {},
};

export const AuthContext = createContext<ContextData>(InitialValues);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
