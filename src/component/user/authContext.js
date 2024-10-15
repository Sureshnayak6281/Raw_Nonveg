import {useContext, useState, createContext, useCallback  } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = useCallback(() => {
        setIsLoggedIn(true);
        console.log('isLoggedIn set to true');
      }, []);
    const logout = () => setIsLoggedIn(false);

    return(
        <AuthContext.Provider value = {{
             isLoggedIn,
              login,
             logout }}>
            {children}
            </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) ;