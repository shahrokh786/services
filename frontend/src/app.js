import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- CORE LAYOUT & ROUTING COMPONENTS ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProviderRoute from './components/ProviderRoute';

// --- PAGE COMPONENTS ("City Districts") ---
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchPage from './pages/SearchPage';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile';
import ProviderAuth from './pages/ProviderAuth';
import ProviderDashboard from './pages/ProviderDashboard';
import CreateService from './pages/CreateService';
import MyServices from './pages/MyServices';
import EditService from './pages/EditService';
import MyBookings from './pages/MyBookings'; 
import ManageBookings from './pages/ManageBookings';
import InboxPage from './pages/InboxPage'; // <-- 1. IMPORT THE NEW INBOX PAGE

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* --- Public Roads (Accessible to Everyone) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/provider-auth" element={<ProviderAuth />} />
            
            {/* --- General Logged-In User Roads --- */}
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* --- Private Roads (Accessible only to Providers) --- */}
            <Route element={<ProviderRoute />}>
              <Route path="/dashboard" element={<ProviderDashboard />} />
              <Route path="/create-service" element={<CreateService />} />
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/edit-service/:id" element={<EditService />} />
              <Route path="/manage-bookings" element={<ManageBookings />} />
              
              {/* 2. ADD THE NEW, PROTECTED ROUTE FOR THE PROVIDER'S INBOX */}
              <Route path="/inbox" element={<InboxPage />} />
            </Route>

            {/* --- Fallback Route for unknown roads --- */}
            <Route path="*" element={
              <div className="text-center py-16">
                <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;

