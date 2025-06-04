import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MOCK_USERS } from './authConstants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && MOCK_USERS[savedRole]) {
      setUser(MOCK_USERS[savedRole]);
    }
  }, []);

  const login = useCallback((role) => {
    if (MOCK_USERS[role]) {
      const userData = MOCK_USERS[role];
      setUser(userData);
      localStorage.setItem('userRole', role);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('userRole');
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Exportar valores por defecto para facilitar las pruebas
export const AuthContextValues = {
  MOCK_USERS
};
