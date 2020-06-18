import React, { useState } from 'react'

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
})

export default function AuthContextProvider(props) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    function loginHandler() {
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    )
}