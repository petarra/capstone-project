import React, { createContext, useContext, useState } from 'react';
import { demoUser, initialQuests } from '../data/dummyData';

const AppContext = createContext(null);
const AUTH_USER_KEY = 'kampusgig_auth_user';
const REGISTERED_USERS_KEY = 'kampusgig_registered_users';

const defaultAccounts = [
  {
    id: 'user-demo-mahasiswa',
    name: 'Mahasiswa UNTAN',
    role: 'Mahasiswa',
    email: 'mahasiswa@untan.ac.id',
    password: 'password123',
    nim: '',
    phone: '+62 81234567890',
  },
  {
    id: 'user-demo-dosen',
    name: 'Dr. Dosen UNTAN',
    role: 'Dosen',
    email: 'dosen@untan.ac.id',
    password: 'password123',
    nim: '',
    phone: '+62 81234567890',
  },
  {
    id: 'user-demo-staff',
    name: 'Staff Kampus UNTAN',
    role: 'Staff Kampus',
    email: 'staff@untan.ac.id',
    password: 'password123',
    nim: '',
    phone: '+62 81234567890',
  },
];

function readRegisteredUsers() {
  try {
    if (typeof window === 'undefined') return [];
    const savedUsers = JSON.parse(window.localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    return Array.isArray(savedUsers) ? savedUsers : [];
  } catch {
    return [];
  }
}

function saveAuthUser(user) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  } catch {
    // Authentication remains available for the current session if storage is blocked.
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === 'undefined') return demoUser;
      const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      return parsedUser && typeof parsedUser === 'object' && !Array.isArray(parsedUser)
        ? parsedUser
        : null;
    } catch {
      return null;
    }
  });
  const [quests, setQuests] = useState(initialQuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const login = ({ email, password }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const account = [...defaultAccounts, ...readRegisteredUsers()].find(
      (savedAccount) => savedAccount.email?.trim().toLowerCase() === normalizedEmail
    );

    if (!account) {
      return {
        success: false,
        message: 'Akun belum terdaftar. Silakan buat akun terlebih dahulu.',
      };
    }

    if (account.password !== password) {
      return {
        success: false,
        message: 'Kata sandi salah. Silakan periksa kembali kata sandi Anda.',
      };
    }

    const authenticatedUser = { ...account };
    delete authenticatedUser.password;
    setUser(authenticatedUser);
    saveAuthUser(authenticatedUser);
    return { success: true, user: authenticatedUser };
  };

  const register = ({ name, role, email, password, phone, nim }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name?.trim() || 'Pengguna UNTAN',
      role: role || 'Mahasiswa',
      email: email?.trim() || 'mahasiswa@untan.ac.id',
      phone: phone || '',
      nim: nim || '',
    };

    try {
      const savedUsers = readRegisteredUsers();
      savedUsers.push({ ...newUser, password });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(savedUsers));
      }
    } catch {
      // Registration can still continue for the current session if storage is blocked.
    }

    setUser(newUser);
    saveAuthUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // The in-memory session is cleared even when storage is unavailable.
    }
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...(user || {}), ...updatedFields };
    setUser(updatedUser);
    saveAuthUser(updatedUser);
    return updatedUser;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        updateUser,
        quests,
        setQuests,
        searchQuery,
        setSearchQuery,
        messages,
        setMessages,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp harus berada di dalam AppProvider');
  return value;
}
