import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { FlexCol } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import { BiometricsPanel } from './organism/BiometricsPanel';
import { ChatHistory } from './organism/ChatHistory';
import { Send } from 'lucide-react';
import { MemoryFog } from './d3/MemoryFog';
import type { OrganismViewProps } from './OrganismView';
import { BackgroundGradient, ThoughtBubble, FloatingInputContainer, ChatTextarea, SendButton, EstablishingLinkText } from './organism/OrganismSharedStyles';

const MobileContainer = styled(FlexCol)`
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.ui.background.main};
  color: ${props => props.theme.ui.brand.primary};
  font-family: ${props => props.theme.config.fonts.main};
  position: relative;
  overflow: hidden;
  padding-top: 64px; // Account for header
  padding-bottom: 5rem; // Account for massive input at bottom
`;

const TopSection = styled.div`
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none; // Let clicks pass through empty space
  
  > * {
    pointer-events: auto; // Re-enable for kids
  }
`;

const OrbWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  min-height: 0; // Let it shrink
`;

const OrganismViewMobile: React.FC<OrganismViewProps> = (props) => {
  const {
    isConnected,
    organState,
    inputValue,
    thought,
    currentInteraction,
    biometricsRef,
    handleTextareaChange,
    handleKeyDown,
    handleSend,
    t,
    isRTL
  } = props;

  if (!isConnected || !organState) {
    return (
      <MobileContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <EstablishingLinkText>{t('establishing_link')}</EstablishingLinkText>
      </MobileContainer>
    );
  }

  const { biometrics, status, lifeStatus } = organState;

  if (!lifeStatus?.isAlive) {
    return null;
  }

  const ageRatio = lifeStatus.age / lifeStatus.lifespan;

  return (
    <MobileContainer>
      <BackgroundGradient />

      <TopSection>
        <BiometricsPanel
          bpm={biometrics.bpm}
          stressIndex={biometrics.stressIndex}
          hrv={biometrics.hrv}
          latency={status.latency}
          generation={lifeStatus.generation}
          ageRatio={ageRatio}
          vitality={status.vitality}
        />
        {/* On mobile, chat history might block the view if fully opened, but we'll include it for now */}
        <ChatHistory currentInteraction={currentInteraction} />
      </TopSection>

      <OrbWrapper>
        <AnimatePresence mode="wait">
          <ThoughtBubble
            key={thought}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.4, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {thought}
          </ThoughtBubble>
        </AnimatePresence>

        <VisualPhysics
          biometricsRef={biometricsRef}
          thought={thought}
          currentInteraction={currentInteraction}
        />
      </OrbWrapper>

      <FloatingInputContainer $isRTL={isRTL}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ChatTextarea
          $isRTL={isRTL}
          rows={1}
          placeholder={`${t('speak_to_placeholder')} ${lifeStatus.name}...`}
          value={inputValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
        />
        <SendButton onClick={handleSend} $isRTL={isRTL} disabled={!inputValue.trim()}>
          <Send size={18} />
        </SendButton>
      </FloatingInputContainer>

      <MemoryFog />
    </MobileContainer>
  );
};

export default OrganismViewMobile;
