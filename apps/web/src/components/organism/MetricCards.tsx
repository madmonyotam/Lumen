import React from 'react';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Activity, Zap } from 'lucide-react';
import { Flex, FlexCol } from '../shared/Layout';
import { useTranslation } from '../../hooks/useTranslation';

const Card = styled.div<{ $borderColor?: string }>`
  background-color: ${props => props.theme.colors.card};
  backdrop-filter: blur(${props => props.theme.glass.blur});
  border: ${props => props.theme.glass.border};
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  transition: all ${props => props.theme.animations.normal};

  &:hover {
    border-color: ${props => props.$borderColor || props.theme.colors.tealDim};
    box-shadow: ${props => props.theme.shadows.card};
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
  margin-top: 1rem;
  height: 2rem;
  align-items: flex-end;
  gap: 0.25rem;
  opacity: 0.6;
  overflow: hidden;
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
  box-shadow: ${props => props.theme.shadows.neonPurple};
`;

interface MetricCardProps {
  bpm: number;
  stressIndex: number;
  hrv: number;
}

export const MetricCards: React.FC<MetricCardProps> = ({ bpm, stressIndex, hrv }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <FlexCol style={{ gridColumn: 'span 2', gap: '1.25rem' }}>
      {/* Heart Rate */}
      <Card $borderColor={`${theme.colors.teal}80`}>
        <CardHeader>
          <Heart size={20} color={theme.colors.teal} />
          <CardTitle>{t('heart_rate')}</CardTitle>
        </CardHeader>
        <MetricContainer>
          <MetricValue>{bpm}</MetricValue>
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
          <CardTitle>{t('stress_index')}</CardTitle>
        </CardHeader>
        <MetricContainer style={{ marginBottom: '1rem' }}>
          <MetricValue>{stressIndex}</MetricValue>
          <MetricLabel>µS</MetricLabel>
        </MetricContainer>
        <StressBarContainer>
          <StressBarFill
            animate={{ width: `${stressIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </StressBarContainer>
      </Card>

      {/* HRV */}
      <Card $borderColor={`${theme.colors.blue}80`}>
        <CardHeader>
          <Activity size={20} color={theme.colors.blue} />
          <CardTitle>{t('hrv_variation')}</CardTitle>
        </CardHeader>
        <MetricContainer>
          <MetricValue>{hrv}</MetricValue>
          <MetricLabel>ms</MetricLabel>
        </MetricContainer>
      </Card>
    </FlexCol>
  );
};
