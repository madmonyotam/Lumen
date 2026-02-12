import { OrganProvider, useOrgan } from './context/OrganContext';
import './index.css';

const LumenDashboard = () => {
  const { biometrics, organState, isConnected } = useOrgan();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Connecting to Nervous System...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-teal-400">Lumen Bio-Synchronous Interface</h1>
        <p className="text-sm text-gray-400">System Status: <span className="text-green-400">Live</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Biometric Data Column */}
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">Biometric Data</h2>
          {biometrics ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Heart Rate</span>
                <span className="font-mono text-xl">{biometrics.bpm.toFixed(0)} BPM</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Stress Level</span>
                <span className="font-mono text-xl">{(biometrics.stress * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>HRV</span>
                <span className="font-mono text-xl">{biometrics.hrv.toFixed(0)} ms</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Body Battery</span>
                <span className="font-mono text-xl">{biometrics.bodyBattery.toFixed(0)}%</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Waiting for pulse...</p>
          )}
        </section>

        {/* Organ State Column */}
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Organ State</h2>
          {organState ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Vitality</span>
                <span className="font-mono text-xl">{(organState.vitality * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Mood</span>
                <span className="font-mono text-xl">{organState.mood}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Resonance</span>
                <span className="font-mono text-xl">{(organState.resonance * 100).toFixed(0)}%</span>
              </div>
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <h3 className="text-sm font-semibold mb-2 text-gray-500">Visual Parameters</h3>
                <pre className="text-xs text-green-300 overflow-auto">
                  {JSON.stringify(organState.visualParams, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Syncing with brain...</p>
          )}
        </section>
      </div>
    </div>
  );
};

function App() {
  return (
    <OrganProvider>
      <LumenDashboard />
    </OrganProvider>
  );
}

export default App;
