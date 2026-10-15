import React from 'react';
import { createContext, useContext, useState } from 'react';
import { demoUser, initialQuests } from '../data/dummyData';
const AppContext = createContext(null);
export function AppProvider({ children }) {
  // Infrastruktur bersama saja. Fungsi bisnis dibuat pemilik fitur.
  // user adalah profil demo untuk preview; belum ada autentikasi.
  const [user, setUser] = useState(demoUser);
  const [quests, setQuests] = useState(initialQuests);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  return <AppContext.Provider value={{ user, setUser, quests, setQuests, messages, setMessages, transactions, setTransactions }}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp harus berada di dalam AppProvider');
  return value;
}
