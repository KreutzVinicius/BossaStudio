import React, { createContext, useState } from 'react'
import { User } from '../types'

interface ContextData {
    user: User | null
}

const InitialValues: ContextData = {
    user: null,
}

export const AuthContext = createContext<ContextData>(InitialValues)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)

    return (
        <AuthContext.Provider
            value={{
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
