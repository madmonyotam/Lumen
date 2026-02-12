/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Rajdhani', 'sans-serif'],
                mono: ['Rajdhani', 'monospace'], // Using Rajdhani for everything as it fits the aesthetic
            },
            colors: {
                lumen: {
                    bg: '#020405',
                    card: 'rgba(10, 20, 25, 0.6)',
                    teal: '#00f2c3',
                    'teal-dim': 'rgba(0, 242, 195, 0.1)',
                    purple: '#d946ef', // fuchsia-500 equivalent
                    text: '#e2e8f0',
                    'text-dim': '#94a3b8',
                }
            },
            backgroundImage: {
                'lumen-gradient': 'radial-gradient(circle at center, #112233 0%, #020405 70%)',
            }
        },
    },
    plugins: [],
}
