import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { FlexCol } from '../shared/Layout';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${props => props.theme.ui.background.overlay};
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.ui.background.card};
  border: 1px solid ${props => props.theme.ui.status.error};
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.ui.status.error};
  font-size: ${props => props.theme.config.typography.h2.size};
  font-weight: ${props => props.theme.config.typography.h2.weight};
  letter-spacing: ${props => props.theme.config.typography.h2.spacing};
  margin-bottom: 1rem;
  text-align: center;
`;

const ModalText = styled.p`
  color: ${props => props.theme.ui.text.dim};
  margin-bottom: 2rem;
  text-align: center;
  font-size: ${props => props.theme.config.typography.body.size};
  line-height: 1.5;
`;

const OptionButton = styled.button<{ $danger?: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.$danger ? props.theme.palette.red.dim : props.theme.ui.border.dim};
  padding: 1rem;
  width: 100%;
  cursor: pointer;
  text-align: left;
  transition: ${props => props.theme.config.transitions.fast};

  &:hover {
    background: ${props => props.theme.ui.action.hover};
    border-color: ${props => props.$danger ? props.theme.ui.status.error : props.theme.ui.brand.primary};
  }
`;

const OptionTitle = styled.div<{ $danger?: boolean }>`
  color: ${props => props.$danger ? props.theme.ui.status.error : props.theme.ui.brand.primary};
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
`;

const OptionDesc = styled.div`
  color: ${props => props.theme.ui.text.dim};
  font-size: 0.75rem;
`;

const CancelButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  background: transparent;
  border: none;
  color: ${props => props.theme.ui.text.dim};
  cursor: pointer;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.5rem;

  &:hover {
    color: ${props => props.theme.ui.text.primary};
  }
`;

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKill: (type: 'diminish' | 'wipe') => void;
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({ isOpen, onClose, onKill }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalContent initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
            <ModalTitle>{t('terminate_modal_title')}</ModalTitle>
            <ModalText>{t('terminate_modal_text')}</ModalText>
            <FlexCol $gap="1rem">
              <OptionButton onClick={() => onKill('diminish')}>
                <OptionTitle>{t('terminate_diminish')}</OptionTitle>
                <OptionDesc>{t('terminate_diminish_desc')}</OptionDesc>
              </OptionButton>
              <OptionButton
                onClick={() => onKill('wipe')}
                $danger
              >
                <OptionTitle $danger>{t('terminate_erase')}</OptionTitle>
                <OptionDesc>{t('terminate_erase_desc')}</OptionDesc>
              </OptionButton>
            </FlexCol>
            <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
