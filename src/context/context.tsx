import React, { createContext, useState } from 'react';
import { User } from '../types/user';

interface ContextData {
  user: User | null;
  setUser: (user: User | null) => void;
  step: string;
  setStep: (step: string) => void;
}

const InitialValues: ContextData = {
  user: null,
  setUser: () => {},
  step: `one`,
  setStep: () => {},
};

export const Context = createContext<ContextData>(InitialValues);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<string>(`one`);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        step,
        setStep,
      }}
    >
      {children}
    </Context.Provider>
  );
};
