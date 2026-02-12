import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { OrganState } from '@lumen/shared/types/index';
import { useLumenSocket } from '../hooks/useLumenSocket';

interface OrganContextType {
    organState: OrganState | null;
    isConnected: boolean;
}

const OrganContext = createContext<OrganContextType | undefined>(undefined);

export const OrganProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { organState, isConnected } = useLumenSocket();

    return (
        <OrganContext.Provider value={{ organState, isConnected }}>
            {children}
        </OrganContext.Provider>
    );
};

export const useOrgan = () => {
    const context = useContext(OrganContext);
    if (context === undefined) {
        throw new Error('useOrgan must be used within an OrganProvider');
    }
    return context;
};
