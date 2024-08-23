import React, { createContext, useState } from 'react'
import { User } from '../types'

interface ContextData {
    user: User | null
    page: number
    setPage: (number: number) =>void
}

const InitialValues: ContextData = {
    user: null,
    page: 0,
    setPage: ()=>{}
}

export const Context = createContext<ContextData>(InitialValues)

export const Provider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [page, setPage] = useState(0)

    return (
        <Context.Provider
            value={{
                user,
                page,
                setPage
            }}
        >
            {children}
        </Context.Provider>
    )
}
