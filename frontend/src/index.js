import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // <-- THIS IS THE CRITICAL FIX THAT WAS MISSING

// --- GLOBAL CONFIGURATION ---
// This ensures that every backend request will automatically include
// the necessary login cookies.
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application, wrapped in the AuthProvider for global state.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

