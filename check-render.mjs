import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
const server = await createServer({ server: { middlewareMode: true } });
try {
 const { default: App } = await server.ssrLoadModule('/src/App.jsx');
 const { AppProvider } = await server.ssrLoadModule('/src/context/AppContext.jsx');
 const originalError = console.error;
 console.error = (...args) => { if (!String(args[0]).includes('useLayoutEffect')) originalError(...args); };
 for (const path of ['/', '/quest', '/profil', '/tidak-ada']) {
  const html = renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(AppProvider, null, React.createElement(App))));
  if (!html.includes('Beranda') || !html.includes('Profil')) throw new Error('Render kosong: '+path);
  console.log('PASS render '+path);
 }
 console.error = originalError;
} finally { await server.close(); }
