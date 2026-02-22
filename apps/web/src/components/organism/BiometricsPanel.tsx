import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { useTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Zap, Wifi, Dna, Hourglass, Globe, Menu, ChevronRight, ChevronLeft, ShieldCheck, AlignJustify } from 'lucide-react';
import { Flex, FlexCol } from '../shared/Layout';
import { useTranslation } from '../../hooks/useTranslation';

// --- Styled Components ---

const PanelContainer = styled(motion.div) <{ $isRTL?: boolean, $isOpen: boolean }>`
  position: relative;
  height: 100%;
  background-color: ${props => props.theme.colors.card};
  backdrop-filter: blur(${props => props.theme.glass.blur});
  border: ${props => props.theme.glass.border};
  border-radius: 1rem;
  padding: 1.25rem 0.75rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.card};
  white-space: nowrap;
  flex-shrink: 0;
`;

const ToggleButton = styled.button<{ $isRTL?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.teal};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  transition: all ${props => props.theme.animations.fast};
  align-self: flex-start;

  &:hover {
    background: ${props => props.theme.colors.tealDim};
  }
`;

const HeaderRow = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 0.25rem;
  width: 100%;
`;

const PanelTitle = styled(motion.h2)`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
  letter-spacing: 0.05em;
`;

const RealTimeBadge = styled(motion.div)`
  background: rgba(0, 242, 195, 0.1);
  color: ${props => props.theme.colors.teal};
  font-size: 0.6rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  border: 1px solid rgba(0, 242, 195, 0.2);
`;

const MetricsList = styled(FlexCol)`
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
  padding: 0 0.25rem;
  
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const MetricCard = styled(motion.div) <{ $borderColor?: string }>`
  background-color: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  position: relative;
  transition: all ${props => props.theme.animations.normal};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: ${props => props.$borderColor || props.theme.colors.tealDim};
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
`;

const ClosedMetricItem = styled(motion.button) <{ $color?: string }>`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || props.theme.colors.teal};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  margin-bottom: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$color || props.theme.colors.tealDim};
    box-shadow: 0 0 10px ${props => props.$color ? props.$color + '40' : 'rgba(0, 242, 195, 0.2)'};
  }
`;

const TooltipContent = styled(motion.div) <{ $color?: string, $isRTL?: boolean }>`
  position: fixed;
  transform: translateY(-50%);
  background-color: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.$color ? props.$color + '80' : 'rgba(255,255,255,0.1)'};
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: white;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  backdrop-filter: blur(${props => props.theme.glass.blur});
`;

const CardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CardTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.05em;
`;

const MetricValueContainer = styled(Flex)`
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.25rem;
  width: 100%;
`;

const MetricValue = styled.span`
  font-size: 1.75rem;
  font-weight: 500;
  color: white;
  letter-spacing: -0.02em;
  line-height: 1;
`;

const MetricUnit = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textDim};
  font-weight: 500;
`;

const VisualContainer = styled.div`
  height: 1.5rem;
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 0.15rem;
`;

const Bar = styled(motion.div) <{ $color?: string }>`
  flex: 1;
  background-color: ${props => props.$color || props.theme.colors.teal};
  border-radius: 1px 1px 0 0;
`;

const ProgressTrack = styled.div`
  height: 0.25rem;
  width: 100%;
  background-color: rgba(255,255,255,0.1);
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div) <{ $color?: string }>`
  height: 100%;
  background-color: ${props => props.$color || props.theme.colors.purple};
  box-shadow: 0 0 10px ${props => props.$color || props.theme.colors.purple};
`;

const SmallBadge = styled.span<{ $color?: string }>`
  font-size: 0.5rem;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  background: ${props => props.$color ? props.$color + '40' : 'rgba(255,255,255,0.1)'};
  color: ${props => props.$color || 'white'};
  font-weight: bold;
  letter-spacing: 0.1em;
`;

// --- Utils & Props ---

interface BiometricsPanelProps {
    bpm: number;
    stressIndex: number;
    hrv: number;
    latency: number;
    generation: number;
    ageRatio: number;
    vitality: number;
}

// --- Tooltip Wrapper Component ---
const ClosedMetricWithTooltip = ({ m, togglePanel, isRTL }: { m: any, togglePanel: () => void, isRTL: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState<{ top: number, left?: number, right?: number } | null>(null);

    useEffect(() => {
        if (isHovered && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setCoords({
                top: rect.top + rect.height / 2,
                ...(isRTL ? { right: window.innerWidth - rect.left + 10 } : { left: rect.right + 10 })
            });
        }
    }, [isHovered, isRTL]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            <ClosedMetricItem
                ref={ref}
                $color={m.color}
                onClick={togglePanel}
            >
                <m.icon size={20} />
            </ClosedMetricItem>

            {createPortal(
                <AnimatePresence>
                    {isHovered && coords && (
                        <TooltipContent
                            $color={m.color}
                            $isRTL={isRTL}
                            style={{
                                top: coords.top,
                                left: coords.left,
                                right: coords.right
                            }}
                            initial={{ opacity: 0, x: isRTL ? 10 : -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: isRTL ? 5 : -5, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            <span style={{ color: `${m.color}`, opacity: 0.9 }}>{m.title}:</span>
                            <span>{m.value}</span>
                            {m.unit && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>{m.unit}</span>}
                        </TooltipContent>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export const BiometricsPanel: React.FC<BiometricsPanelProps> = React.memo(({
    bpm, stressIndex, hrv, latency, generation, ageRatio, vitality
}) => {
    const theme = useTheme();
    const { t, isRTL } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => setIsOpen(!isOpen);

    const metrics = [
        {
            id: 'age',
            icon: Hourglass,
            title: t('age_label'),
            value: `${Math.round((1 - ageRatio) * 100)}`,
            unit: '%',
            color: ageRatio > 0.8 ? theme.colors.red : ageRatio > 0.5 ? theme.colors.purple : theme.colors.teal,
            renderVisual: () => (
                <ProgressTrack>
                    <ProgressFill
                        $color={theme.colors.purple}
                        initial={{ width: 0 }}
                        animate={{ width: `${(1 - ageRatio) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </ProgressTrack>
            )
        },
        {
            id: 'bpm',
            icon: Heart,
            title: t('heart_rate'),
            value: bpm,
            unit: t('unit_bpm'),
            color: bpm > 100 ? theme.colors.red : bpm < 50 ? theme.colors.blue : theme.colors.teal,
            renderVisual: () => (
                <VisualContainer>
                    {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.5, 0.8, 0.3, 0.5, 0.9, 0.2].map((h, i) => (
                        <Bar
                            key={i}
                            $color={theme.colors.teal}
                            animate={{ height: `${(h + Math.random() * 0.2) * 100}%` }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                        />
                    ))}
                </VisualContainer>
            )
        },
        {
            id: 'stress',
            icon: Zap,
            title: t('stress_index'),
            value: `${Math.round(stressIndex * 100)}`,
            unit: '%',
            color: stressIndex > 0.6 ? theme.colors.red : stressIndex > 0.3 ? theme.colors.purple : theme.colors.teal,
            badge: stressIndex > 0.6 ? 'HIGH' : stressIndex > 0.3 ? 'MED' : 'LOW',
            renderVisual: () => (
                <ProgressTrack>
                    <ProgressFill
                        $color={theme.colors.purple}
                        initial={{ width: 0 }}
                        animate={{ width: `${stressIndex * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </ProgressTrack>
            )
        },
        {
            id: 'hrv',
            icon: Activity,
            title: t('hrv_variation'),
            value: hrv,
            unit: t('unit_ms'),
            color: hrv < 30 ? theme.colors.red : hrv > 70 ? theme.colors.teal : theme.colors.blue,
            renderVisual: () => (
                <div style={{ height: '1.5rem', width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 24">
                        <motion.path
                            d="M 0,12 Q 25,0 50,12 T 100,12"
                            fill="none"
                            stroke={theme.colors.blue}
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                </div>
            )
        },
        {
            id: 'homeostasis',
            icon: Globe,
            title: t('homeostasis_label'),
            value: `${Math.round(vitality * 100)}`,
            unit: '%',
            color: vitality > 0.6 ? theme.colors.teal : vitality > 0.3 ? theme.colors.purple : theme.colors.red,
            badge: vitality > 0.6 ? 'STABLE →' : 'UNSTABLE ↘',
            renderVisual: () => null // Minimal pure text metric like reference
        },
        {
            id: 'latency',
            icon: Wifi,
            title: t('latency_label'),
            value: latency.toFixed(0),
            unit: 'ms',
            color: latency > 300 ? theme.colors.red : latency > 150 ? theme.colors.purple : theme.colors.teal,
            renderVisual: () => null
        },
        {
            id: 'gen',
            icon: Dna,
            title: t('gen_label'),
            value: generation,
            unit: '',
            color: theme.colors.blue,
            renderVisual: () => null
        }
    ];

    return (
        <PanelContainer
            $isRTL={isRTL}
            $isOpen={isOpen}
            layout
            initial={false}
            animate={{
                width: isOpen ? 320 : 72
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <Flex style={{ padding: '0 0.5rem', marginBottom: '1rem', flexShrink: 0, alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center' }}>
                <ToggleButton onClick={togglePanel} $isRTL={isRTL} style={{ marginBottom: 0 }}>
                    <AlignJustify size={20} />
                </ToggleButton>
            </Flex>

            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="open"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
                    >
                        <MetricsList>
                            {metrics.map((m) => (
                                <MetricCard key={m.id} $borderColor={`${m.color}80`}>
                                    <CardHeader>
                                        <Flex $gap="0.5rem" className="items-center">
                                            <div style={{
                                                padding: '0.4rem',
                                                borderRadius: '0.5rem',
                                                background: `${m.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <m.icon size={16} color={m.color} />
                                            </div>
                                            <CardTitle>{m.title}</CardTitle>
                                        </Flex>
                                        <FlexCol $align={isRTL ? "flex-start" : "flex-end"}>
                                            {m.badge && <SmallBadge $color={m.color}>{m.badge}</SmallBadge>}
                                        </FlexCol>
                                    </CardHeader>

                                    <Flex className="w-full justify-between items-end mt-1" style={{ gap: '1rem' }}>
                                        <div style={{ flex: 1, height: '1.5rem', display: 'flex', alignItems: 'flex-end' }}>
                                            {m.renderVisual()}
                                        </div>
                                        <MetricValueContainer style={{ width: 'auto' }}>
                                            <MetricValue>{m.value}</MetricValue>
                                            {m.unit && <MetricUnit>{m.unit}</MetricUnit>}
                                        </MetricValueContainer>
                                    </Flex>
                                </MetricCard>
                            ))}
                        </MetricsList>
                    </motion.div>
                ) : (
                    <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                    >
                        {metrics.map((m) => (
                            <ClosedMetricWithTooltip
                                key={m.id}
                                m={m}
                                togglePanel={togglePanel}
                                isRTL={isRTL}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </PanelContainer>
    );
});

BiometricsPanel.displayName = 'BiometricsPanel';
