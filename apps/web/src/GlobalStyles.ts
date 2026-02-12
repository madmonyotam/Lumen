import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');

  :root {
    --lumen-bg: #020405;
    --lumen-card: rgba(10, 20, 25, 0.6);
    --lumen-teal: #00f2c3;
    --lumen-teal-dim: rgba(0, 242, 195, 0.1);
    --lumen-purple: #d946ef;
    --lumen-text: #e2e8f0;
    --lumen-text-dim: #94a3b8;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  body {
    background-color: var(--lumen-bg);
    color: var(--lumen-text);
    font-family: 'Rajdhani', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  code {
    font-family: 'Rajdhani', monospace; // Using Rajdhani for code blocks too per aesthetic
  }

  ::selection {
    background: var(--lumen-teal);
    color: #000;
  }
`;
