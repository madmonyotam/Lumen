import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AbsoluteFill } from '../shared/Layout';

export const BackgroundGradient = styled(AbsoluteFill)`
  z-index: 0;
  background: radial-gradient(circle at center, ${props => props.theme.ui.background.gradientStart} 0%, ${props => props.theme.ui.background.main} 70%);
  opacity: 0.6;
`;

export const ThoughtBubble = styled(motion.div)`
  position: absolute;
  top: 5%;
  text-align: center;
  color: ${props => props.theme.ui.brand.primary};
  opacity: 0.4;
  font-size: 1rem;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 0.05em;
  max-width: 32rem;
  width: 100%;
  z-index: 20;

  @media (max-width: 768px) {
    top: 15%;
    font-size: 0.9rem;
    width: 90%;
  }
`;

export const FloatingInputContainer = styled(motion.div) <{ $isRTL?: boolean }>`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 40rem;
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(${props => props.theme.config.glass.blur});
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  padding: 1rem 2rem;
  transition: ${props => props.theme.config.transitions.fast};
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  &:focus-within {
    border-color: ${props => props.theme.ui.brand.primary};
    box-shadow: 0 0 15px ${props => props.theme.palette.teal.dim};
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.5);
  }
`;

export const ChatTextarea = styled.textarea<{ $isRTL?: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  color: ${props => props.theme.ui.text.primary};
  font-family: ${props => props.theme.config.fonts.main};
  font-size: 1.1rem;
  line-height: 1.5;
  padding: 0;
  margin: 0;
  resize: none;
  height: auto;
  min-height: 26px;
  max-height: 120px;
  overflow-y: auto;
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.ui.text.dim};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    min-height: 24px;
    max-height: 80px;
  }
`;

export const SendButton = styled.button<{ $isRTL?: boolean }>`
  padding: 0.5rem;
  margin: 0;
  margin-inline-start: 1rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${props => props.theme.ui.brand.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.config.transitions.fast};
  transform: ${props => props.$isRTL ? 'scaleX(-1)' : 'scaleX(1)'};
  margin-bottom: -2px;
  
  &:hover {
    background: ${props => props.theme.palette.teal.dim};
    transform: ${props => props.$isRTL ? 'scaleX(-1) scale(1.1)' : 'scaleX(1) scale(1.1)'};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    margin-inline-start: 0.5rem;
    &:hover {
      transform: ${props => props.$isRTL ? 'scaleX(-1)' : 'scaleX(1)'};
    }
  }
`;

export const EstablishingLinkText = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: 0.1em;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;
