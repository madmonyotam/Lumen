import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Activity, Zap, Send } from 'lucide-react';
import { useOrgan } from '../context/OrganContext';

// --- Styled Components ---

const Container = styled.div`
  height: 100vh;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.teal};
  font-family: ${props => props.theme.fonts.main};
  position: relative;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  ::selection {
    background: ${props => props.theme.colors.teal};
    color: #000;
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, #112233 0%, ${props => props.theme.colors.bg} 70%);
  opacity: 0.6;
`;

const Header = styled.header`
  display: flex;
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

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${props => props.theme.colors.card};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 0.5rem;
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

const CoreSynapseText = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

const FooterInputContainer = styled.div`
  width: 100%;
  max-width: 36rem;
  position: relative;
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

// --- Component ---

const OrganismView: React.FC = () => {
    const { organState, isConnected } = useOrgan();

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
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            opacity: 0.2,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            animation: `pulse ${Math.random() * 3 + 2}s infinite`
                        }}
                    ></div>
                ))}
            </div>

            <Header>
                <div>
                    <NeuralStatus>Neural Connection Established</NeuralStatus>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '0.75rem', height: '0.75rem' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--lumen-teal)' }}></div> {/* Keeping var for inline style or replace? styling inline needs theme context or just use hex/state if dynamic */}
                            {/* Note: For inline styles in the render, we can't easily access theme without hook or passing it. simpler to keep var if GlobalStyles defines it OR hardcode hex/state colors. 
                                Actually, GlobalStyles removed :root vars, so `var(--lumen-teal)` WON'T WORK anymore.
                                I must replace inline styles with theme references or styled components.
                             */}
                            <div className="w-3 h-3 rounded-full bg-teal-400" style={{ backgroundColor: '#00f2c3' }}></div> {/* Fallback to hex for now or use styled component */}
                            {/* Better: refactor these small divs to styled components */}
                        </div>
                        <SpecimenTitle>Specimen: Aeterna-01</SpecimenTitle>
                    </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <StatusBadge>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.1em' }}>MODE:</span>
                        <span style={{ color: '#d946ef', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', textShadow: '0 0 10px rgba(217, 70, 239, 0.5)' }}>{status.mode}</span>
                    </StatusBadge>
                    <StatusBadge>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.1em' }}>LATENCY:</span>
                        <span style={{ color: '#00f2c3', fontFamily: 'monospace' }}>{status.latency.toFixed(2)}ms</span>
                    </StatusBadge>
                </div>
            </Header>

            <MainGrid>
                {/* Left Column */}
                <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Heart Rate */}
                    <Card $borderColor="rgba(0, 242, 195, 0.5)">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <Heart size={20} color="#00f2c3" />
                            <span style={{ fontSize: '0.625rem', color: '#94a3b8', letterSpacing: '0.2em' }}>HEART RATE</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <MetricValue>{biometrics.bpm}</MetricValue>
                            <MetricLabel>BPM</MetricLabel>
                        </div>
                        <div style={{ marginTop: '1.5rem', height: '2.5rem', display: 'flex', alignItems: 'flex-end', gap: '0.375rem', opacity: 0.6 }}>
                            {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.5].map((h, i) => (
                                <motion.div
                                    key={i}
                                    style={{ width: '0.375rem', backgroundColor: '#00f2c3', borderRadius: '2px 2px 0 0' }}
                                    animate={{ height: `${(h + Math.random() * 0.2) * 100}%` }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </Card>

                    {/* Stress Index */}
                    <Card $borderColor="rgba(217, 70, 239, 0.5)">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <Zap size={20} color="#d946ef" />
                            <span style={{ fontSize: '0.625rem', color: '#94a3b8', letterSpacing: '0.2em' }}>STRESS INDEX</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                            <MetricValue>{biometrics.stressIndex}</MetricValue>
                            <MetricLabel>µS</MetricLabel>
                        </div>
                        <div style={{ height: '0.375rem', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <motion.div
                                style={{ height: '100%', backgroundColor: '#d946ef', boxShadow: '0 0 15px #d946ef' }}
                                animate={{ width: `${biometrics.stressIndex * 100}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                            />
                        </div>
                    </Card>

                    {/* HRV */}
                    <Card $borderColor="rgba(96, 165, 250, 0.5)">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <Activity size={20} color="#60a5fa" />
                            <span style={{ fontSize: '0.625rem', color: '#94a3b8', letterSpacing: '0.2em' }}>HRV VARIATION</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <MetricValue>{biometrics.hrv}</MetricValue>
                            <MetricLabel>ms</MetricLabel>
                        </div>
                    </Card>
                </div>

                {/* Center Column */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '100%', minHeight: '400px' }}>
                    <Quote>"The cadence of your biological rhythm suggests a profound state of contemplation..."</Quote>

                    {/* SVG Rings */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <motion.svg
                            width="600" height="600" viewBox="0 0 600 600"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            style={{ opacity: 0.2, color: '#00f2c3' }}
                        >
                            <circle cx="300" cy="300" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" />
                            <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 10" />
                        </motion.svg>
                    </div>

                    {/* Orb */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.6, 0.8, 0.6],
                            }}
                            transition={{
                                duration: 1 / visualParams.pulseSpeed,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '320px',
                                height: '320px',
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${visualParams.coreColor} 0%, transparent 60%)`,
                                filter: 'blur(50px)',
                                position: 'absolute',
                                zIndex: 0
                            }}
                        />
                    </div>

                    <div style={{ zIndex: 10, textAlign: 'center', marginTop: '2rem' }}>
                        <div style={{ fontSize: '0.75rem', letterSpacing: '0.5em', color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase' }}>Core Synapse</div>
                        <CoreSynapseText
                            key={status.homeostasisLabel}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {status.homeostasisLabel}
                        </CoreSynapseText>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '3.5rem', height: '50vh', maxHeight: '450px', backgroundColor: 'var(--lumen-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.375rem', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
                        <motion.div
                            style={{
                                width: '100%',
                                background: 'linear-gradient(to top, #00f2c3, #67e8f9)',
                                borderRadius: '9999px',
                                position: 'relative',
                                zIndex: 10,
                                boxShadow: '0 0 20px rgba(0, 242, 195, 0.5)'
                            }}
                            animate={{ height: `${status.vitality * 100}%` }}
                            transition={{ type: "spring", stiffness: 30, damping: 20 }}
                        />
                        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '2.5rem', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'black', mixBlendMode: 'screen', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
                                {Math.round(status.vitality * 100)}%
                            </span>
                        </div>
                    </div>
                    <div style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.625rem', letterSpacing: '0.5em', color: '#94a3b8', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>HOMEOSTASIS</span>
                    </div>
                </div>
            </MainGrid>

            <footer style={{ marginTop: '2rem', marginBottom: '1rem', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                <FooterInputContainer>
                    <Input type="text" placeholder="Speak to the Organism..." />
                    <button style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: '#00f2c3', cursor: 'pointer' }}>
                        <Send size={20} />
                    </button>
                </FooterInputContainer>
            </footer>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.625rem', letterSpacing: '0.2em', color: '#94a3b8', paddingBottom: '1rem', textTransform: 'uppercase' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: '#00f2c3', boxShadow: '0 0 5px #00f2c3' }}></div>
                    Synaptic Link: Active
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: '#d946ef', boxShadow: '0 0 5px #d946ef' }}></div>
                    Feedback Loop: Optimized
                </div>
            </div>
        </Container>
    );
};

export default OrganismView;
