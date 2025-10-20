import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// 1. Import BOTH of our global "Government" providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import './index.css'; // Import the global stylesheet

// This sets the global default for axios to send cookies with every request.
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Wrap the <App /> in BOTH providers.
// The order matters: AuthProvider should be on the outside so SocketProvider
// can know who the user is when it establishes a connection.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);

