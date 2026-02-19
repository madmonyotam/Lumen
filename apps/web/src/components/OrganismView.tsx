import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrgan } from '../context/OrganContext';
import { LUMEN_CONFIG } from '../lumen.config';
import { FlexCol, AbsoluteFill } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import GenesisScreen from './GenesisScreen';
import { NeuralHeader } from './organism/NeuralHeader';
import { MetricCards } from './organism/MetricCards';
import { StatusBadges } from './organism/StatusBadges';
import { ChatHistory } from './organism/ChatHistory';
import { useNeuralUplink } from '../hooks/useNeuralUplink';
import { useBiometricsSync } from '../hooks/useBiometricsSync';
import { MemoryFog } from './d3/MemoryFog';
import { useTranslation } from '../hooks/useTranslation';
import { KillSwitchModal } from './molecules/KillSwitchModal';

// --- Styled Components ---

const Container = styled(FlexCol)`
  height: 100vh;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.teal};
  font-family: ${props => props.theme.fonts.main};
  position: relative;
  overflow: hidden;
  padding: 2rem;
  
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

const MainGrid = styled.main`
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
  top: 0;
  text-align: center;
  color: ${props => props.theme.colors.teal};
  opacity: 0.4;
  font-size: 0.875rem;
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
  height: 70vh;
  width: 100%;
`;

const KillSwitchContainer = styled.div<{ $isRTL?: boolean }>`
  position: absolute;
  bottom: 2rem;
  ${props => props.$isRTL ? 'left' : 'right'}: 2rem;
  z-index: 50;
`;

const KillButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${props => props.theme.colors.red};
  color: ${props => props.theme.colors.red};
  padding: 0.5rem 1rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all ${props => props.theme.animations.fast};
  backdrop-filter: blur(4px);

  &:hover {
    background: ${props => props.theme.colors.red};
    color: black;
    box-shadow: ${props => props.theme.shadows.neonRed};
  }
`;



const OrganismView: React.FC = () => {
  const { organState, isConnected } = useOrgan();
  const {
    inputValue, setInputValue, showKillModal, setShowKillModal, handleSend, handleKill
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

  return (
    <Container>
      <BackgroundGradient />
      <NeuralHeader
        name={lifeStatus.name}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        rightContent={
          <StatusBadges
            generation={lifeStatus.generation}
            latency={status.latency}
            vitality={status.vitality}
            ageRatio={ageRatio}
          />
        }
      />

      <MainGrid>
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
      <MemoryFog />
      <KillSwitchContainer $isRTL={isRTL}>
        <KillButton onClick={() => setShowKillModal(true)}>{t('terminate')}</KillButton>
      </KillSwitchContainer>

      <KillSwitchModal
        isOpen={showKillModal}
        onClose={() => setShowKillModal(false)}
        onKill={handleKill}
      />
    </Container>
  );
};

export default OrganismView;
