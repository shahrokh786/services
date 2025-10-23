// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- CORE LAYOUT & ROUTING COMPONENTS ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProviderRoute from './components/ProviderRoute'; // Protects provider-only routes

// --- PAGE COMPONENTS ---
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchPage from './pages/SearchPage';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile'; // General user profile (can view/edit basic info)
// import ProviderAuth from './pages/ProviderAuth'; // Likely deprecated if using unified login/register
import ProviderDashboard from './pages/ProviderDashboard'; // Provider-specific dashboard
import CreateService from './pages/CreateService'; // Provider creates a service listing
import MyServices from './pages/MyServices'; // Provider views their own listings
import EditService from './pages/EditService'; // Provider edits a listing
import MyBookings from './pages/MyBookings'; // Customer views their bookings
import ManageBookings from './pages/ManageBookings'; // Provider manages bookings for their services
import InboxPage from './pages/InboxPage'; // Provider inbox
// --- ADDED: Authentication Pages ---
import Register from './pages/Register';
import Login from './pages/Login'; // We will create this next

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-grow">
                    <Routes>
                        {/* --- Public Routes (Accessible to Everyone) --- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        {/* --- ADDED: Public Auth Routes --- */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/* --- General Logged-In User Routes (Customer or Provider) --- */}
                        {/* We might need a general 'ProtectedRoute' here later */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        {/* <Route path="/provider-auth" element={<ProviderAuth />} /> */} {/* Maybe remove? */}


                        {/* --- Private Routes (Accessible only to 'provider' role) --- */}
                        <Route element={<ProviderRoute />}>
                            <Route path="/dashboard" element={<ProviderDashboard />} />
                            <Route path="/create-service" element={<CreateService />} />
                            <Route path="/my-services" element={<MyServices />} />
                            <Route path="/edit-service/:id" element={<EditService />} />
                            <Route path="/manage-bookings" element={<ManageBookings />} />
                            <Route path="/inbox" element={<InboxPage />} />
                        </Route>

                        {/* --- Fallback Route --- */}
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