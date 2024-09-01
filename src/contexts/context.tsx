import React, { createContext, useEffect, useState } from 'react'
import { UserType } from 'types/User'

interface ContextData {
    user: UserType | null
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
    const [user, setUser] = useState< UserType | null>(null)
    const [page, setPage] = useState(0)

    useEffect(() => {
        setUser({
            name: 'John Doe',
            email: 'teste@gmial.com',
            password: '123456'
        })
    }, [user])

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
