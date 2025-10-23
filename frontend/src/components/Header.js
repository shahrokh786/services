// File: frontend/src/components/Header.js

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Use correct relative paths
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Mail } from 'lucide-react';
import SearchBox from './SearchBox'; // Assuming SearchBox exists and is imported correctly

const Header = () => {
    const { user, login, register, logout } = useAuth();
    // Add fallback for initial render
    const { notifications, clearNotificationsByType } = useSocket() || {};
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'customer' });

    // Calculate unread message count
    const unreadMessageCount = useMemo(() => {
        if (!notifications) return 0;
        return notifications.filter(n => n.type === 'message').length;
    }, [notifications]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = await login(loginData);
        if (loggedInUser) {
            setShowLogin(false);
            if (loggedInUser.role === 'provider') {
                navigate('/dashboard');
            }
            // Customer stays on current page, header re-renders
        }
        // Error handling is in AuthContext
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const success = await register(registerData);
        if (success) {
            setShowRegister(false);
            setShowLogin(true); // Guide to login after register
        }
        // Error handling is in AuthContext
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    // Clear message notifications on Inbox click
    const handleInboxClick = () => {
        if (clearNotificationsByType) {
            clearNotificationsByType('message');
        }
    };

    return (
        <>
            <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-bold">LocalServiceHub</Link>
                        <div className="hidden md:block"><SearchBox /></div>
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Public Links */}
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Home</Link>
                            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">About</Link>
                            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Contact</Link>

                            {/* Conditional Links */}
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    {/* Provider Links */}
                                    {user.role === 'provider' && (
                                        <>
                                            <Link
                                                to="/inbox"
                                                onClick={handleInboxClick}
                                                className="relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                            >
                                                <Mail className="h-5 w-5" />
                                                <span>Inbox</span>
                                                {unreadMessageCount > 0 && (
                                                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-blue-600" />
                                                )}
                                            </Link>
                                            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Dashboard</Link>
                                        </>
                                    )}
                                    {/* All Logged-in User Links */}
                                    <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Profile</Link>
                                    <button onClick={handleLogoutClick} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                                </div>
                            ) : (
                                // Logged-out User Links
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setShowLogin(true)} className="border border-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600">Login</button>
                                    <button onClick={() => setShowRegister(true)} className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">Sign Up</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- RESTORED MODALS --- */}
            {/* Login Modal */}
             {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setShowLogin(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-900" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">Login</h2>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <input type="email" placeholder="Email" required value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <input type="password" placeholder="Password" required value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button" onClick={() => setShowLogin(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
             {/* Register Modal */}
             {showRegister && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setShowRegister(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-900" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <input type="text" placeholder="Full Name" required value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <input type="email" placeholder="Email" required value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <input type="password" placeholder="Password" required value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            {/* --- ADDED Role selection to Register Modal --- */}
                            <div className="pt-2">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Register as a:</label>
                                 <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="role" value="customer" checked={registerData.role === 'customer'} onChange={(e) => setRegisterData({...registerData, role: e.target.value})} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"/>
                                        <span className="ml-2 text-sm text-gray-700">Customer</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="role" value="provider" checked={registerData.role === 'provider'} onChange={(e) => setRegisterData({...registerData, role: e.target.value})} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"/>
                                        <span className="ml-2 text-sm text-gray-700">Provider</span>
                                    </label>
                                 </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button" onClick={() => setShowRegister(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
        </>
    );
};

export default Header;