import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProviderAuth = () => {
    // We get the master login and register functions from our central AuthContext
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [isLoginView, setIsLoginView] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '', email: '', password: '', phone: '', role: 'provider'
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        // Call the central login function and wait for the result
        const loggedInUser = await login(loginData, true); // The 'true' flag suppresses the generic alert

        // Now, we check the result
        if (loggedInUser) {
            // The login was successful, and we have the user object. Now, check the role.
            if (loggedInUser.role === 'provider') {
                alert('Provider login successful!');
                navigate('/dashboard'); // It's a provider, so redirect to the dashboard.
            } else {
                alert('Login failed. This is not a provider account.');
                // We don't navigate, so the user stays on the login page.
            }
        }
        // If the login failed (wrong password, etc.), the login function itself will show an alert.
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const success = await register(registerData);
        if (success) {
            // After successful registration, switch to the login view so they can log in.
            setIsLoginView(true);
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    {isLoginView ? 'Provider Portal' : 'Provider Sign Up'}
                </h1>
                
                {isLoginView ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                         <input type="email" placeholder="Email" required value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                         <input type="password" placeholder="Password" required value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                         <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md">Login</button>
                         <p className="text-center text-sm">Not a provider yet? <span onClick={() => setIsLoginView(false)} className="text-blue-600 cursor-pointer font-semibold">Sign Up</span></p>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                        <input type="text" placeholder="Full Name or Company" required value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                        <input type="email" placeholder="Email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                        <input type="password" placeholder="Password" required value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md">Create Account</button>
                        <p className="text-center text-sm">Already have an account? <span onClick={() => setIsLoginView(true)} className="text-blue-600 cursor-pointer font-semibold">Log In</span></p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProviderAuth;

