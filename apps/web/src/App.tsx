import { ThemeProvider } from 'styled-components';
import { OrganProvider } from './context/OrganContext';
import { AuthProvider } from './context/AuthContext';
import OrganismView from './components/OrganismView';
import { GlobalStyles } from './GlobalStyles';
import { lumenTheme } from './theme';
import { AuthGuard } from './components/AuthGuard';
import { Header } from './components/shared/Header';

function App() {
  return (
    <ThemeProvider theme={lumenTheme}>
      <AuthProvider>
        <AuthGuard>
          <OrganProvider>
            <GlobalStyles />
            <Header />
            <OrganismView />
          </OrganProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
