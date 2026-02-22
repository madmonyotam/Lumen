import { useState, useEffect } from 'react';
import type { GenesisOptions } from '@lumen/shared';
import { LUMEN_CONFIG } from '../lumen.config';

export const useGenesisOptions = () => {
    const [options, setOptions] = useState<GenesisOptions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // This endpoint doesn't strictly need auth for reading options, 
                // but we can pass it if we ever secure it. 
                const response = await fetch(`${LUMEN_CONFIG.API_URL}/api/genesis/options`);
                if (!response.ok) {
                    throw new Error('Failed to fetch genesis options');
                }
                const data = await response.json();
                setOptions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    return { options, loading, error };
};
