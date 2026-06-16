import React, { createContext, useContext } from 'react';
import { useLanSession } from './useLanSession';

type LanSession = ReturnType<typeof useLanSession>;

const LanContext = createContext<LanSession | null>(null);

export const LanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lan = useLanSession();
  return <LanContext.Provider value={lan}>{children}</LanContext.Provider>;
};

export const useLan = (): LanSession => {
  const ctx = useContext(LanContext);
  if (!ctx) throw new Error('useLan doit être utilisé à l\'intérieur de <LanProvider>');
  return ctx;
};
