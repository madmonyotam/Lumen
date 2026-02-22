import React from 'react';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Activity, Zap } from 'lucide-react';
import { Flex, FlexCol } from '../shared/Layout';
import { useTranslation } from '../../hooks/useTranslation';

const Card = styled.div<{ $borderColor?: string }>`
  background-color: ${props => props.theme.ui.background.card};
  backdrop-filter: blur(${props => props.theme.config.glass.blur});
  border: ${props => props.theme.config.glass.border};
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  transition: ${props => props.theme.config.transitions.normal};

  &:hover {
    border-color: ${props => props.$borderColor || props.theme.palette.teal.dim};
    box-shadow: ${props => props.theme.config.shadows.card};
  }
`;

const CardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardTitle = styled.span`
  font-size: 0.625rem;
  color: ${props => props.theme.ui.text.dim};
  letter-spacing: 0.2em;
`;

const MetricContainer = styled(Flex)`
  align-items: baseline;
  gap: 0.5rem;
`;

const MetricValue = styled.span`
  font-size: 3rem;
  font-weight: 200;
  color: white;
  letter-spacing: -0.05em;
  line-height: 1;
`;

const MetricLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.ui.text.dim};
  font-weight: 500;
  transition: color ${props => props.theme.config.transitions.fast};
`;

const HeartRateVisual = styled(Flex)`
  margin-top: 1rem;
  height: 2rem;
  align-items: flex-end;
  gap: 0.25rem;
  opacity: 0.6;
  overflow: hidden;
`;

const HeartBar = styled(motion.div) <{ $color?: string }>`
  width: 0.375rem;
  background-color: ${props => props.$color || props.theme.ui.brand.primary};
  border-radius: 2px 2px 0 0;
`;

const StressBarContainer = styled.div`
  height: 0.375rem;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.ui.border.dim};
`;

const StressBarFill = styled(motion.div) <{ $color?: string }>`
  height: 100%;
  background-color: ${props => props.$color || props.theme.palette.purple.main};
  box-shadow: ${props => props.theme.config.shadows.neonPurple};
`;

const CardsContainer = styled(FlexCol)`
  grid-column: span 2;
  gap: 1.25rem;
`;

const StressMetricContainer = styled(MetricContainer)`
  margin-bottom: 1rem;
`;

interface MetricCardProps {
  bpm: number;
  stressIndex: number;
  hrv: number;
}

export const MetricCards: React.FC<MetricCardProps> = React.memo(({ bpm, stressIndex, hrv }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const metricColors = {
    bpm: {
      base: theme.palette.teal.main,
      border: `${theme.palette.teal.main}80`,
    },
    stress: {
      base: theme.palette.purple.main,
      border: `${theme.palette.purple.main}80`,
    },
    hrv: {
      base: theme.palette.blue.main,
      border: `${theme.palette.blue.main}80`,
    }
  };

  return (
    <CardsContainer>
      {/* Heart Rate */}
      <Card $borderColor={metricColors.bpm.border}>
        <CardHeader>
          <Heart size={16} color={metricColors.bpm.base} />
          <CardTitle>{t('heart_rate')}</CardTitle>
        </CardHeader>
        <MetricContainer>
          <MetricValue>{bpm}</MetricValue>
          <MetricLabel>{t('unit_bpm')}</MetricLabel>
        </MetricContainer>
        <HeartRateVisual>
          {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.5].map((h, i) => (
            <HeartBar
              key={i}
              $color={metricColors.bpm.base}
              animate={{ height: `${(h + Math.random() * 0.2) * 100}%` }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
            />
          ))}
        </HeartRateVisual>
      </Card>

      {/* Stress Index */}
      <Card $borderColor={metricColors.stress.border}>
        <CardHeader>
          <Zap size={16} color={metricColors.stress.base} />
          <CardTitle>{t('stress_index')}</CardTitle>
        </CardHeader>
        <StressMetricContainer>
          <MetricValue>{stressIndex}</MetricValue>
          <MetricLabel>{t('unit_stress')}</MetricLabel>
        </StressMetricContainer>
        <StressBarContainer>
          <StressBarFill
            $color={metricColors.stress.base}
            animate={{ width: `${stressIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </StressBarContainer>
      </Card>

      {/* HRV */}
      <Card $borderColor={metricColors.hrv.border}>
        <CardHeader>
          <Activity size={16} color={metricColors.hrv.base} />
          <CardTitle>{t('hrv_variation')}</CardTitle>
        </CardHeader>
        <MetricContainer>
          <MetricValue>{hrv}</MetricValue>
          <MetricLabel>{t('unit_ms')}</MetricLabel>
        </MetricContainer>
      </Card>
    </CardsContainer>
  );
});

MetricCards.displayName = 'MetricCards';
