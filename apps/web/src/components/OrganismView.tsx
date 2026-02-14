import React from 'react';
import styled, { useTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Zap, Send } from 'lucide-react';
import { useOrgan } from '../context/OrganContext';
import { Flex, FlexCol, Center, Relative, AbsoluteFill } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';
import GenesisScreen from './GenesisScreen';

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

const Header = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
`;

const NeuralStatus = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: ${props => props.theme.colors.teal}; 
  opacity: 0.8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const SpecimenTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 10px ${props => props.theme.colors.tealDim};
`;

const StatusDotContainer = styled(Relative)`
  width: 0.75rem;
  height: 0.75rem;
`;

const StatusDotCore = styled.div<{ $color?: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.$color || props.theme.colors.teal};
`;

const StatusDotPing = styled.div<{ $color?: string }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: ${props => props.$color || props.theme.colors.teal};
  opacity: 0.5;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const StatusBadge = styled(Flex)`
  align-items: center;
  gap: 0.75rem;
  background-color: ${props => props.theme.colors.card};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 0.5rem;
`;

const BadgeLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textDim};
  letter-spacing: 0.1em;
`;

const BadgeValue = styled.span<{ $color?: string }>`
  color: ${props => props.$color || 'white'};
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: ${props => props.theme.fonts.code};
  text-shadow: ${props => props.$color ? `0 0 10px ${props.$color}80` : 'none'}; 
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

const Card = styled.div<{ $borderColor?: string }>`
  background-color: ${props => props.theme.colors.card};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  transition: all 0.5s ease;

  &:hover {
    border-color: ${props => props.$borderColor || props.theme.colors.tealDim};
  }
`;

const CardHeader = styled(Flex)`
  justify-content: space-between;
  margin-bottom:1.5rem;
`;

const CardTitle = styled.span`
  font-size: 0.625rem;
  color: ${props => props.theme.colors.textDim};
  letter-spacing: 0.2em;
`;

const MetricContainer = styled(Flex)`
  align-items: baseline;
  gap: 0.5rem;
`;

const MetricValue = styled.span`
  font-size: 3.75rem;
  font-weight: 300;
  color: white;
  letter-spacing: -0.05em;
  line-height: 1;
`;

const MetricLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textDim};
  font-weight: 700;
`;

const HeartRateVisual = styled(Flex)`
  margin-top: 1rem; /* Reduced margin */
  height: 2rem; /* Reduced height */
  align-items: flex-end;
  gap: 0.25rem;
  opacity: 0.6;
  overflow: hidden; /* Fix: Prevent bars from pushing layout */
`;

const HeartBar = styled(motion.div)`
  width: 0.375rem;
  background-color: ${props => props.theme.colors.teal};
  border-radius: 2px 2px 0 0;
`;

const StressBarContainer = styled.div`
  height: 0.375rem;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
`;

const StressBarFill = styled(motion.div)`
  height: 100%;
  background-color: ${props => props.theme.colors.purple};
  box-shadow: 0 0 15px ${props => props.theme.colors.purple};
`;

const CenterColumn = styled(FlexCol)`
  grid-column: span 8;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  min-height: 400px;
`;

const RightColumn = styled(FlexCol)`
  grid-column: span 2;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  overflow: hidden;
  padding: 1rem 0;
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

const ChatContainer = styled(FlexCol)`
  width: 100%;
  height: 100%;
  z-index: 30;
  overflow-y: auto;
  gap: 0.75rem;
  scrollbar-width: none;
`;

const ChatMessage = styled(motion.div) <{ $sender: 'user' | 'lumen' }>`
  align-self: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  background: ${props => props.$sender === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 242, 195, 0.05)'};
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  color: ${props => props.$sender === 'user' ? props.theme.colors.text : props.theme.colors.teal};
  border: 1px solid ${props => props.$sender === 'user' ? 'rgba(255,255,255,0.1)' : props.theme.colors.tealDim};
  font-size: 1rem;
  line-height: 1.4;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px ${props => props.$sender === 'user' ? 'rgba(255,255,255,0.05)' : props.theme.colors.tealDim};
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



const HeaderInputContainer = styled(Relative)`
  width: 100%;
  max-width: 32rem; 
`;

const Input = styled.input`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 1rem 2rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.main};
  font-weight: 300;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.teal};
    box-shadow: 0 0 20px ${props => props.theme.colors.tealDim};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textDim};
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.teal};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.tealDim};
  }
`;





const Particle = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 50%;
  opacity: 0.2;
`;

const OrbContainer = styled(Relative)`
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
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: ${props => props.theme.colors.red};
    color: black;
    box-shadow: 0 0 15px ${props => props.theme.colors.red};
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
  transition: all 0.2s ease;

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
  const theme = useTheme();

  // Performance Optimization: Pipe biometrics through a ref to avoid re-rendering VisualPhysics
  const biometricsRef = React.useRef({
    bpm: organState?.biometrics?.bpm || 70,
    stress: organState?.biometrics?.stressIndex || 0,
    vitality: organState?.status?.vitality || 1,
    ageRatio: organState?.lifeStatus ? (organState.lifeStatus.age / organState.lifeStatus.lifespan) : 0
  });

  const [thought, setThought] = React.useState<string>("The organism is silent...");
  const [inputValue, setInputValue] = React.useState("");
  const [showKillModal, setShowKillModal] = React.useState(false);
  const [currentInteraction, setCurrentInteraction] = React.useState<{ text: string, sender: 'user' | 'lumen', timestamp: number } | null>(null);

  // Sync biometrics ref without triggering re-render of components that use it (like VisualPhysics)
  React.useEffect(() => {
    if (organState?.biometrics && organState?.status && organState?.lifeStatus) {
      biometricsRef.current = {
        bpm: organState.biometrics.bpm,
        stress: organState.biometrics.stressIndex,
        vitality: organState.status.vitality,
        ageRatio: organState.lifeStatus.age / organState.lifeStatus.lifespan
      };
    }
  }, [organState?.biometrics?.bpm, organState?.biometrics?.stressIndex, organState?.status?.vitality, organState?.lifeStatus?.age, organState?.lifeStatus?.lifespan]);

  React.useEffect(() => {
    const latest = organState?.status?.latestInteraction;
    if (latest) {
      const now = Date.now();
      const isRecent = (now - latest.timestamp) < 60000;
      const isNew = latest.timestamp !== currentInteraction?.timestamp;

      // Only show if it's recent AND it's a new message
      if (isRecent && isNew) {
        setCurrentInteraction(latest);
      }
    }
  }, [organState?.status?.latestInteraction]);

  // Expiration Logic (60s absolute)
  React.useEffect(() => {
    if (!currentInteraction) return;

    const checkExpiration = () => {
      const now = Date.now();
      const diff = now - currentInteraction.timestamp;
      if (diff > 60000) { // 60 seconds
        setCurrentInteraction(null);
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [currentInteraction]);

  React.useEffect(() => {
    // Sync thought from shared state
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

  const { biometrics, status, visualParams, lifeStatus } = organState;



  if (!lifeStatus?.isAlive) {
    return <GenesisScreen />;
  }

  if (!status || !biometrics || !visualParams) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-pulse text-2xl tracking-widest">SYNCHRONIZING BIO-DATA...</div>
      </Container>
    );
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Optimistic UI update or just clear input? 
    // For now just clear and let the organism respond in its own time.
    const message = inputValue;
    setInputValue("");

    try {
      await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };


  const handleKill = async (action: 'wipe' | 'diminish') => {
    try {
      await fetch('http://localhost:3001/api/death', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryAction: action })
      });
      setShowKillModal(false);
      // State update will trigger re-render and show GenesisScreen via useOrgan hook updates
    } catch (e) {
      console.error("Failed to terminate:", e);
    }
  };

  return (
    <Container>
      <BackgroundGradient />
      {/* Particles */}
      <AbsoluteFill>
        {[...Array(20)].map((_, i) => (
          <Particle
            key={i}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animation: `pulse ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </AbsoluteFill>

      <Header>
        <FlexCol>
          <NeuralStatus>Neural Connection Established</NeuralStatus>
          <Flex $gap="1rem" $align="center">
            <StatusDotContainer>
              <StatusDotCore $color={theme.colors.teal} />
              <StatusDotPing $color={theme.colors.teal} />
            </StatusDotContainer>
            <SpecimenTitle>{lifeStatus.name}</SpecimenTitle>
          </Flex>
        </FlexCol>

        {/* Center Input - Absolute or Flex? 
            Let's keep it flex but allow shrink if needed 
        */}
        <HeaderInputContainer style={{ margin: '0 2rem', flex: 1, maxWidth: '500px' }}>
          <Input
            type="text"
            placeholder="Speak to the Organism..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <SendButton onClick={handleSend}>
            <Send size={18} />
          </SendButton>
        </HeaderInputContainer>

        <FlexCol $align="flex-end" style={{ minWidth: 'fit-content' }}>
          <Flex $gap="1rem">
            <StatusBadge>
              <BadgeLabel>GEN:</BadgeLabel>
              <BadgeValue $color={theme.colors.teal}>{lifeStatus.generation}</BadgeValue>
            </StatusBadge>
            <StatusBadge style={{ marginTop: '0.5rem' }}>
              <BadgeLabel>LATENCY:</BadgeLabel>
              <BadgeValue $color={theme.colors.teal}>{status.latency.toFixed(0)}ms</BadgeValue>
            </StatusBadge>
          </Flex>
          <Flex $gap="1rem">


            <StatusBadge>
              <BadgeLabel>AGE:</BadgeLabel>
              <BadgeValue $color={theme.colors.purple}>{Math.round((1 - (lifeStatus.age / lifeStatus.lifespan)) * 100)}%</BadgeValue>
            </StatusBadge>
            <StatusBadge style={{ marginTop: '0.5rem' }}>
              <BadgeLabel>HOMEOSTASIS:</BadgeLabel>
              <BadgeValue $color={status.vitality > 0.6 ? theme.colors.teal : status.vitality > 0.3 ? theme.colors.purple : theme.colors.red}>
                {Math.round(status.vitality * 100)}%
              </BadgeValue>
            </StatusBadge>
          </Flex>
        </FlexCol>
      </Header>

      <MainGrid>
        {/* Left Column */}
        <FlexCol style={{ gridColumn: 'span 2', gap: '1.25rem' }}>

          {/* Heart Rate */}
          <Card $borderColor={`${theme.colors.teal}80`}>
            <CardHeader>
              <Heart size={20} color={theme.colors.teal} />
              <CardTitle>HEART RATE</CardTitle>
            </CardHeader>
            <MetricContainer>
              <MetricValue>{biometrics.bpm}</MetricValue>
              <MetricLabel>BPM</MetricLabel>
            </MetricContainer>
            <HeartRateVisual>
              {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.5].map((h, i) => (
                <HeartBar
                  key={i}
                  animate={{ height: `${(h + Math.random() * 0.2) * 100}%` }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                />
              ))}
            </HeartRateVisual>
          </Card>

          {/* Stress Index */}
          <Card $borderColor={`${theme.colors.purple}80`}>
            <CardHeader>
              <Zap size={20} color={theme.colors.purple} />
              <CardTitle>STRESS INDEX</CardTitle>
            </CardHeader>
            <MetricContainer style={{ marginBottom: '1rem' }}>
              <MetricValue>{biometrics.stressIndex}</MetricValue>
              <MetricLabel>µS</MetricLabel>
            </MetricContainer>
            <StressBarContainer>
              <StressBarFill
                animate={{ width: `${biometrics.stressIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </StressBarContainer>
          </Card>

          {/* HRV */}
          <Card $borderColor="#60a5fa80">
            <CardHeader>
              <Activity size={20} color="#60a5fa" />
              <CardTitle>HRV VARIATION</CardTitle>
            </CardHeader>
            <MetricContainer>
              <MetricValue>{biometrics.hrv}</MetricValue>
              <MetricLabel>ms</MetricLabel>
            </MetricContainer>
          </Card>
        </FlexCol>

        {/* Center Column */}
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
            />
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

        {/* Right Column - Chat History */}
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
      </MainGrid>


      {/* Kill Switch */}
      <KillSwitchContainer>
        <KillButton onClick={() => setShowKillModal(true)}>
          TERMINATE
        </KillButton>
      </KillSwitchContainer>

      {/* Kill Modal */}
      <AnimatePresence>
        {showKillModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalTitle>TERMINATE ORGANISM?</ModalTitle>
              <ModalText>
                This will end the current consciousness. What should happen to the memories?
              </ModalText>

              <FlexCol $gap="1rem">
                <OptionButton onClick={() => handleKill('diminish')}>
                  <OptionTitle>DIMINISH</OptionTitle>
                  <OptionDesc>Retain faint traces of the past (10% Strength)</OptionDesc>
                </OptionButton>

                <OptionButton onClick={() => handleKill('wipe')} style={{ borderColor: theme.colors.red }}>
                  <OptionTitle style={{ color: theme.colors.red }}>ERASE ALL</OptionTitle>
                  <OptionDesc>Complete memory wipe. Tabula Rasa.</OptionDesc>
                </OptionButton>
              </FlexCol>

              <CancelButton onClick={() => setShowKillModal(false)}>
                CANCEL
              </CancelButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container >
  );
};

export default OrganismView;
