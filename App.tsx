
import React, { useState, useCallback } from 'react';
import { AppState, GameResult, Lead } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import EmailForm from './components/EmailForm';
import SlotMachine from './components/SlotMachine';
import ResultScreen from './components/ResultScreen';
import Header from './components/Header';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [userEmail, setUserEmail] = useState<string>('');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStart = () => setState(AppState.EMAIL_INPUT);

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setState(AppState.GAME);
  };

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setState(AppState.RESULT);
    
    // In a real app, we would send this to a backend/API
    const lead: Lead = {
      email: userEmail,
      timestamp: Date.now(),
      won: result.isWinner
    };
    console.log('Lead Captured:', lead);
  };

  const handleReset = () => {
    setUserEmail('');
    setGameResult(null);
    setState(AppState.WELCOME);
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-6">
        {state === AppState.WELCOME && (
          <WelcomeScreen onStart={handleStart} />
        )}
        
        {state === AppState.EMAIL_INPUT && (
          <EmailForm onSubmit={handleEmailSubmit} onBack={handleReset} />
        )}
        
        {state === AppState.GAME && (
          <SlotMachine onComplete={handleGameEnd} />
        )}
        
        {state === AppState.RESULT && gameResult && (
          <ResultScreen result={gameResult} onFinish={handleReset} />
        )}
      </main>

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-sos-orange opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sos-orange opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default App;
