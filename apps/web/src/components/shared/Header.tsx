import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(10, 10, 12, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    z-index: 1000;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: ${props => props.theme.colors.teal};
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
`;

const DisplayName = styled.span`
    color: #fff;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
`;

const AvatarImg = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;

    &:hover {
        border-color: ${props => props.theme.colors.teal};
    }
`;

const Dropdown = styled(motion.div)`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: #1a1a20;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 150px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    z-index: 1001;
`;

const MenuItem = styled.button`
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: #fff;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (!user) return null;

    return (
        <HeaderContainer>
            <Logo>LUMEN</Logo>
            <ProfileSection>
                <DisplayName>{user.displayName || "Operator"}</DisplayName>
                <AvatarImg
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'O'}&background=random`}
                    alt="User Avatar"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                />

                <AnimatePresence>
                    {dropdownOpen && (
                        <Dropdown
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MenuItem onClick={() => {
                                setDropdownOpen(false);
                                logout();
                            }}>
                                Terminate Session
                            </MenuItem>
                        </Dropdown>
                    )}
                </AnimatePresence>
            </ProfileSection>
        </HeaderContainer>
    );
};
