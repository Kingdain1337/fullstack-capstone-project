import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [authToken, setAuthToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial data from session storage
    const storedAuthToken = sessionStorage.getItem('auth-token');
    const storedUserName = sessionStorage.getItem('name');
    const storedEmail = sessionStorage.getItem('email');
    
    if (storedAuthToken && storedUserName && storedEmail) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setEmail(storedEmail);
      setAuthToken(storedAuthToken);
    }
  }, []);

  const updateSessionStorage = (name, email, authToken) => {
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('auth-token', authToken);
  };

  const handleLogin = (name, email, authToken) => {
    setIsLoggedIn(true);
    setUserName(name);
    setEmail(email);
    setAuthToken(authToken);
    updateSessionStorage(name, email, authToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setEmail("");
    setAuthToken("");
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');
    navigate('/app/login');
  };

  const checkAuth = () => {
    const storedAuthToken = sessionStorage.getItem('auth-token');
    const storedUserName = sessionStorage.getItem('name');
    const storedEmail = sessionStorage.getItem('email');

    if (!storedAuthToken || !storedUserName || !storedEmail) {
      handleLogout();
    }
  };


  return (
    <AppContext.Provider value={{ 
      isLoggedIn, 
      userName, 
      email, 
      authToken, 
      handleLogin, 
      handleLogout, 
      checkAuth
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
