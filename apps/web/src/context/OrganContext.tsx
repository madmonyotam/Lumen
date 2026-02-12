import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { BiometricData, OrganState } from '@lumen/shared/types/index';
import { useLumenSocket } from '../hooks/useLumenSocket';

interface OrganContextType {
    biometrics: BiometricData | null;
    organState: OrganState | null;
    isConnected: boolean;
}

const OrganContext = createContext<OrganContextType | undefined>(undefined);

export const OrganProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { biometrics, organState, isConnected } = useLumenSocket();

    return (
        <OrganContext.Provider value={{ biometrics, organState, isConnected }}>
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
