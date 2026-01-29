
import React, { useState, useCallback } from 'react';
import { AppState, GameResult, Lead } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import EmailForm from './components/EmailForm';
import SlotMachine from './components/SlotMachine';
import ResultScreen from './components/ResultScreen';
import Header from './components/Header';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [userEmail, setUserEmail] = useState<string>('');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const createLead = useMutation(api.leads.createLead)

  const handleStart = () => setState(AppState.EMAIL_INPUT);

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setState(AppState.GAME);
  };

  const handleGameEnd = async (result: GameResult) => {
    setGameResult(result);
    setState(AppState.RESULT);

    const lead: Lead = {
      email: userEmail,
      isWinner: result.isWinner,
      prize: null
    };

    await createLead({ email: lead.email, isWinner: lead.isWinner, prize: null })

  };

  const handleReset = () => {
    setUserEmail('');
    setGameResult(null);
    setState(AppState.WELCOME);
  };

  return (
    <div className="w-full flex flex-col relative  font-sans">
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
    </div>
  );
};

export default App;
