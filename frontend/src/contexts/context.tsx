import type React from 'react'
import { createContext, useState } from 'react'

interface ContextData {
    page: number
    setPage: (number: number) =>void
}

const InitialValues: ContextData = {
    page: 0,
    setPage: ()=>{}
}

export const Context = createContext<ContextData>(InitialValues)

export const Provider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [page, setPage] = useState(0)

    return (
        <Context.Provider
            value={{
                page,
                setPage
            }}
        >
            {children}
        </Context.Provider>
    )
}
