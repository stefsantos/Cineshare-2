import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [activeusername, setUsername] = useState(() => {
    return localStorage.getItem('activeusername') || 'defaultUsername';
  });

  const updateUser = (newUsername) => {
    setUsername(newUsername);
    localStorage.setItem('activeusername', newUsername);
  };

  return (
    <UserContext.Provider value={{ activeusername, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  
