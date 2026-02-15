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

const CoreSynapseContainer = styled.div`
  z-index: 10;
  text-align: center;
  margin-top: 2rem;
`;

const CoreSynapseLabel = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.5em;
  color: ${props => props.theme.colors.textDim};
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const CoreSynapseText = styled(motion.h2)`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

const Particle = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 50%;
  opacity: 0.2;
`;

const OrbContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  width: 100%;
`;

const KillSwitchContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
`;

const KillButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${props => props.theme.colors.red};
  color: ${props => props.theme.colors.red};
  padding: 0.5rem 1rem;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  backdrop-filter: blur(4px);

  &:hover {
    background: ${props => props.theme.colors.red};
    color: black;
    box-shadow: ${props => props.theme.shadows.neonRed};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.red};
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.red};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 0.1em;
`;

const ModalText = styled.p`
  color: ${props => props.theme.colors.textDim};
  margin-bottom: 2rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const OptionButton = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.theme.colors.tealDim};
  padding: 1rem;
  width: 100%;
  cursor: pointer;
  text-align: left;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.teal};
  }
`;

const OptionTitle = styled.div`
  color: ${props => props.theme.colors.teal};
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
`;

const OptionDesc = styled.div`
  color: ${props => props.theme.colors.textDim};
  font-size: 0.75rem;
`;

const CancelButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textDim};
  cursor: pointer;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.5rem;

  &:hover {
    color: white;
  }
`;

const OrganismView: React.FC = () => {
  const { organState, isConnected } = useOrgan();
  const {
    inputValue, setInputValue, showKillModal, setShowKillModal, handleSend, handleKill
  } = useNeuralUplink();
  const { biometricsRef } = useBiometricsSync(organState);

  const [thought, setThought] = React.useState<string>("The organism is silent...");
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
        <div className="animate-pulse text-2xl tracking-widest">ESTABLISHING NEURAL LINK...</div>
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

          <CoreSynapseContainer>
            <CoreSynapseLabel>Core Synapse</CoreSynapseLabel>
            <CoreSynapseText
              key={status.homeostasisLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {status.homeostasisLabel}
            </CoreSynapseText>
          </CoreSynapseContainer>
        </CenterColumn>

        <ChatHistory currentInteraction={currentInteraction} />
      </MainGrid>
      <MemoryFog />
      <KillSwitchContainer>
        <KillButton onClick={() => setShowKillModal(true)}>TERMINATE</KillButton>
      </KillSwitchContainer>

      <AnimatePresence>
        {showKillModal && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <ModalTitle>TERMINATE ORGANISM?</ModalTitle>
              <ModalText>This will end the current consciousness. What should happen to the memories?</ModalText>
              <FlexCol style={{ gap: '1rem' }}>
                <OptionButton onClick={() => handleKill('diminish')}>
                  <OptionTitle>DIMINISH</OptionTitle>
                  <OptionDesc>Retain faint traces of the past (10% Strength)</OptionDesc>
                </OptionButton>
                <OptionButton
                  onClick={() => handleKill('wipe')}
                  style={{ borderColor: 'rgba(255, 68, 68, 0.5)' }}
                >
                  <OptionTitle style={{ color: '#FF4444' }}>ERASE ALL</OptionTitle>
                  <OptionDesc>Complete memory wipe. Tabula Rasa.</OptionDesc>
                </OptionButton>
              </FlexCol>
              <CancelButton onClick={() => setShowKillModal(false)}>CANCEL</CancelButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default OrganismView;
