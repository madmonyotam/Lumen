import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, Reorder } from 'framer-motion';
import type { StrengthDefinition, StrengthCategory } from '@lumen/shared';
import { Flex, FlexCol } from './shared/Layout';
import { X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Container = styled(FlexCol)`
    gap: 1.5rem;
    height: 100%;
`;

const Tabs = styled(Flex)`
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    
    &::-webkit-scrollbar {
        height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
`;

const Tab = styled.button<{ $active: boolean }>`
    background: ${props => props.$active ? 'rgba(0, 242, 254, 0.1)' : 'transparent'};
    border: 1px solid ${props => props.$active ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$active ? '#00f2fe' : props.theme.colors.textDim};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover {
        border-color: #00f2fe;
        color: #00f2fe;
    }
`;

const ContentArea = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    min-height: 400px;
`;

const AvailableList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
    align-content: start;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
`;

const StrengthCard = styled(motion.div) <{ $selected: boolean }>`
    background: ${props => props.$selected ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255, 255, 255, 0.03)'};
    border: 1px solid ${props => props.$selected ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'};
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: ${props => props.$selected ? 'default' : 'pointer'};
    opacity: ${props => props.$selected ? 0.5 : 1};
    font-size: 0.875rem;
    color: ${props => props.$selected ? 'white' : props.theme.colors.textDim};
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
        border-color: rgba(0, 242, 254, 0.5);
        background: rgba(0, 242, 254, 0.05);
    }
`;

const RankingZone = styled(FlexCol)`
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h4`
    margin-bottom: 1rem;
    color: white;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
`;

const RankSlot = styled(Reorder.Item)`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: grab;
    
    &:active {
        cursor: grabbing;
        border-color: #00f2fe;
        scale: 1.02;
    }
`;

const RankNumber = styled.span<{ $isRTL?: boolean }>`
    font-family: ${props => props.theme.fonts.code || props.theme.fonts.main};
    color: #00f2fe;
    font-size: 0.75rem;
    margin-right: ${props => props.$isRTL ? '0' : '1rem'};
    margin-left: ${props => props.$isRTL ? '1rem' : '0'};
    opacity: 0.7;
`;

const RemoveBtn = styled.button`
    background: none;
    border: none;
    color: ${props => props.theme.colors.textDim};
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    
    &:hover {
        color: #ff4d4d;
    }
`;

const EmptySlot = styled.div`
    border: 1px dashed rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: rgba(255, 255, 255, 0.2);
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 0.5rem;
`;

const CATEGORIES: StrengthCategory[] = ['Wisdom', 'Courage', 'Humanity', 'Justice', 'Temperance', 'Transcendence'];

interface Props {
    availableStrengths: StrengthDefinition[];
    selectedIds: string[];
    onUpdateSelection: (ids: string[]) => void;
}

export const SignatureStrengths: React.FC<Props> = ({ availableStrengths, selectedIds, onUpdateSelection }) => {
    const [activeTab, setActiveTab] = useState<StrengthCategory>('Wisdom');
    const { t, isRTL } = useTranslation();

    const getTranslatedCategory = (cat: string) => {
        const key = `strength_${cat.toLowerCase()}` as any;
        return t(key);
    };

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) return;
        if (selectedIds.length >= 5) return; // Max 5
        onUpdateSelection([...selectedIds, id]);
    };

    const handleRemove = (id: string) => {
        onUpdateSelection(selectedIds.filter(sid => sid !== id));
    };

    const handleReorder = (newOrder: string[]) => {
        onUpdateSelection(newOrder);
    };

    return (
        <Container>
            <Tabs>
                {CATEGORIES.map(cat => (
                    <Tab
                        key={cat}
                        $active={activeTab === cat}
                        onClick={() => setActiveTab(cat)}
                    >
                        {getTranslatedCategory(cat)}
                    </Tab>
                ))}
            </Tabs>

            <ContentArea>
                {/* Left: Available Strengths */}
                <AvailableList>
                    {availableStrengths
                        .filter(s => s.category === activeTab)
                        .map(strength => {
                            const isSelected = selectedIds.includes(strength.id);
                            return (
                                <StrengthCard
                                    key={strength.id}
                                    $selected={isSelected}
                                    onClick={() => !isSelected && handleSelect(strength.id)}
                                    layoutId={strength.id}
                                >
                                    {t(('strength_' + strength.id.replace(/-/g, '_')) as any)}
                                </StrengthCard>
                            );
                        })}
                </AvailableList>

                {/* Right: Ranking Zone */}
                <RankingZone>
                    <SectionTitle>
                        {t('core_signature')} ({selectedIds.length}/5)
                    </SectionTitle>

                    <Reorder.Group axis="y" values={selectedIds} onReorder={handleReorder}>
                        {selectedIds.map((id, index) => {
                            const strength = availableStrengths.find(s => s.id === id);
                            if (!strength) return null;
                            return (
                                <RankSlot key={id} value={id}>
                                    <Flex $align="center">
                                        <RankNumber $isRTL={isRTL}>0{index + 1}</RankNumber>
                                        <span>{t(('strength_' + strength.id.replace(/-/g, '_')) as any)}</span>
                                    </Flex>
                                    <RemoveBtn onClick={() => handleRemove(id)}>
                                        <X size={14} />
                                    </RemoveBtn>
                                </RankSlot>
                            );
                        })}
                    </Reorder.Group>

                    {/* Empty Slots */}
                    {Array.from({ length: 5 - selectedIds.length }).map((_, i) => (
                        <EmptySlot key={`empty-${i}`}>
                            {t('empty_slot')} 0{selectedIds.length + i + 1}
                        </EmptySlot>
                    ))}
                </RankingZone>
            </ContentArea>
        </Container>
    );
};
