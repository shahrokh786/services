import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (loginData, suppressAlert = false) => {
        try {
            const response = await authService.login(loginData);
            // This line now correctly expects the nested 'user' object from the backend.
            const loggedInUser = response.data.user; 
            
            // This will now correctly set the state with the user object.
            setUser(loggedInUser);

            if (!suppressAlert) {
                // Using alert() is generally discouraged in production apps. 
                // Consider a more modern notification system.
                console.log('🔐 Login successful!');
            }
            // Return the full user object so other components can use it.
            return loggedInUser; 
        } catch (error) {
            console.error('Login failed:', error);
            if (!suppressAlert) {
                console.error('❌ Login failed: ' + (error.response?.data?.message || error.message));
            }
            return null;
        }
    };

    const register = async (registerData) => {
        try {
            await authService.register(registerData);
            console.log('🎉 Registration successful! Please log in.');
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            console.error('❌ Registration failed: ' + (error.response?.data?.message || error.message));
            return false;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            // Ensure user is logged out on the frontend even if the backend call fails
            setUser(null);
        }
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // This call also expects the nested user object from the /profile route.
                const { data } = await authService.getProfile();
                setUser(data.user);
            } catch (error) {
                // This is an expected outcome if the user isn't logged in (e.g., no valid token)
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const value = { user, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {/* This prevents rendering the app until the initial user check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

