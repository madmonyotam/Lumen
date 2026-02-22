import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Flex, FlexCol, AbsoluteFill } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import { BiometricsPanel } from './organism/BiometricsPanel';
import { ChatHistory } from './organism/ChatHistory';
import { Send } from 'lucide-react';
import { MemoryFog } from './d3/MemoryFog';

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

const BackgroundGradient = styled(AbsoluteFill)`
  z-index: 0;
  background: radial-gradient(circle at center, ${props => props.theme.ui.background.gradientStart} 0%, ${props => props.theme.ui.background.main} 70%);
  opacity: 0.6;
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

const ThoughtBubble = styled(motion.div)`
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
`;



const OrbContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;



const FloatingInputContainer = styled(motion.div) <{ $isRTL?: boolean }>`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  width: 90%;
  max-width: 40rem;
  z-index: 100;
  display: flex;
  align-items: center; /* Ensures strict vertical centering for child items */
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(${props => props.theme.config.glass.blur});
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px; /* Give it a more rounded pill shape */
  padding: 1rem 2rem; /* Even padding all around for vertical balance */
  transition: ${props => props.theme.config.transitions.fast};
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  &:focus-within {
    border-color: ${props => props.theme.ui.brand.primary};
    box-shadow: 0 0 15px ${props => props.theme.palette.teal.dim};
  }
`;

const ChatTextarea = styled.textarea<{ $isRTL?: boolean }>`
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
  
  /* Hide scrollbar for cleaner look */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.ui.text.dim};
    line-height: 1.5;
  }
`;

const SendButton = styled.button<{ $isRTL?: boolean }>`
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

const EstablishingLinkText = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: 0.1em;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

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
