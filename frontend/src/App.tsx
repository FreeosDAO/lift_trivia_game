import React from 'react';
import { useInternetIdentity } from 'ic-use-internet-identity';
import LoginScreen from './components/LoginScreen';
import Lobby from './components/Lobby';

function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-8"></div>
          <h1 className="text-2xl font-bold text-primary">Loading...</h1>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-primary">
      {isAuthenticated ? <Lobby /> : <LoginScreen />}
    </div>
  );
}

export default App;
