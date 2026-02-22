import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');

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
    direction: ${props => props.theme.config.direction};
  }

  body {
    background-color: ${props => props.theme.ui.background.main};
    color: ${props => props.theme.ui.text.primary};
    font-family: ${props => props.theme.config.fonts.main};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  code {
    font-family: ${props => props.theme.config.fonts.code};
  }

  ::selection {
    background: ${props => props.theme.ui.brand.primary};
    color: ${props => props.theme.ui.text.inverse};
  }
`;
