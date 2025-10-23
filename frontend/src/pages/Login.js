// File: frontend/src/pages/Login.js

import React from 'react'; // Corrected import statement
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Using relative path

const Login = () => {
    // Using React.useState for clarity, though not strictly necessary
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if user is already logged in
    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'provider' ? '/dashboard' : '/');
        }
    }, [user, navigate]);

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loggedInUser = await login({ email, password });

            if (!loggedInUser) {
                // If login fails, AuthContext alerts, set local error state
                setError('Login failed. Please check your credentials.');
            }
            // Successful login is handled by the useEffect redirect
        } catch (err) {
            console.error("Login submit error:", err);
            setError('An unexpected error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
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
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center mt-4">
                     <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                         Don't have an account? Sign up
                     </Link>
                 </div>
            </div>
        </div>
    );
};

export default Login;