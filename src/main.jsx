import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { addCollection } from '@iconify/react';
import lucideIcons from '@iconify-json/lucide/icons.json';
import { AppProvider } from './context/AppContext';
import App from './App';
import './index.css';
import './features/akun/akun.css';

addCollection(lucideIcons);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
