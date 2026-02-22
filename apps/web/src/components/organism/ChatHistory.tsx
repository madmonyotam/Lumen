import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FlexCol } from '../shared/Layout';

const RightColumn = styled(FlexCol)`
  width: 100%;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  overflow: hidden;
  padding: 1rem 0;
`;

const ChatContainer = styled(FlexCol)`
  width: 25vw;
  align-self: flex-end;
  height: 100%;
  z-index: 30;
  overflow-y: auto;
  gap: 0.75rem;
  scrollbar-width: none;
`;

const ChatMessage = styled(motion.div) <{ $sender: 'user' | 'lumen' }>`
  align-self: flex-end;
  background: ${props => props.$sender === 'user' ? 'rgba(255,255,255,0.05)' : props.theme.palette.teal.dim};
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  color: ${props => props.$sender === 'user' ? props.theme.ui.text.primary : props.theme.ui.brand.primary};
  border: 1px solid ${props => props.$sender === 'user' ? 'rgba(255,255,255,0.1)' : props.theme.palette.teal.dim};
  font-size: 1rem;
  line-height: 1.4;
  backdrop-filter: blur(5px);
  box-shadow: ${props => props.$sender === 'user' ? props.theme.config.shadows.card : props.theme.config.shadows.neonTeal};
`;

interface ChatHistoryProps {
    currentInteraction: { text: string; sender: 'user' | 'lumen'; timestamp: number } | null;
}

export const ChatHistory: React.FC<ChatHistoryProps> = React.memo(({ currentInteraction }) => {
    return (
        <RightColumn>
            <ChatContainer>
                <AnimatePresence>
                    {currentInteraction && (
                        <ChatMessage
                            key={currentInteraction.timestamp}
                            $sender={currentInteraction.sender}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {currentInteraction.text}
                        </ChatMessage>
                    )}
                </AnimatePresence>
            </ChatContainer>
        </RightColumn>
    );
});
