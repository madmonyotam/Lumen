import React, { useState, useEffect } from 'react';
import { LUMEN_CONFIG } from '../../lumen.config';
import { useGenesisOptions } from '../../hooks/useGenesisOptions';
import { validateGenesisState } from '../../utils/genesisValidation';
import type { ValidationResult } from '../../utils/genesisValidation';
import type { LumenPersona, BigFiveScores, InternalScores } from '@lumen/shared/types/index';
import { useAuth } from '../../context/AuthContext';
import GenesisScreen from '../GenesisScreen';

export const GenesisContainer: React.FC = () => {
    const [name, setName] = useState('Lumen');
    const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('non-binary');
    const [language, setLanguage] = useState<'en' | 'he'>('en');
    const [traitValues, setTraitValues] = useState<Record<string, number>>({});
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
    const [lifespanIndex, setLifespanIndex] = useState(1);
    const [step, setStep] = useState(0);

    const { token } = useAuth();
    const { options, loading, error } = useGenesisOptions();

    const [validation, setValidation] = useState<ValidationResult>({
        conflicts: [],
        stabilityScore: 100,
        details: []
    });

    useEffect(() => {
        const result = validateGenesisState(traitValues);
        setValidation(result);

        if (result.conflicts.length > 0) {
            console.log('[Genesis Conflict Engine]:', result.details);
        }
    }, [traitValues]);

    const handleGenesis = async () => {
        const ocean: Partial<BigFiveScores> = {};
        const internal: Partial<InternalScores> = {};

        const getVal = (key: string) => traitValues[key] ?? 50;

        ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].forEach(k => {
            (ocean as any)[k] = getVal(k);
        });

        ['attachment', 'temperament', 'cognitive', 'shadow'].forEach(k => {
            (internal as any)[k] = getVal(k);
        });

        const stringsConficts = validation.conflicts.map(c => c.id);
        const lifespans = options?.mechanics || [];

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

        const payload = { persona };

        try {
            const res = await fetch(`${LUMEN_CONFIG.API_URL}/api/genesis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Genesis failed');
        } catch (e) {
            console.error(e);
            alert("The spark failed to ignite. Check neural connection.");
        }
    };

    return (
        <GenesisScreen
            name={name}
            setName={setName}
            gender={gender}
            setGender={setGender}
            language={language}
            setLanguage={setLanguage}
            traitValues={traitValues}
            setTraitValues={setTraitValues}
            selectedStrengths={selectedStrengths}
            setSelectedStrengths={setSelectedStrengths}
            lifespanIndex={lifespanIndex}
            setLifespanIndex={setLifespanIndex}
            step={step}
            setStep={setStep}
            validation={validation}
            options={options}
            loading={loading}
            error={error ? new Error(error) : null}
            handleGenesis={handleGenesis}
        />
    );
};
