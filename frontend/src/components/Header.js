import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBox from './SearchBox';

const Header = () => {
    // The useAuth() hook provides a LIVE connection to the user state.
    // When `user` changes in the context, this component will automatically re-render.
    const { user, login, register, logout } = useAuth();
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'customer' });
    
    // --- THIS IS THE UPGRADED, INTELLIGENT LOGIN HANDLER ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        // 1. Await the result from our central login function.
        //    It will return the full user object on success, or null on failure.
        const loggedInUser = await login(loginData);

        // 2. Check if the login was successful and perform role-based redirection.
        if (loggedInUser) {
            setShowLogin(false); // Close the modal first.
            if (loggedInUser.role === 'provider') {
                // If the user is a provider, navigate them directly to their dashboard.
                navigate('/dashboard'); 
            } else {
                // If they are a customer, they can stay on the current page or go home.
                // The re-render will automatically show the correct header buttons.
            }
        }
        // If login fails, the context already shows an alert, and we do nothing here.
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const success = await register(registerData);
        if (success) {
            setShowRegister(false);
            setShowLogin(true); // Guide the user to log in after registering.
        }
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-bold">LocalServiceHub</Link>
                        <div className="hidden md:block"><SearchBox /></div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Home</Link>
                            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">About</Link>
                            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Contact</Link>
                            {/* This JSX block will now correctly re-render on login/logout */}
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    {user.role === 'provider' && <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Dashboard</Link>}
                                    <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Profile</Link>
                                    <button onClick={handleLogoutClick} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setShowLogin(true)} className="border border-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600">Login</button>
                                    <button onClick={() => setShowRegister(true)} className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">Sign Up</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MODALS WITH FULL CONTENT AND CLOSE FUNCTIONALITY --- */}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setShowLogin(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>
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
            {showRegister && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setShowRegister(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign Up</h2>
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <input type="text" placeholder="Full Name" required value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <input type="email" placeholder="Email" required value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                            <input type="password" placeholder="Password" required value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
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

