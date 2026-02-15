import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Flex, FlexCol } from '../shared/Layout';

const StatusBadge = styled(Flex)`
  align-items: center;
  gap: 0.75rem;
  background-color: ${props => props.theme.colors.card};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: ${props => props.theme.glass.border};
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

interface StatusBadgesProps {
    generation: number;
    latency: number;
    vitality: number;
    ageRatio: number;
}

export const StatusBadges: React.FC<StatusBadgesProps> = ({ generation, latency, vitality, ageRatio }) => {
    const theme = useTheme();

    return (
        <FlexCol $align="flex-end" style={{ minWidth: 'fit-content' }}>
            <Flex $gap="1rem">
                <StatusBadge>
                    <BadgeLabel>GEN:</BadgeLabel>
                    <BadgeValue $color={theme.colors.teal}>{generation}</BadgeValue>
                </StatusBadge>
                <StatusBadge>
                    <BadgeLabel>LATENCY:</BadgeLabel>
                    <BadgeValue $color={theme.colors.teal}>{latency.toFixed(0)}ms</BadgeValue>
                </StatusBadge>
            </Flex>
            <Flex $gap="1rem">
                <StatusBadge>
                    <BadgeLabel>AGE:</BadgeLabel>
                    <BadgeValue $color={theme.colors.purple}>{Math.round((1 - ageRatio) * 100)}%</BadgeValue>
                </StatusBadge>
                <StatusBadge>
                    <BadgeLabel>HOMEOSTASIS:</BadgeLabel>
                    <BadgeValue $color={vitality > 0.6 ? theme.colors.teal : vitality > 0.3 ? theme.colors.purple : theme.colors.red}>
                        {Math.round(vitality * 100)}%
                    </BadgeValue>
                </StatusBadge>
            </Flex>
        </FlexCol>
    );
};
