
import React, { useState, useEffect, useRef } from 'react';
import { SERVICE_ICONS, CONFIG } from '../constants';
import { ServiceIcon, GameResult } from '../types';

interface SlotMachineProps {
  onComplete: (result: GameResult) => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ onComplete }) => {
  const [spinning, setSpinning] = useState([false, false, false]);
  const [results, setResults] = useState<ServiceIcon[]>([
    SERVICE_ICONS[0],
    SERVICE_ICONS[1],
    SERVICE_ICONS[2],
  ]);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const determineWin = (): GameResult => {
    const isWinner = Math.random() < CONFIG.WIN_PROBABILITY;
    
    if (isWinner) {
      // Pick a random icon for all three reels to match
      const winningIcon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
      return { isWinner: true, winningIcon };
    } else {
      // Ensure they don't all match
      let res: ServiceIcon[] = [];
      while (res.length < 3) {
        const icon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
        res.push(icon);
      }
      // If by chance they match, force change the last one
      if (res[0].id === res[1].id && res[1].id === res[2].id) {
        const otherIcons = SERVICE_ICONS.filter(i => i.id !== res[0].id);
        res[2] = otherIcons[Math.floor(Math.random() * otherIcons.length)];
      }
      return { isWinner: false };
    }
  };

  const startSpin = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setSpinning([true, true, true]);

    const finalOutcome = determineWin();
    const finalIcons = finalOutcome.isWinner 
      ? [finalOutcome.winningIcon!, finalOutcome.winningIcon!, finalOutcome.winningIcon!]
      : [
          SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)],
          SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)],
          SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)]
        ];

    // Staggered stop
    [0, 1, 2].forEach((i) => {
      setTimeout(() => {
        setSpinning(prev => {
          const newState = [...prev];
          newState[i] = false;
          return newState;
        });
        setResults(prev => {
          const newIcons = [...prev];
          newIcons[i] = finalIcons[i];
          return newIcons;
        });
        
        // Final completion check
        if (i === 2) {
          setTimeout(() => {
            onComplete(finalOutcome);
          }, 2000);
        }
      }, CONFIG.SPIN_DURATION + (i * CONFIG.REEL_DELAY));
    });
  };

  // Auto-start spin on mount
  useEffect(() => {
    const timer = setTimeout(startSpin, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-5xl">
      <div className="relative p-12 bg-sos-dark rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-t-[12px] border-sos-orange/30">
        {/* Lights / Side Decorations */}
        <div className="absolute top-0 left-0 h-full w-8 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
            ))}
        </div>
        <div className="absolute top-0 right-0 h-full w-8 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
            ))}
        </div>

        {/* Reels Container */}
        <div className="flex gap-6 bg-sos-beige p-6 rounded-2xl overflow-hidden">
          {[0, 1, 2].map((i) => (
            <Reel key={i} isSpinning={spinning[i]} icon={results[i]} />
          ))}
        </div>

        {/* Branding on Machine */}
        <div className="mt-8 text-center">
            <h3 className="text-sos-white text-2xl font-black tracking-widest opacity-30 italic">SOS MEGA JACKPOT</h3>
        </div>
      </div>

      <div className="text-sos-dark/50 font-black text-2xl uppercase tracking-tighter">
        {spinning.some(s => s) ? "GIRANDO PARA TI..." : "¡BUENA SUERTE!"}
      </div>
    </div>
  );
};

const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  return (
    <div className="w-48 h-64 md:w-64 md:h-80 bg-white rounded-xl shadow-inner border-4 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-12">
            {SERVICE_ICONS.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.label} className="w-32 h-32 md:w-40 md:h-40 object-contain" />
            ))}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={`dup-${idx}`} src={item.image} alt={item.label} className="w-32 h-32 md:w-40 md:h-40 object-contain" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <img src={icon.image} alt={icon.label} className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4" />
            <span className="text-sos-dark/30 font-black text-sm uppercase">{icon.label}</span>
          </div>
        )}
      </div>
      
      {/* Glare effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
    </div>
  );
};

export default SlotMachine;
