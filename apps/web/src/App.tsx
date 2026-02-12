import { OrganProvider } from './context/OrganContext';
import OrganismView from './components/OrganismView';
import { GlobalStyles } from './GlobalStyles';

function App() {
  return (
    <OrganProvider>
      <GlobalStyles />
      <OrganismView />
    </OrganProvider>
  );
}

export default App;
