import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Clock, User, Heart, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { Flex, FlexCol } from './shared/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { SignatureStrengths } from './SignatureStrengths';
import { TraitSlider } from './TraitSlider';
import type { TraitDescription } from '@lumen/shared';
import type { ValidationResult } from '../utils/genesisValidation';
import { StabilityIndicator } from './StabilityIndicator';
import { Select } from './atoms/Select';

const MotionFlexCol = motion(FlexCol);

const LifespanExpectancy = styled.p`
    text-align: center;
    font-size: 0.75rem;
    color: ${props => props.theme.colors.teal};
`;

const Overlay = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: radial-gradient(circle at center, #0a0a0c 0%, #000 100%);
    color: white;
    font-family: ${props => props.theme.fonts.main};
`;

const Content = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
    height: 750px;
    max-height: 90vh;
    padding: 1.5rem;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
    background: linear-gradient(to right, #00f2fe, #4facfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    text-align: center;
    color: ${props => props.theme.colors.textDim};
    font-size: 0.875rem;
    letter-spacing: 0.1em;
`;

const FormGroup = styled(FlexCol)`
    gap: 1.5rem;
    margin-bottom: 1rem;
`;

const Label = styled.label`
    font-size: 0.625rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textDim};
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const Input = styled.input`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem 1.5rem;
    color: white;
    font-size: 1rem;
    width: 100%;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #00f2fe;
        background: rgba(255, 255, 255, 0.08);
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
`;

const LifespanSlider = styled.input`
    width: 100%;
    accent-color: #00f2fe;
    margin-top: 1rem;
`;

const LifespanLabels = styled(Flex)`
    justify-content: space-between;
    font-size: 0.625rem;
    color: ${props => props.theme.colors.textDim};
    margin-top: 0.5rem;
`;

const SubmitButton = styled(motion.button)`
    background: linear-gradient(to right, #00f2fe, #4facfe);
    border: none;
    border-radius: 9999px;
    padding: 1.25rem;
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1rem;
    box-shadow: 0 10px 30px rgba(0, 242, 254, 0.3);
`;

const NavButton = styled(motion.button)`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    padding: 1rem 2rem;
    color: white;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
        border-color: #00f2fe;
        color: #00f2fe;
    }
`;

const StepDot = styled.div<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$active ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'};
    transition: all 0.3s ease;
`;

const StepWrapper = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    padding-right: 0.5rem;
    position: relative;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

export interface GenesisScreenProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    gender: 'male' | 'female' | 'non-binary';
    setGender: React.Dispatch<React.SetStateAction<'male' | 'female' | 'non-binary'>>;
    language: 'en' | 'he';
    setLanguage: React.Dispatch<React.SetStateAction<'en' | 'he'>>;
    traitValues: Record<string, number>;
    setTraitValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    selectedStrengths: string[];
    setSelectedStrengths: React.Dispatch<React.SetStateAction<string[]>>;
    lifespanIndex: number;
    setLifespanIndex: React.Dispatch<React.SetStateAction<number>>;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    validation: ValidationResult;
    options: any;
    loading: boolean;
    error: Error | null;
    handleGenesis: () => Promise<void>;
}

const GenesisScreen: React.FC<GenesisScreenProps> = (props) => {
    const {
        name, setName,
        gender, setGender,
        language, setLanguage,
        traitValues, setTraitValues,
        selectedStrengths, setSelectedStrengths,
        lifespanIndex, setLifespanIndex,
        step, setStep,
        validation,
        options, loading, error,
        handleGenesis
    } = props;

    const { t, isRTL } = useTranslation();

    const traits = options?.traits || [];
    const lifespans = options?.mechanics || [];
    const strengths = options?.strengths || [];

    if (loading) return <Overlay>{t('loading_genesis')}</Overlay>;
    if (error) return <Overlay>{t('error_prefix')}: {error.message}</Overlay>;

    const groupTraits = (list: TraitDescription[]) => {
        const groups: Record<string, TraitDescription[]> = {};
        list.forEach(t => {
            const dim = t.id.split('_')[0];
            if (!groups[dim]) groups[dim] = [];
            groups[dim].push(t);
        });
        return groups;
    };

    const getTraitForValue = (val: number, list: TraitDescription[]) => {
        return list.find(t => {
            const parts = t.id.split('_');
            const min = parseInt(parts[parts.length - 2]);
            const max = parseInt(parts[parts.length - 1]);
            const normalized = Math.max(1, Math.min(100, val));
            return normalized >= min && normalized <= max;
        });
    };

    const renderTraitSliders = (category: string) => {
        const catTraits = traits.filter((t: TraitDescription) => t.category === category);
        const grouped = groupTraits(catTraits);

        return Object.entries(grouped).map(([dim, list]) => (
            <TraitSlider
                key={dim}
                label={t(('trait_' + dim) as any)}
                value={traitValues[dim] ?? 50}
                onChange={(v) => {
                    setTraitValues(prev => ({ ...prev, [dim]: v }));
                }}
                onCommit={(v) => {
                    setTraitValues(prev => ({ ...prev, [dim]: v }));
                }}
                getTooltipText={(v) => {
                    const tr = getTraitForValue(v, list);
                    return tr ? t(tr.id as any) : 'Unknown';
                }}
            />
        ));
    };

    return (
        <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Content
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div>
                    <Title>{t('genesis_title')}</Title>
                    <Subtitle>{t('genesis_subtitle')}</Subtitle>
                    <Flex $justify="center" $gap="0.5rem" style={{ marginTop: '1rem' }}>
                        <StepDot $active={step === 0} />
                        <StepDot $active={step === 1} />
                        <StepDot $active={step === 2} />
                        <StepDot $active={step === 3} />
                        <StepDot $active={step === 4} />
                    </Flex>
                </div>

                <StepWrapper>
                    <AnimatePresence mode='wait'>
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <Grid>
                                    <FormGroup>
                                        <Label><User size={12} /> {t('name_label')}</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t('name_placeholder')}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label><Heart size={12} /> {t('gender_label')}</Label>
                                        <Select
                                            value={gender}
                                            onChange={(val) => setGender(val as any)}
                                            options={[
                                                { value: "non-binary", label: t('gender_non_binary') },
                                                { value: "male", label: t('gender_male') },
                                                { value: "female", label: t('gender_female') }
                                            ]}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label><Globe size={12} /> {t('language_label')}</Label>
                                        <Select
                                            value={language}
                                            onChange={(val) => setLanguage(val as any)}
                                            options={[
                                                { value: "en", label: t('language_english') },
                                                { value: "he", label: t('language_hebrew') }
                                            ]}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label><Clock size={12} /> {t('lifespan_label')}</Label>
                                        <LifespanSlider
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="1"
                                            value={lifespanIndex}
                                            onChange={(e) => setLifespanIndex(parseInt(e.target.value))}
                                        />
                                        <LifespanLabels>
                                            <span>{t('lifespan_short')}</span>
                                            <span>{t('lifespan_medium')}</span>
                                            <span>{t('lifespan_long')}</span>
                                        </LifespanLabels>
                                        <LifespanExpectancy>
                                            {t('lifespan_expectancy')}: {lifespans[lifespanIndex]?.label}
                                        </LifespanExpectancy>
                                    </FormGroup>
                                </Grid>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <MotionFlexCol
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                $gap="2.5rem"
                            >
                                <FormGroup>
                                    <Label><Shield size={12} /> {t('psych_arch')}</Label>
                                    {renderTraitSliders('OCEAN')}
                                </FormGroup>
                            </MotionFlexCol>
                        )}

                        {step === 2 && (
                            <MotionFlexCol
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                $gap="2.5rem"
                            >
                                <FormGroup>
                                    <Label><Shield size={12} /> {t('bio_wiring')}</Label>
                                    {renderTraitSliders('Biology')}
                                </FormGroup>
                            </MotionFlexCol>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step4"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                            >
                                <SignatureStrengths
                                    availableStrengths={strengths}
                                    selectedIds={selectedStrengths}
                                    onUpdateSelection={setSelectedStrengths}
                                />
                            </motion.div>
                        )}




                    </AnimatePresence>
                </StepWrapper>

                <Flex $direction='column'>
                    {step !== 0 && (
                        <StabilityIndicator
                            stability={validation.stabilityScore}
                            conflicts={validation.conflicts}
                        />
                    )}
                    <Flex $direction='row' $gap="1rem">
                        {step > 0 && (
                            <NavButton onClick={() => setStep(step - 1)}>
                                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t('back')}
                            </NavButton>
                        )}
                        {step < 4 ? (
                            <SubmitButton onClick={() => setStep(step + 1)}>
                                {t('next_phase')} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                            </SubmitButton>
                        ) : (
                            <SubmitButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenesis}
                            >
                                <Sparkles size={20} />
                                {t('ignite_spark')}
                            </SubmitButton>
                        )}
                    </Flex>
                </Flex>
            </Content>
        </Overlay>
    );
};

export default GenesisScreen;
