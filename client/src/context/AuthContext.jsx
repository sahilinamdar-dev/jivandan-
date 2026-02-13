import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

// 🔹 Axios Interceptor: Auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                const res = await api.post('/auth/refresh-token');
                const { token } = res.data;

                // Update storage and axios headers
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Process any queued requests
                processQueue(null, token);

                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

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
        let endpoint = '/auth/register'; // Fallback

        switch (userData.role) {
            case 'patient':
                endpoint = '/auth/register/patient';
                break;
            case 'hospital':
                endpoint = '/auth/register/hospital';
                break;
            case 'supporter':
                endpoint = '/auth/register/supporter';
                break;
            default:
                // If role is missing or unknown, you might want to handle it or use a generic endpoint if one exists.
                // For now, I'll assume one of the roles above matches.
                break;
        }

        const res = await api.post(endpoint, userData);
        return res.data;
    };

    // 🔹 Logout
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch { }

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
