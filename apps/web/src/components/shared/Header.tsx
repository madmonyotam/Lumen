import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useNeuralUplink } from '../../hooks/useNeuralUplink';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useOrgan } from '../../context/OrganContext';
import { Flex, Relative } from './Layout';
import { KillSwitchModal } from '../molecules/KillSwitchModal';

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

const LogoContainer = styled(Flex)`
    align-items: center;
    gap: 1rem;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: ${props => props.theme.colors.teal};
`;

const StatusDotContainer = styled(Relative)`
  width: 0.75rem;
  height: 0.75rem;
`;

const StatusDotCore = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.teal};
`;

const StatusDotPing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.teal};
  opacity: 0.5;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const Slogan = styled.div`
    color: ${props => props.theme.colors.textDim};
    font-size: 0.75rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    display: none;
    @media (min-width: 768px) {
        display: block;
    }
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

const Dropdown = styled(motion.div) <{ $isRTL?: boolean }>`
    position: absolute;
    top: 100%;
    ${props => props.$isRTL ? 'left' : 'right'}: 0;
    margin-top: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(${props => props.theme.glass.blur});
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 180px;
    box-shadow: ${props => props.theme.shadows.neonTeal};
    z-index: 1001;
    transform-origin: top right;
`;

const MenuItem = styled.button`
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.text};
    text-align: center;
    cursor: pointer;
    font-family: ${props => props.theme.fonts.main};
    letter-spacing: 0.05em;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: all 0.3s ease-out;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: ${props => props.theme.colors.teal};
        transform: scale(1.02);
    }
`;

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { showKillModal, setShowKillModal, handleKill } = useNeuralUplink();
    const { t, isRTL, lang } = useTranslation();
    const { organState } = useOrgan();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (!user) return null;

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'he' : 'en';
        localStorage.setItem('lumen_lang', newLang);
        window.location.reload();
    };

    return (
        <HeaderContainer>
            <LogoContainer>
                <Logo>LUMEN</Logo>
                {organState?.lifeStatus?.isAlive && (
                    <StatusDotContainer>
                        <StatusDotCore />
                        <StatusDotPing />
                    </StatusDotContainer>
                )}
                <Slogan>{t('slogan_emergence')}</Slogan>
            </LogoContainer>

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
                            $isRTL={isRTL}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <MenuItem onClick={toggleLanguage}>
                                {t('menu_language')}
                            </MenuItem>
                            <MenuItem onClick={() => {
                                setDropdownOpen(false);
                                setShowKillModal(true);
                            }}>
                                {t('terminate')}
                            </MenuItem>
                            <MenuItem onClick={() => {
                                setDropdownOpen(false);
                                logout();
                            }}>
                                {t('menu_logout')}
                            </MenuItem>
                        </Dropdown>
                    )}
                </AnimatePresence>
            </ProfileSection>

            <KillSwitchModal
                isOpen={showKillModal}
                onClose={() => setShowKillModal(false)}
                onKill={handleKill}
            />
        </HeaderContainer>
    );
};
