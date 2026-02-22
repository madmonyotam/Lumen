import { LUMEN_CONFIG } from '../lumen.config';

const isHebrew = LUMEN_CONFIG.LANGUAGE === 'he';
const direction = isHebrew ? 'rtl' : 'ltr';
const mainFont = "'Fredoka', sans-serif";

// 1. Palette: The raw colors (The "Source of Truth")
const palette = {
    white: '#FFFFFF',
    black: '#000000',
    neutrals: {
        bg: '#020405',
        card: 'rgba(10, 20, 25, 0.6)',
        text: '#e2e8f0',
        textDim: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.1)',
        borderDim: 'rgba(255, 255, 255, 0.05)',
        bgOverlay: 'rgba(0, 0, 0, 0.85)',
    },
    teal: {
        main: '#00f2fe',
        dim: 'rgba(0, 242, 195, 0.1)',
        neon: '0 0 15px rgba(0, 242, 254, 0.4)',
    },
    purple: {
        main: '#d946ef',
        dim: 'rgba(217, 70, 239, 0.1)',
        neon: '0 0 15px rgba(217, 70, 239, 0.4)',
    },
    red: {
        main: '#ff4d4d',
        dim: 'rgba(255, 68, 68, 0.1)',
        neon: '0 0 15px rgba(255, 68, 68, 0.4)',
        dark: '#d01717',
        deep: '#800000', // אדום עמוק לדופק נמוך
        pulse: '#ff0000', // אדום טהור לפעימה
    },
    blue: {
        main: '#4facfe',
        dim: 'rgba(79, 172, 254, 0.1)',
        dark: '#001e97',
        midnight: '#050a1f', // כחול כהה מאוד לגיל מבוגר
    },
    yellow: {
        main: '#facc15',
        bright: '#e9e027',
    },
    gender: {
        male: '#4facfe',
        female: '#ff69b4',
    },
    balance: {
        perfect: '#ffffff', // לבן
        stable: '#00ff9f',  // ירוק
        unstable: '#6a0dad', // סגול
    },
    gradients: {
        vitalityStart: '#00f2fe',
        vitalityEnd: '#4facfe',
        backgroundStart: '#112233',
    },
    visuals: {
        sphere: {
            cold: '#001e97',
            neutral: '#ffffff',
            hot: '#ff0000'
        },
        fog: {
            calm: '#0d1a4c',
            neutral: '#494949',
            stressed: '#4f1616'
        },
        physics: {
            calm: '#7887ba',
            neutral: '#c7bdbd',
            stressed: '#f07474'
        }
    }
} as const;

// 2. Usage/UI: Semantic tokens (How we use the colors)
const ui = {
    background: {
        main: palette.neutrals.bg,
        card: palette.neutrals.card,
        overlay: palette.neutrals.bgOverlay,
        gradientStart: palette.gradients.backgroundStart,
    },
    text: {
        primary: palette.neutrals.text,
        dim: palette.neutrals.textDim,
        inverse: palette.black,
    },
    brand: {
        primary: palette.teal.main,
        secondary: palette.purple.main,
        tertiary: palette.blue.main,
    },
    status: {
        error: palette.red.main,
        success: palette.teal.main,
        warning: palette.yellow.main,
        info: palette.blue.main,
    },
    border: {
        main: palette.neutrals.border,
        dim: palette.neutrals.borderDim,
        focus: palette.teal.main,
    },
    action: {
        hover: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(255, 255, 255, 0.2)',
    },
    metricColors: {
        age: {
            child: palette.teal.main,
            male: palette.gender.male,
            female: palette.gender.female,
            senior: palette.blue.midnight,
        },
        bpm: {
            low: palette.red.deep,   // אדום עמוק
            normal: palette.red.main, // אדום סטנדרטי
            high: palette.red.pulse, // אדום בוהק
            veryHigh: palette.red.pulse,
        },
        stress: {
            low: palette.blue.main,    // כחול
            mid: palette.yellow.main,  // צהוב
            high: palette.red.main,    // אדום
        },
        hrv: {
            low: palette.red.main,
            normal: palette.teal.main,
            high: palette.blue.main,
            line: palette.blue.main,
        },
        homeostasis: {
            stable: palette.balance.perfect,   // לבן
            adaptive: palette.balance.stable,  // ירוק
            unstable: palette.balance.unstable, // סגול
        },
        latency: {
            good: palette.teal.main,
            fair: palette.purple.main,
            poor: palette.red.main,
        },
        gen: {
            main: palette.blue.main,
        }
    }
} as const;

// 3. Config Values: Spacing, Breakpoints, etc.
const config = {
    direction,
    spacing: (unit: number) => `${unit * 4}px`, // Using a standard 4px baseline
    glass: {
        blur: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 20, 25, 0.6)',
    },
    transitions: {
        fast: 'all 0.2s ease',
        normal: 'all 0.5s ease',
        slow: 'all 1.5s ease-in-out',
    },
    fonts: {
        main: mainFont,
        code: "'Rajdhani', monospace",
    },
    typography: {
        h1: { size: '2rem', weight: 700, spacing: '0.2em' },
        h2: { size: '1.5rem', weight: 600, spacing: '0.1em' },
        body: { size: '0.875rem', weight: 400, spacing: '0.05em' },
        label: { size: '0.625rem', weight: 700, spacing: '0.2em' }
    },
    shadows: {
        neonTeal: palette.teal.neon,
        neonPurple: palette.purple.neon,
        neonRed: palette.red.neon,
        card: '0 4px 15px rgba(0, 0, 0, 0.4)',
    }
} as const;

// 4. The Final Theme Object
export const lumenTheme = {
    palette,
    ui,
    config,
} as const;

// 5. Types & Extracting Types Dynamically
export type ThemeType = typeof lumenTheme;
export type ColorPalette = keyof typeof palette;
export type UIUsage = keyof typeof ui;

export const getSpacing = (unit: number) => ({ theme }: { theme: ThemeType }) => theme.config.spacing(unit);

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends ThemeType { }
}