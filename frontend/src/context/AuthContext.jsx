import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;

            // Fetch fresh profile to update role/club
            axios.get(`${API_URL}/api/auth/profile`)
                .then(({ data }) => {
                    const updatedUser = { ...parsedUser, ...data };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                })
                .catch(err => {
                    console.error('Failed to refresh profile', err);
                    if (err.response?.status === 401) logout();
                });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
