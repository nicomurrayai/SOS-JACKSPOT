import React, { useState, useRef } from 'react';
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
  
  // Nuevo estado para la animación de la palanca
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const determineWin = (): GameResult => {
    const isWinner = Math.random() < CONFIG.WIN_PROBABILITY;
    
    if (isWinner) {
      const winningIcon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
      return { isWinner: true, winningIcon };
    } else {
      let res: ServiceIcon[] = [];
      while (res.length < 3) {
        const icon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
        res.push(icon);
      }
      if (res[0].id === res[1].id && res[1].id === res[2].id) {
        const otherIcons = SERVICE_ICONS.filter(i => i.id !== res[0].id);
        res[2] = otherIcons[Math.floor(Math.random() * otherIcons.length)];
      }
      return { isWinner: false };
    }
  };

  const startSpin = () => {
    // Evitamos reiniciar si ya está girando
    if (hasStarted) return;
    
    // Animación de la palanca
    setIsLeverPulled(true);
    setTimeout(() => setIsLeverPulled(false), 500); // La palanca vuelve a subir en 0.5s

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

    // Staggered stop (parada escalonada)
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
        
        if (i === 2) {
          setTimeout(() => {
            onComplete(finalOutcome);
            // Opcional: Permitir jugar de nuevo reseteando hasStarted a false aquí si lo deseas
            // setHasStarted(false); 
          }, 2000);
        }
      }, CONFIG.SPIN_DURATION + (i * CONFIG.REEL_DELAY));
    });
  };

  // NOTA: Se eliminó el useEffect que iniciaba el juego automáticamente al montar

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-5xl">
      
      {/* Contenedor relativo para posicionar la palanca respecto a la máquina */}
      <div className="relative group">
        
        {/* ================= LA PALANCA (LEVER) ================= */}
        <div className="absolute top-[60px] -right-[50px] md:-right-[80px] z-0 flex flex-col items-center">
             {/* Base de la palanca pegada a la máquina */}
            <div className="w-4 h-16 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg shadow-xl absolute left-0 top-8" />
            
            {/* El brazo móvil */}
            <div 
                onClick={!hasStarted ? startSpin : undefined}
                className={`
                    relative w-4 h-48 md:h-64 cursor-pointer transition-transform duration-500 origin-bottom
                    ${isLeverPulled ? 'rotate-180 scale-y-90' : 'rotate-0'}
                    ${hasStarted ? 'cursor-not-allowed opacity-80' : 'hover:scale-105 active:scale-95'}
                `}
                style={{ transformOrigin: 'bottom center' }}
            >
                {/* La varilla metálica */}
                <div className="absolute inset-x-0 bottom-0 top-8 mx-auto w-4 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full border border-gray-500 shadow-lg" />
                
                {/* La perilla (bola roja) */}
                <div className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0px_4px_8px_rgba(255,255,255,0.4),0px_4px_8px_rgba(0,0,0,0.6)] border-2 border-red-900 z-10" />
            </div>

            {/* Pivote inferior (donde gira) */}
            <div className="absolute bottom-0 w-12 h-12 bg-gray-700 rounded-full border-4 border-gray-500 shadow-2xl z-20 flex items-center justify-center">
                 <div className="w-6 h-6 bg-gray-900 rounded-full opacity-50" />
            </div>
        </div>
        {/* ================= FIN DE PALANCA ================= */}


        {/* CUERPO DE LA MÁQUINA (Tu código original con z-index ajustado) */}
        <div className="relative z-10 p-8 md:p-12 bg-sos-dark rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-t-[12px] border-sos-orange/30">
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
          <div className="flex gap-2 md:gap-6 bg-sos-beige p-4 md:p-6 rounded-2xl overflow-hidden">
            {[0, 1, 2].map((i) => (
              <Reel key={i} isSpinning={spinning[i]} icon={results[i]} />
            ))}
          </div>

          {/* Branding on Machine */}
          <div className="mt-8 text-center">
              <h3 className="text-sos-white text-xl md:text-2xl font-black tracking-widest opacity-30 italic">SOS MEGA JACKPOT</h3>
          </div>
        </div>
      </div>

      <div className="text-sos-dark/50 font-black text-xl md:text-2xl uppercase tracking-tighter text-center">
        {!hasStarted ? "¡TIRA DE LA PALANCA!" : spinning.some(s => s) ? "GIRANDO PARA TI..." : "¡BUENA SUERTE!"}
      </div>
    </div>
  );
};

// Componente Reel sin cambios (solo asegúrate de que esté definido como lo tenías)
const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  return (
    <div className="w-24 h-32 sm:w-32 sm:h-48 md:w-64 md:h-80 bg-white rounded-xl shadow-inner border-4 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-12">
            {SERVICE_ICONS.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.label} className="w-16 h-16 md:w-40 md:h-40 object-contain" />
            ))}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={`dup-${idx}`} src={item.image} alt={item.label} className="w-16 h-16 md:w-40 md:h-40 object-contain" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <img src={icon.image} alt={icon.label} className="w-16 h-16 md:w-40 md:h-40 object-contain mb-4" />
            <span className="hidden md:block text-sos-dark/30 font-black text-sm uppercase">{icon.label}</span>
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