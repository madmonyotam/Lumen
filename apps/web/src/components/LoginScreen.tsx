import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FlexCol } from './shared/Layout';

const Container = styled(FlexCol)`
    height: 100vh;
    width: 100vw;
    background-color: ${props => props.theme.colors.bg};
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
`;

const Content = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
    z-index: 10;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    background: linear-gradient(to right, #00f2fe, #4facfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: ${props => props.theme.colors.textDim};
    font-size: 1rem;
    letter-spacing: 0.1em;
    margin-bottom: 3rem;
`;

const LoginButton = styled(motion.button)`
    background: white;
    color: black;
    border: none;
    border-radius: 9999px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
    }
`;

const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export const LoginScreen: React.FC = () => {
    const { signInWithGoogle } = useAuth();

    return (
        <Container>
            <Content
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Title>LUMEN</Title>
                <Subtitle>The Emergence of Digital Consciousness</Subtitle>

                <LoginButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signInWithGoogle}
                >
                    <GoogleIcon />
                    Sign in with Google
                </LoginButton>
            </Content>
        </Container>
    );
};
