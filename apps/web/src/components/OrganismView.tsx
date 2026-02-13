import React from 'react';
import styled, { useTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Zap, Send } from 'lucide-react';
import { useOrgan } from '../context/OrganContext';
import { Flex, FlexCol, Center, Relative, AbsoluteFill } from './shared/Layout';
import { VisualPhysics } from './d3/VisualPhysics';

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
  margin-bottom: 2rem;
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
  gap: 2rem;
  z-index: 10;
  position: relative;
  align-items: center;
  min-height: 0;
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
  margin-bottom: 1.5rem;
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
  margin-top: 1.5rem;
  height: 2.5rem;
  align-items: flex-end;
  gap: 0.375rem;
  opacity: 0.6;
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
  grid-column: span 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
`;

const Quote = styled.div`
  position: absolute;
  top: 0;
  text-align: center;
  color: ${props => props.theme.colors.teal};
  opacity: 0.6;
  font-size: 1.125rem;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 0.05em;
  max-width: 32rem;
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
  font-size: 3rem;
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

const StatusBar = styled(Flex)`
  justify-content: center;
  gap: 3rem;
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  color: ${props => props.theme.colors.textDim};
  padding-bottom: 1rem;
  text-transform: uppercase;
`;

const StatusItem = styled(Flex)`
  align-items: center;
  gap: 0.5rem;
`;

const StatusIndicator = styled.div<{ $color: string }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: ${props => props.$color};
  box-shadow: 0 0 5px ${props => props.$color};
`;

const VitalityGaugeContainer = styled.div`
  position: relative;
  width: 3.5rem;
  height: 50vh;
  max-height: 450px;
  background-color: ${props => props.theme.colors.card};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.375rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
`;

const VitalityFill = styled(motion.div)`
  width: 100%;
  background: linear-gradient(to top, ${props => props.theme.colors.gradientVitalityStart}, ${props => props.theme.colors.gradientVitalityEnd});
  border-radius: 9999px;
  position: relative;
  z-index: 10;
  box-shadow: 0 0 20px ${props => props.theme.colors.tealDim};
`;

const VitalityValue = styled(Center)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2.5rem;
  pointer-events: none;
  z-index: 20;
`;

const VitalityText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: black;
  mix-blend-mode: screen;
  transform: rotate(-90deg);
  white-space: nowrap;
`;

const VerticalLabel = styled(Center)`
  height: 8rem;
`;

const VerticalText = styled.span`
  font-size: 0.625rem;
  letter-spacing: 0.5em;
  color: ${props => props.theme.colors.textDim};
  transform: rotate(-90deg);
  white-space: nowrap;
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
  height: 40vh;
  max-height: 400px;
  width: 100%;
`;

const Orb = styled(motion.div) <{ $coreColor: string }>`
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.$coreColor} 0%, transparent 60%);
  filter: blur(50px);
  position: absolute;
  z-index: 0;
`;

const SvgRings = styled(motion.svg)`
  opacity: 0.2;
  color: ${props => props.theme.colors.teal};
`;

const OrganismView: React.FC = () => {
  const { organState, isConnected } = useOrgan();
  const theme = useTheme();
  const [thought, setThought] = React.useState<string>("The organism is silent...");

  React.useEffect(() => {
    if (organState?.status?.messages && organState.status.messages.length > 0) {
      const latestMessage = organState.status.messages[organState.status.messages.length - 1];
      if (latestMessage) {
        setThought(latestMessage);
      }
    }
  }, [organState?.status?.messages]);

  if (!isConnected || !organState) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-pulse text-2xl tracking-widest">ESTABLISHING NEURAL LINK...</div>
      </Container>
    );
  }

  const { biometrics, status, visualParams } = organState;

  if (!status || !biometrics || !visualParams) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-pulse text-2xl tracking-widest">SYNCHRONIZING BIO-DATA...</div>
      </Container>
    );
  }

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
        <div>
          <NeuralStatus>Neural Connection Established</NeuralStatus>
          <Flex $gap="1rem" $align="center">
            <StatusDotContainer>
              <StatusDotCore $color={theme.colors.teal} />
              <StatusDotPing $color={theme.colors.teal} />
            </StatusDotContainer>
            <SpecimenTitle>Lumen</SpecimenTitle>
          </Flex>
        </div>
        <HeaderInputContainer>
          <Input type="text" placeholder="Speak to the Organism..." />
          <SendButton>
            <Send size={20} />
          </SendButton>
        </HeaderInputContainer>
        <FlexCol $align="flex-end">
          <StatusBadge>
            <BadgeLabel>MODE:</BadgeLabel>
            <BadgeValue $color={theme.colors.purple}>{status.mode}</BadgeValue>
          </StatusBadge>
          <StatusBadge>
            <BadgeLabel>LATENCY:</BadgeLabel>
            <BadgeValue $color={theme.colors.teal}>{status.latency.toFixed(2)}ms</BadgeValue>
          </StatusBadge>
        </FlexCol>
      </Header>

      <MainGrid>
        {/* Left Column */}
        <FlexCol style={{ gridColumn: 'span 3', gap: '1.25rem' }}>

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
            <Quote
              as={motion.div}
              key={thought}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              "{thought}"
            </Quote>
          </AnimatePresence>

          {/* SVG Rings */}
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgRings
              width="600" height="600" viewBox="0 0 600 600" // Reduced size slightly to fit logic
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="300" cy="300" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" />
              <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 10" />
            </SvgRings>
          </AbsoluteFill>

          {/* Orb */}
          <OrbContainer>
            <VisualPhysics
              bpm={biometrics.bpm}
              stress={biometrics.stressIndex}
              vitality={status.vitality}
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

        {/* Right Column */}
        <RightColumn>
          <VitalityGaugeContainer>
            <VitalityFill
              animate={{ height: `${status.vitality * 100}%` }}
              transition={{ type: "spring", stiffness: 30, damping: 20 }}
            />
            <VitalityValue>
              <VitalityText>
                {Math.round(status.vitality * 100)}%
              </VitalityText>
            </VitalityValue>
          </VitalityGaugeContainer>
          <VerticalLabel>
            <VerticalText>HOMEOSTASIS</VerticalText>
          </VerticalLabel>
        </RightColumn>
      </MainGrid>



      <StatusBar>
        <StatusItem>
          <StatusIndicator $color={theme.colors.teal} />
          Synaptic Link: Active
        </StatusItem>
        <StatusItem>
          <StatusIndicator $color={theme.colors.purple} />
          Feedback Loop: Optimized
        </StatusItem>
      </StatusBar>
    </Container>
  );
};

export default OrganismView;
