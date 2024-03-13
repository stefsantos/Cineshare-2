// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children, resetUserSpecificData }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Initialize user session from local storage or session storage
    }, []);

    const login = (userData, token) => {
        setCurrentUser(userData); // Set user data
        localStorage.setItem('token', token); // Store the token in localStorage
    };

    const logout = () => {
        setCurrentUser(null); // Clear user data
        localStorage.removeItem('token'); // Remove the token from localStorage
        resetUserSpecificData(); // Call a function to reset user-specific data
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
