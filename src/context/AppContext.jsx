import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import {
  demoUser,
  initialQuests,
} from '../data/dummyData';

import {
  jobsReducer,
  settleDue,
} from '../features/pekerjaan/jobsState';

const AppContext = createContext(null);
const STORAGE_KEY = 'kampusgig-jobs-taken-v1';

function loadState() {
  const awal = {
    quests: initialQuests,
    transactions: [],
  };

  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (
      saved &&
      Array.isArray(saved.quests) &&
      Array.isArray(saved.transactions)
    ) {
      // Selesaikan verifikasi yang waktunya sudah lewat saat dibuka lagi.
      return settleDue(saved, Date.now());
    }
  } catch {
    // Jika data tidak tersedia/rusak, gunakan data awal.
  }

  return awal;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(demoUser);
  const [messages, setMessages] = useState([]);
  const [storageError, setStorageError] = useState('');

  const [state, dispatch] = useReducer(
    jobsReducer,
    undefined,
    loadState
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      setStorageError('');
    } catch {
      setStorageError(
        'Penyimpanan browser penuh atau tidak tersedia. ' +
        'Perubahan hanya tersimpan selama aplikasi terbuka.'
      );
    }
  }, [state]);

  useEffect(() => {
    const menunggu = state.quests.filter(
      (quest) =>
        quest.status === 'menunggu_verifikasi' &&
        Number.isFinite(quest.verifyAt)
    );

    if (menunggu.length === 0) return;

    const waktuTerdekat = Math.min(
      ...menunggu.map((quest) => quest.verifyAt)
    );

    const timer = setTimeout(() => {
      dispatch({
        type: 'settle',
        now: Date.now(),
      });
    }, Math.max(0, waktuTerdekat - Date.now()));

    return () => clearTimeout(timer);
  }, [state.quests]);

  const setQuests = useCallback((value) => {
    dispatch({
      type: 'quests',
      value,
    });
  }, []);

  const setTransactions = useCallback((value) => {
    dispatch({
      type: 'transactions',
      value,
    });
  }, []);

  const kirimBukti = useCallback((payload) => {
    dispatch({
      type: 'proof',
      payload: {
        ...payload,
        now: Date.now(),
      },
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        quests: state.quests,
        setQuests,
        messages,
        setMessages,
        transactions: state.transactions,
        setTransactions,
        kirimBukti,
        storageError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error(
      'useApp harus berada di dalam AppProvider'
    );
  }

  return value;
}