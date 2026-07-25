import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminDashboard onLogout={() => {
      // Redirect back to main site on exit
      window.location.href = 'http://localhost:5175/';
    }} />
    <Analytics />
  </React.StrictMode>
);
