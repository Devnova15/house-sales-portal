import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { QUERY } from '../constans/query';

const AuthContext = createContext();

const ADMIN_TOKEN_KEY = 'adminToken';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check token validity on load
    useEffect(() => {
        const checkToken = async () => {
            const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
            
            if (storedToken) {
                try {
                    // Add token to axios headers
                    axios.defaults.headers.common['Authorization'] = storedToken;
                    
                    // Verify token by getting user data
                    const response = await axios.get(QUERY.ADMIN.ME);
                    
                    if (response.data && response.data.isAdmin) {
                        setUser(response.data);
                        setToken(storedToken);
                        setIsAuthenticated(true);
                    } else {
                        // If user is not admin, log out
                        localStorage.removeItem(ADMIN_TOKEN_KEY);
                        delete axios.defaults.headers.common['Authorization'];
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    // If token is invalid, remove it
                    localStorage.removeItem(ADMIN_TOKEN_KEY);
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            
            setLoading(false);
        };
        
        checkToken();
    }, []);

    const login = async (adminToken) => {
        try {
            localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
            axios.defaults.headers.common['Authorization'] = adminToken;
            setToken(adminToken);
            setIsAuthenticated(true);

            // Fetch user data immediately after login
            const response = await axios.get(QUERY.ADMIN.ME);
            if (response.data && response.data.isAdmin) {
                setUser(response.data);
            } else {
                throw new Error('User is not an admin');
            }
        } catch (error) {
            console.error('Login error:', error);
            // If something goes wrong, clean up
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            delete axios.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            throw error; // Re-throw to let the calling component handle it
        }
    };

    const logout = () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
    };

    const value = {
        isAuthenticated,
        token,
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
