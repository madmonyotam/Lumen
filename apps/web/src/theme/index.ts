import 'styled-components';
import { LUMEN_CONFIG } from '../lumen.config';

const isHebrew = LUMEN_CONFIG.LANGUAGE === 'he';
const direction = isHebrew ? 'rtl' : 'ltr';
const mainFont = "'Fredoka', sans-serif";


export const lumenTheme = {
    direction,
    colors: {
        bg: '#020405',
        card: 'rgba(10, 20, 25, 0.6)',
        teal: '#00f2c3',
        tealDim: 'rgba(0, 242, 195, 0.1)',
        purple: '#d946ef',
        purpleDim: 'rgba(217, 70, 239, 0.1)',
        text: '#e2e8f0',
        textDim: '#94a3b8',
        gradientStart: '#112233',
        gradientVitalityStart: '#00f2c3',
        gradientVitalityEnd: '#67e8f9',
        red: '#FF4444',
        redDim: 'rgba(255, 68, 68, 0.1)',
        blue: '#60a5fa',
        blueDim: 'rgba(96, 165, 250, 0.1)',

        // Semantic Tokens
        action: {
            hover: 'rgba(255, 255, 255, 0.1)',
            active: 'rgba(255, 255, 255, 0.2)',
            border: 'rgba(255, 255, 255, 0.1)',
            borderFocus: '#00f2c3',
        },
        ui: {
            border: 'rgba(255, 255, 255, 0.1)',
            borderDim: 'rgba(255, 255, 255, 0.05)',
            bgOverlay: 'rgba(0, 0, 0, 0.85)',
        }
    },
    glass: {
        blur: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 20, 25, 0.6)',
    },
    shadows: {
        neonTeal: '0 0 15px rgba(0, 242, 195, 0.4)',
        neonPurple: '0 0 15px rgba(217, 70, 239, 0.4)',
        neonRed: '0 0 15px rgba(255, 68, 68, 0.4)',
        card: '0 4px 15px rgba(0, 0, 0, 0.4)',
    },
    animations: {
        fast: '0.2s ease',
        normal: '0.5s ease',
        slow: '1.5s ease-in-out',
    },
    fonts: {
        main: mainFont,
        code: "'Rajdhani', monospace",
    },
    typography: {
        h1: {
            size: '2rem',
            weight: 700,
            spacing: '0.2em',
        },
        h2: {
            size: '1.5rem',
            weight: 600,
            spacing: '0.1em',
        },
        body: {
            size: '0.875rem',
            weight: 400,
            spacing: '0.05em',
        },
        label: {
            size: '0.625rem',
            weight: 700,
            spacing: '0.2em',
        }
    }
};

export type LumenTheme = typeof lumenTheme;

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends LumenTheme { }
}
