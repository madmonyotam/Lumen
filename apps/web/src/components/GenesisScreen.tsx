import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Clock, User, Heart, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { LUMEN_CONFIG } from '../lumen.config';
import { Flex, FlexCol } from './shared/Layout';
import { useGenesisOptions } from '../hooks/useGenesisOptions';
import { useTranslation } from '../hooks/useTranslation';
import { SignatureStrengths } from './SignatureStrengths';
import { TraitSlider } from './TraitSlider';
import type { TraitDescription } from '@lumen/shared';
import { validateGenesisState } from '../utils/genesisValidation';
import type { ValidationResult } from '../utils/genesisValidation';
import { StabilityIndicator } from './StabilityIndicator';
import type { LumenPersona, BigFiveScores, InternalScores } from '@lumen/shared/types/index';
import { Select } from './atoms/Select';

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

// const TRAITS = ["Stoic", "Curious", "Anxious", "Poetic", "Analytical", "Rebellious", "Serene", "Erratic"]; // Removed hardcoded

// const TRAITS = ["Stoic", "Curious", "Anxious", "Poetic", "Analytical", "Rebellious", "Serene", "Erratic"]; // Removed hardcoded

const GenesisScreen: React.FC = () => {
    const [name, setName] = useState('Lumen');
    const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('non-binary');
    const [language, setLanguage] = useState<'en' | 'he'>('en');
    // Store selected traits as map: { openness: 'The Abstract Visionary', ... }
    // Or just list of IDs? The backend takes string[].
    // Let's stick to IDs for now, or Labels. The previous code used Labels.
    // Ideally we use IDs. The slider will find the ID based on value.
    const [traitValues, setTraitValues] = useState<Record<string, number>>({}); // dimension -> value (0-100)
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]); // Ranked IDs
    const [lifespanIndex, setLifespanIndex] = useState(1); // 0=Short, 1=Medium, 2=Long
    const [step, setStep] = useState(0); // 0=Identity, 1=Psychology, 2=Biology, 3=Stability, 4=Strengths

    const { t, isRTL } = useTranslation();

    const { options, loading, error } = useGenesisOptions();

    // Use fetched options or fallback to empty/loading state
    const traits = options?.traits || [];
    const lifespans = options?.mechanics || [];
    const strengths = options?.strengths || []; // For next task

    // Validation State
    const [validation, setValidation] = useState<ValidationResult>({
        conflicts: [],
        stabilityScore: 100,
        details: []
    });

    // Run validation when traits change
    useEffect(() => {
        const result = validateGenesisState(traitValues);
        setValidation(result);

        // Log details if conflicts exist
        if (result.conflicts.length > 0) {
            console.log('[Genesis Conflict Engine]:', result.details);
        }
    }, [traitValues]);

    if (loading) return <Overlay>{t('loading_genesis')}</Overlay>;
    if (error) return <Overlay>{t('error_prefix')}: {error}</Overlay>;

    // Helper to group traits by dimension
    const groupTraits = (list: TraitDescription[]) => {
        const groups: Record<string, TraitDescription[]> = {};
        list.forEach(t => {
            const dim = t.id.split('_')[0]; // simple heuristic
            if (!groups[dim]) groups[dim] = [];
            groups[dim].push(t);
        });
        return groups;
    };

    const getTraitForValue = (val: number, list: TraitDescription[]) => {
        // Find which range covers 'val'. ID is dim_min_max
        return list.find(t => {
            const parts = t.id.split('_');
            const min = parseInt(parts[parts.length - 2]);
            const max = parseInt(parts[parts.length - 1]);
            // Ensure 1-20 covers 0-20, 81-100 covers 81-100
            // Map 0 -> 1
            const normalized = Math.max(1, Math.min(100, val));
            return normalized >= min && normalized <= max;
        });
    };

    const renderTraitSliders = (category: string) => {
        const catTraits = traits.filter(t => t.category === category);
        const grouped = groupTraits(catTraits);

        return Object.entries(grouped).map(([dim, list]) => (
            <TraitSlider
                key={dim}
                label={t(('trait_' + dim) as any)}
                value={traitValues[dim] ?? 50}
                onChange={(v) => {
                    // Optimistic update for UI
                    // But we want to persist only on commit?
                    // Actually TraitSlider handles local dragging.
                    // But we want "Live Tooltip" which implies we need the lookup here?
                    // Or pass lookup to slider?
                    // We passed `getTooltipText` to slider.
                    // So here we only update state on commit?
                    // "onChange should only update local ... onDragEnd commit to store".
                    // Since `traitValues` IS local state (not Redux), it's fine to update it.
                    // But if we want to avoid re-renders of the WHOLE GenesisScreen, 
                    // maybe we should debit.
                    // For now, let's update. React is fast enough for 5 sliders.
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

    const getSelectedTraitsList = () => {
        const list: string[] = [];
        // Map traitValues to trait Labels/IDs
        // We need to group dimensions first
        if (!options) return [];

        const categories = ['OCEAN', 'Biology'];
        categories.forEach(cat => {
            const catTraits = options.traits.filter(t => t.category === cat);
            // Group by dimension key
            const grouped = groupTraits(catTraits);
            Object.keys(grouped).forEach(dim => {
                const val = traitValues[dim] ?? 50; // Default 50
                const trait = getTraitForValue(val, grouped[dim]);
                if (trait) list.push(trait.label);
            });
        });
        return list;
    };

    const handleGenesis = async () => {
        // Assemble LumenPersona
        const ocean: Partial<BigFiveScores> = {};
        const internal: Partial<InternalScores> = {};

        // Helper to safely get value
        const getVal = (key: string) => traitValues[key] ?? 50;

        // Map OCEAN
        ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].forEach(k => {
            (ocean as any)[k] = getVal(k);
        });

        // Map Internal
        ['attachment', 'temperament', 'cognitive', 'shadow'].forEach(k => {
            (internal as any)[k] = getVal(k);
        });

        const stringsConficts = validation.conflicts.map(c => c.id);

        const persona: LumenPersona = {
            core: {
                name,
                gender,
                language,
                lifespan: lifespans[lifespanIndex]?.value || 24 * 60 * 60 * 1000
            },
            traits: ocean as BigFiveScores,
            internal: internal as InternalScores,
            strengths: selectedStrengths,
            conflicts: stringsConficts
        };

        const payload = {
            persona,
            traitLabels: getSelectedTraitsList()
        };

        try {
            const res = await fetch(`${LUMEN_CONFIG.API_URL}/api/genesis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Genesis failed');
            // Success! The pulse loop will handle the update
        } catch (e) {
            console.error(e);
            alert("The spark failed to ignite. Check neural connection.");
        }
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
                    <Flex style={{ justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
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
                                        <Label><User size={12} style={{ marginRight: 4 }} /> {t('name_label')}</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t('name_placeholder')}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label><Heart size={12} style={{ marginRight: 4 }} /> {t('gender_label')}</Label>
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
                                        <Label><Globe size={12} style={{ marginRight: 4 }} /> {t('language_label')}</Label>
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
                                        <Label><Clock size={12} style={{ marginRight: 4 }} /> {t('lifespan_label')}</Label>
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
                                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#00f2fe' }}>
                                            {t('lifespan_expectancy')}: {lifespans[lifespanIndex]?.label}
                                        </p>
                                    </FormGroup>
                                </Grid>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                            >
                                <FormGroup>
                                    <Label><Shield size={12} style={{ marginRight: 4 }} /> {t('psych_arch')}</Label>
                                    {renderTraitSliders('OCEAN')}
                                </FormGroup>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                            >
                                <FormGroup>
                                    <Label><Shield size={12} style={{ marginRight: 4 }} /> {t('bio_wiring')}</Label>
                                    {renderTraitSliders('Biology')}
                                </FormGroup>
                            </motion.div>
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
                    <Flex $direction='row' style={{ gap: '1rem' }}>
                        {step > 0 && (
                            <NavButton onClick={() => setStep(step - 1)} style={{ flex: 1, justifyContent: 'center' }}>
                                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t('back')}
                            </NavButton>
                        )}
                        {step < 4 ? (
                            <SubmitButton
                                style={{ flex: 1 }}
                                onClick={() => setStep(step + 1)}
                            >
                                {t('next_phase')} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                            </SubmitButton>
                        ) : (
                            <SubmitButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenesis}
                                style={{ flex: 1 }}
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
