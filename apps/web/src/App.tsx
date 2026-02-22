import { ThemeProvider } from 'styled-components';
import { OrganProvider, useOrgan } from './context/OrganContext';
import { AuthProvider } from './context/AuthContext';
import { OrganismContainer } from './components/organism/OrganismContainer';
import { GenesisContainer } from './components/genesis/GenesisContainer';
import { GlobalStyles } from './GlobalStyles';
import { lumenTheme } from './theme';
import { AuthGuard } from './components/AuthGuard';
import { Header } from './components/shared/Header';
import React from 'react';

// A wrapper to handle the routing between Genesis and Organism
const MainContent: React.FC = () => {
  const { organState, isConnected } = useOrgan();

  if (!isConnected || !organState) {
    // Organism container handles the loading state as well currently, but we can do it here maybe?
    // Let's just render OrganismContainer which handles the loading UI if not connected
    return <OrganismContainer />;
  }

  const { lifeStatus } = organState;

  if (!lifeStatus?.isAlive) {
    return <GenesisContainer />;
  }

  return <OrganismContainer />;
};

function App() {
  return (
    <ThemeProvider theme={lumenTheme}>
      <AuthProvider>
        <AuthGuard>
          <OrganProvider>
            <GlobalStyles />
            <Header />
            <MainContent />
          </OrganProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
