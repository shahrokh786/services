// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Core Layout & Routing
import Header from './components/Header';
import Footer from './components/Footer';
import ProviderRoute from './components/ProviderRoute';
// --- CORRECTED Import Path (Relative from src/ to src/components/) ---
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; // Path relative to src/

// Page Imports
// ... (Home, About, Contact, SearchPage, ServiceDetail, Register, Login) ...
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchPage from './pages/SearchPage';
import ServiceDetail from './pages/ServiceDetail';
import Register from './pages/Register';
import Login from './pages/Login';
// ... (Profile, MyBookings) ...
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
// ... (InboxPage) ...
import InboxPage from './pages/InboxPage';
// ... (Provider Pages) ...
import ProviderDashboard from './pages/ProviderDashboard';
import CreateService from './pages/CreateService';
import MyServices from './pages/MyServices';
import EditService from './pages/EditService';
import ManageBookings from './pages/ManageBookings';


// --- Basic ProtectedRoute Implementation (Moved to separate file) ---
// const BasicProtectedRoute = () => { ... }; // Removed inline definition


function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        {/* --- Public Routes --- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/* --- General Logged-In User Routes --- */}
                         <Route element={<ProtectedRoute />}> {/* Use the imported component */}
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                            <Route path="/inbox" element={<InboxPage />} />
                         </Route>

                        {/* --- Provider-Only Routes --- */}
                        <Route element={<ProviderRoute />}>
                            <Route path="/dashboard" element={<ProviderDashboard />} />
                            <Route path="/create-service" element={<CreateService />} />
                            <Route path="/my-services" element={<MyServices />} />
                            <Route path="/edit-service/:id" element={<EditService />} />
                            <Route path="/manage-bookings" element={<ManageBookings />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<div className="text-center py-16"><h1>404</h1><p>Not Found</p></div>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;