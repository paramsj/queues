import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch the user profile here using the token
    if (token) {
      localStorage.setItem('token', token);
      // Mock user decoding for now, ideally backend returns user info on login
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload); // assuming payload has { id, role }
      } catch(e) {
        // If JWT is unparseable or just a dummy token
        setUser({ id: 'dummy', role: 'USER' }); 
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    if(userData) setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
