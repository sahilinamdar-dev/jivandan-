import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Restore auth on refresh
    useEffect(() => {
        const restoreAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // attach token
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // verify token by fetching current user
                const res = await api.get('/auth/me');
                setUser(res.data.user);
            } catch (err) {
                // token invalid → clear storage
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

    // 🔹 Login
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });

        const { token, user } = res.data;

        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);

        return res.data;
    };

    // 🔹 Register
    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        return res.data;
    };

    // 🔹 Logout
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {}

        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    // Expose a setter so other components (e.g. Google login) can update context user
    const setAuthUser = (u) => {
        // ensure axios instance uses token from storage if available
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(u);
    };

    // 🔹 Forgot / Reset Password
    const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
    const verifyOTP = (email, otp) => api.post('/auth/verify-otp', { email, otp });
    const resetPassword = (email, otp, newPassword) =>
        api.post('/auth/reset-password', { email, otp, newPassword });

    return (
        <AuthContext.Provider
            value={{
                user,
                setAuthUser,
                login,
                register,
                logout,
                forgotPassword,
                verifyOTP,
                resetPassword,
                loading,
                api,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
