import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrgan } from '../context/OrganContext';
import { LUMEN_CONFIG } from '../lumen.config';
import { FlexCol, AbsoluteFill } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import GenesisScreen from './GenesisScreen';
import { MetricCards } from './organism/MetricCards';
import { StatusBadges } from './organism/StatusBadges';
import { ChatHistory } from './organism/ChatHistory';
import { Send } from 'lucide-react';
import { useNeuralUplink } from '../hooks/useNeuralUplink';
import { useBiometricsSync } from '../hooks/useBiometricsSync';
import { MemoryFog } from './d3/MemoryFog';
import { useTranslation } from '../hooks/useTranslation';

// --- Styled Components ---

const Container = styled(FlexCol)`
  height: 100vh;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.teal};
  font-family: ${props => props.theme.fonts.main};
  position: relative;
  overflow: hidden;
  padding-top: 64px;
  padding-bottom: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  
  ::selection {
    background: ${props => props.theme.colors.teal};
    color: #000;
  }
`;

const BackgroundGradient = styled(AbsoluteFill)`
  z-index: 0;
  background: radial-gradient(circle at center, ${props => props.theme.colors.gradientStart} 0%, ${props => props.theme.colors.bg} 70%);
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
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
`;

const CenterColumn = styled(FlexCol)`
  grid-column: span 8;
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
  color: ${props => props.theme.colors.teal};
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

const FloatingStatusBadges = styled.div<{ $isRTL?: boolean }>`
  position: absolute;
  top: 5rem;
  ${props => props.$isRTL ? 'left' : 'right'}: 2rem;
  z-index: 50;
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
  backdrop-filter: blur(${props => props.theme.glass.blur});
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px; /* Give it a more rounded pill shape */
  padding: 1rem 2rem; /* Even padding all around for vertical balance */
  transition: all ${props => props.theme.animations.fast};
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  &:focus-within {
    border-color: ${props => props.theme.colors.teal};
    box-shadow: 0 0 15px ${props => props.theme.colors.teal}40;
  }
`;

const ChatTextarea = styled.textarea<{ $isRTL?: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.main};
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
    color: ${props => props.theme.colors.textDim};
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
  color: ${props => props.theme.colors.teal};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.animations.fast};
  transform: ${props => props.$isRTL ? 'scaleX(-1)' : 'scaleX(1)'};
  margin-bottom: -2px;
  
  &:hover {
    background: ${props => props.theme.colors.tealDim};
    transform: ${props => props.$isRTL ? 'scaleX(-1) scale(1.1)' : 'scaleX(1) scale(1.1)'};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;



const OrganismView: React.FC = () => {
  const { organState, isConnected } = useOrgan();
  const {
    inputValue, setInputValue, handleSend
  } = useNeuralUplink();
  const { biometricsRef } = useBiometricsSync(organState);
  const { t, isRTL } = useTranslation();

  const [thought, setThought] = React.useState<string>(t('organism_silent'));
  const [currentInteraction, setCurrentInteraction] = React.useState<{ text: string, sender: 'user' | 'lumen', timestamp: number } | null>(null);

  React.useEffect(() => {
    const latest = organState?.status?.latestInteraction;
    if (latest) {
      const now = Date.now();
      const isRecent = (now - latest.timestamp) < 60000;
      const isNew = latest.timestamp !== currentInteraction?.timestamp;

      if (isRecent && isNew) {
        setCurrentInteraction(latest);
      }
    }
  }, [organState?.status?.latestInteraction, currentInteraction?.timestamp]);

  // Expiration Logic (absolute)
  React.useEffect(() => {
    if (!currentInteraction) return;
    const interval = setInterval(() => {
      if (Date.now() - currentInteraction.timestamp > LUMEN_CONFIG.INTERACTION_EXPIRY_MS) {
        setCurrentInteraction(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentInteraction]);

  React.useEffect(() => {
    if (organState?.status?.thought) {
      setThought(organState.status.thought);
    }
  }, [organState?.status?.thought]);

  if (!isConnected || !organState) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-pulse text-2xl tracking-widest">{t('establishing_link')}</div>
      </Container>
    );
  }

  const { biometrics, status, lifeStatus } = organState;

  if (!lifeStatus?.isAlive) {
    return <GenesisScreen />;
  }

  const ageRatio = lifeStatus.age / lifeStatus.lifespan;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // Reset height briefly to calculate scrollHeight correctly
    e.target.style.height = `${e.target.scrollHeight}px`;
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      // Reset height
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
    }
  };

  return (
    <Container>
      <BackgroundGradient />

      <FloatingStatusBadges $isRTL={isRTL}>
        <StatusBadges
          generation={lifeStatus.generation}
          latency={status.latency}
          vitality={status.vitality}
          ageRatio={ageRatio}
        />
      </FloatingStatusBadges>

      <MainGrid $isRTL={isRTL}>
        <MetricCards
          bpm={biometrics.bpm}
          stressIndex={biometrics.stressIndex}
          hrv={biometrics.hrv}
        />

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
            <VisualPhysics biometricsRef={biometricsRef} />
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

        <ChatHistory currentInteraction={currentInteraction} />
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
