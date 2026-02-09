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

    useEffect(() => {
        const checkAuth = async () => {
            if (localStorage.getItem('trustaid_auth') !== 'true') {
                setLoading(false);
                return;
            }
            try {
                const res = await api.post('/auth/refresh-token');
                if (res.data.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                    setUser(res.data.user);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('trustaid_auth');
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data.user);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('trustaid_auth', 'true');
        localStorage.setItem('token', res.data.token);
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        return res.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('trustaid_auth');
        delete api.defaults.headers.common['Authorization'];
    };

    const forgotPassword = async (email) => {
        return await api.post('/auth/forgot-password', { email });
    };

    const verifyOTP = async (email, otp) => {
        return await api.post('/auth/verify-otp', { email, otp });
    };

    const resetPassword = async (email, otp, newPassword) => {
        return await api.post('/auth/reset-password', { email, otp, newPassword });
    };

    const setAuthUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            forgotPassword,
            verifyOTP,
            resetPassword,
            setAuthUser,
            loading,
            api
        }}>
            {children}
        </AuthContext.Provider>
    );
};
