import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { Flex, FlexCol } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import { BiometricsPanel } from './organism/BiometricsPanel';
import { ChatHistory } from './organism/ChatHistory';
import { Send } from 'lucide-react';
import { MemoryFog } from './d3/MemoryFog';
import { BackgroundGradient, ThoughtBubble, FloatingInputContainer, ChatTextarea, SendButton, EstablishingLinkText } from './organism/OrganismSharedStyles';

// --- Styled Components ---

const Container = styled(FlexCol)`
  height: 100vh;
  background-color: ${props => props.theme.ui.background.main};
  color: ${props => props.theme.ui.brand.primary};
  font-family: ${props => props.theme.config.fonts.main};
  position: relative;
  overflow: hidden;
  padding-top: 64px;
  padding-bottom: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  
  ::selection {
    background: ${props => props.theme.ui.brand.primary};
    color: #000;
  }
`;

const MainGrid = styled.main<{ $isRTL?: boolean }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  z-index: 10;
  position: relative;
  align-items: center;
  min-height: 0;
  overflow: hidden;
`;

const ContentWrapper = styled(Flex) <{ $isRTL?: boolean }>`
  position: absolute;
  top: 74px;
  bottom: 10px;
  left: 1rem;
  right: 1rem;
  gap: 1.5rem;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
`;

const CenterColumn = styled(FlexCol)`
  grid-column: span 12;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  min-height: 400px;
`;

const OrbContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export interface OrganismViewProps {
  isConnected: boolean;
  organState: any; // Type from OrganContext
  inputValue: string;
  thought: string;
  currentInteraction: { text: string, sender: 'user' | 'lumen', timestamp: number } | null;
  biometricsRef: React.MutableRefObject<any>;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  t: (key: any) => string;
  isRTL: boolean;
}

const OrganismView: React.FC<OrganismViewProps> = (props) => {
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
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <EstablishingLinkText>{t('establishing_link')}</EstablishingLinkText>
      </Container>
    );
  }

  const { biometrics, status, lifeStatus } = organState;

  if (!lifeStatus?.isAlive) {
    // This will be handled by the parent component (App or Router) now
    // But for fallback we can render null or a link to Genesis
    return null;
  }

  const ageRatio = lifeStatus.age / lifeStatus.lifespan;

  return (
    <Container>
      <BackgroundGradient />

      <ContentWrapper $isRTL={isRTL}>
        <BiometricsPanel
          bpm={biometrics.bpm}
          stressIndex={biometrics.stressIndex}
          hrv={biometrics.hrv}
          latency={status.latency}
          generation={lifeStatus.generation}
          ageRatio={ageRatio}
          vitality={status.vitality}
        />
        <ChatHistory currentInteraction={currentInteraction} />
      </ContentWrapper>

      <MainGrid $isRTL={isRTL}>

        <CenterColumn>
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

          <OrbContainer>
            <VisualPhysics
              biometricsRef={biometricsRef}
              thought={thought}
              currentInteraction={currentInteraction}
            />
          </OrbContainer>

          {/* <CoreSynapseContainer>
            <CoreSynapseLabel>Core Synapse</CoreSynapseLabel>
            <CoreSynapseText
              key={status.homeostasisLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {status.homeostasisLabel}
            </CoreSynapseText>
          </CoreSynapseContainer> */}
        </CenterColumn>
      </MainGrid>

      <FloatingInputContainer $isRTL={isRTL}
        initial={{ x: "-50%", y: 50, opacity: 0 }}
        animate={{ x: "-50%", y: 0, opacity: 1 }}
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
          <Send size={20} />
        </SendButton>
      </FloatingInputContainer>

      <MemoryFog />
    </Container>
  );
};

export default OrganismView;
