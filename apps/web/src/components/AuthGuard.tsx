import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from './LoginScreen';
import { motion } from 'framer-motion';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#00f2fe', fontFamily: 'monospace' }}>
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    Authenticating Neural Link...
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <>{children}</>;
};
