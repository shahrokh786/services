// File: frontend/src/pages/Register.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Using relative path based on our previous fix

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '', // Optional field
        role: 'customer', // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth(); // Get register function and user state
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === 'provider' ? '/dashboard' : '/'); // Redirect to dashboard or home
        }
    }, [user, navigate]);

    const { name, email, password, phone, role } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);

        if (password.length < 6) {
             setError('Password must be at least 6 characters long.');
             setLoading(false);
             return;
        }

        try {
            // Call the register function from AuthContext
            const success = await register({ name, email, password, phone, role });

            if (success) {
                // Optionally show a success message before redirecting
                alert('Registration successful! Please log in.'); // Replace with better UI later
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                 // The register function in AuthContext should handle setting specific errors,
                 // but we set a generic one if it returns false without throwing.
                 // AuthContext's register function *already* alerts on failure based on your code.
                 // setError('Registration failed. Please try again.'); // Keep this commented if AuthContext alerts
            }
        } catch (err) {
             // This catch block might not be necessary if AuthContext handles errors
             console.error("Registration submit error:", err);
             setError('An unexpected error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password (min. 6 characters)"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label htmlFor="phone" className="sr-only">Phone Number (Optional)</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel" // Use type "tel" for phone numbers
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Phone Number (Optional)"
                                value={phone}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Role Selection */}
                        <div className="pt-2">
                             <label className="block text-sm font-medium text-gray-700 mb-2">Register as a:</label>
                             <div className="flex items-center space-x-6">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={role === 'customer'}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Customer (I need services)</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="provider"
                                        checked={role === 'provider'}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Service Provider (I offer services)</span>
                                </label>
                             </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Registering...' : 'Sign up'}
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center">
                     <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                         Already have an account? Sign in
                     </Link>
                 </div>
            </div>
        </div>
    );
};

export default Register;