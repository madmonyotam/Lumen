import { ThemeProvider } from 'styled-components';
import { OrganProvider } from './context/OrganContext';
import OrganismView from './components/OrganismView';
import { GlobalStyles } from './GlobalStyles';
import { lumenTheme } from './theme';

function App() {
  return (
    <ThemeProvider theme={lumenTheme}>
      <OrganProvider>
        <GlobalStyles />
        <OrganismView />
      </OrganProvider>
    </ThemeProvider>
  );
}

export default App;
