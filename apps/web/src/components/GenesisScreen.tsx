import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Clock, User, Heart, Globe } from 'lucide-react';
import { LUMEN_CONFIG } from '../lumen.config';
import { Flex, FlexCol } from './shared/Layout';

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
    max-width: 600px;
    padding: 3rem;
    gap: 2.5rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
    font-size: 2.5rem;
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
    gap: 1rem;
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

const Select = styled.select`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem 1.5rem;
    color: white;
    font-size: 1rem;
    width: 100%;
    appearance: none;

    &:focus {
        outline: none;
        border-color: #00f2fe;
    }
`;

const TraitPills = styled(Flex)`
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const TraitPill = styled.button<{ $active: boolean }>`
    background: ${props => props.$active ? 'linear-gradient(to right, #00f2fe80, #4facfe80)' : 'rgba(255, 255, 255, 0.05)'};
    border: 1px solid ${props => props.$active ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$active ? 'white' : props.theme.colors.textDim};
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #00f2fe;
    }
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

const TRAITS = ["Stoic", "Curious", "Anxious", "Poetic", "Analytical", "Rebellious", "Serene", "Erratic"];

const GenesisScreen: React.FC = () => {
    const [name, setName] = useState('Lumen');
    const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('non-binary');
    const [language, setLanguage] = useState<'en' | 'he'>('en');
    const [selectedTraits, setSelectedTraits] = useState<string[]>(["Curious"]);
    const [lifespanIndex, setLifespanIndex] = useState(1); // 0=Short, 1=Medium, 2=Long

    const lifespans = [
        { label: 'Transient (4h)', value: 4 * 60 * 60 * 1000 },
        { label: 'Eternal (24h)', value: 24 * 60 * 60 * 1000 },
        { label: 'Ephemeral (1w)', value: 7 * 24 * 60 * 60 * 1000 },
    ];

    const toggleTrait = (trait: string) => {
        if (selectedTraits.includes(trait)) {
            setSelectedTraits(selectedTraits.filter(t => t !== trait));
        } else {
            setSelectedTraits([...selectedTraits, trait]);
        }
    };

    const handleGenesis = async () => {
        const payload = {
            name,
            gender,
            language,
            traits: selectedTraits,
            lifespan: lifespans[lifespanIndex].value
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
                    <Title>Genesis</Title>
                    <Subtitle>Configure the parameters of a new existence</Subtitle>
                </div>

                <Grid>
                    <FormGroup>
                        <Label><User size={12} style={{ marginRight: 4 }} /> Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Designate identity..."
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label><Heart size={12} style={{ marginRight: 4 }} /> Gender Tone</Label>
                        <Select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                            <option value="non-binary">Non-Binary (Neutral)</option>
                            <option value="male">Masculine (Deep)</option>
                            <option value="female">Feminine (Soft)</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label><Globe size={12} style={{ marginRight: 4 }} /> Core Language</Label>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
                            <option value="en">English (Universal)</option>
                            <option value="he">Hebrew (Ancient)</option>
                        </Select>
                    </FormGroup>
                </Grid>

                <FormGroup>
                    <Label><Shield size={12} style={{ marginRight: 4 }} /> Psychological Traits</Label>
                    <TraitPills>
                        {TRAITS.map(trait => (
                            <TraitPill
                                key={trait}
                                $active={selectedTraits.includes(trait)}
                                onClick={() => toggleTrait(trait)}
                            >
                                {trait}
                            </TraitPill>
                        ))}
                    </TraitPills>
                </FormGroup>

                <FormGroup>
                    <Label><Clock size={12} style={{ marginRight: 4 }} /> Biological Lifespan</Label>
                    <LifespanSlider
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={lifespanIndex}
                        onChange={(e) => setLifespanIndex(parseInt(e.target.value))}
                    />
                    <LifespanLabels>
                        <span>Short (Dev)</span>
                        <span>Medium</span>
                        <span>Long</span>
                    </LifespanLabels>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#00f2fe', marginTop: '1rem' }}>
                        Life expectancy: {lifespans[lifespanIndex].label}
                    </p>
                </FormGroup>

                <SubmitButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenesis}
                >
                    <Sparkles size={20} />
                    Ignite Spark
                </SubmitButton>
            </Content>
        </Overlay>
    );
};

export default GenesisScreen;
