import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Flex, FlexCol } from '../shared/Layout';
import { useTranslation } from '../../hooks/useTranslation';

const StatusBadge = styled(Flex)`
  align-items: center;
  gap: 0.75rem;
  background-color: ${props => props.theme.ui.background.card};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: ${props => props.theme.config.glass.border};
  margin-top: 0.5rem;
`;

const BadgeLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.ui.text.dim};
  letter-spacing: 0.1em;
`;

const BadgeValue = styled.span<{ $color?: string }>`
  color: ${props => props.$color || 'white'};
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: ${props => props.theme.config.fonts.code};
  text-shadow: ${props => props.$color ? `0 0 10px ${props.$color}80` : 'none'}; 
`;

interface StatusBadgesProps {
    generation: number;
    latency: number;
    vitality: number;
    ageRatio: number;
}

const BadgesContainer = styled(FlexCol)`
  min-width: fit-content;
`;

export const StatusBadges: React.FC<StatusBadgesProps> = ({ generation, latency, vitality, ageRatio }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <BadgesContainer $align="flex-end">
            <Flex $gap="1rem">
                <StatusBadge>
                    <BadgeLabel>{t('gen_label')}</BadgeLabel>
                    <BadgeValue $color={theme.palette.teal.main}>{generation}</BadgeValue>
                </StatusBadge>
                <StatusBadge>
                    <BadgeLabel>{t('latency_label')}</BadgeLabel>
                    <BadgeValue $color={theme.palette.teal.main}>{latency.toFixed(0)}ms</BadgeValue>
                </StatusBadge>
            </Flex>
            <Flex $gap="1rem">
                <StatusBadge>
                    <BadgeLabel>{t('age_label')}</BadgeLabel>
                    <BadgeValue $color={theme.palette.purple.main}>{Math.round((1 - ageRatio) * 100)}%</BadgeValue>
                </StatusBadge>
                <StatusBadge>
                    <BadgeLabel>{t('homeostasis_label')}</BadgeLabel>
                    <BadgeValue $color={vitality > 0.6 ? theme.palette.teal.main : vitality > 0.3 ? theme.palette.purple.main : theme.palette.red.main}>
                        {Math.round(vitality * 100)}%
                    </BadgeValue>
                </StatusBadge>
            </Flex>
        </BadgesContainer>
    );
};
