import 'styled-components';

export const lumenTheme = {
    colors: {
        bg: '#020405',
        card: 'rgba(10, 20, 25, 0.6)',
        teal: '#00f2c3',
        tealDim: 'rgba(0, 242, 195, 0.1)',
        purple: '#d946ef',
        text: '#e2e8f0',
        textDim: '#94a3b8',
    },
    fonts: {
        main: "'Rajdhani', sans-serif",
        code: "'Rajdhani', monospace",
    }
};

export type LumenTheme = typeof lumenTheme;

declare module 'styled-components' {
    export interface DefaultTheme extends LumenTheme { }
}
