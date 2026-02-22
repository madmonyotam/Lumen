import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from './LoginScreen';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const GuardContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.teal};
    font-family: ${props => props.theme.fonts.code};
`;

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <GuardContainer>
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    Authenticating Neural Link...
                </motion.div>
            </GuardContainer>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <>{children}</>;
};
