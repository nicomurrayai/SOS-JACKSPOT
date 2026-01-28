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
  
  // Estado para la animación de la palanca
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  
  // const audioRef = useRef<HTMLAudioElement | null>(null); // (Comentado si no se usa)

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
    if (hasStarted) return;
    
    // Animación de la palanca
    setIsLeverPulled(true);
    setTimeout(() => setIsLeverPulled(false), 500);

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
        
        if (i === 2) {
          setTimeout(() => {
            onComplete(finalOutcome);
          }, 2000);
        }
      }, CONFIG.SPIN_DURATION + (i * CONFIG.REEL_DELAY));
    });
  };

  return (
    // Reduje gap-12 a gap-6 y max-w-5xl a max-w-xl para tablet chica
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto transform scale-90 sm:scale-100 origin-top">
      
      {/* Contenedor relativo */}
      <div className="relative group">
        
        {/* ================= LA PALANCA (Versión Compacta) ================= */}
        {/* Ajusté top y right para que esté más pegada y sea más chica */}
        <div className="absolute top-[40px] -right-[35px] sm:-right-[45px] z-0 flex flex-col items-center">
            {/* Base de la palanca */}
            <div className="w-3 h-12 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-md shadow-lg absolute left-0 top-6" />
            
            {/* El brazo móvil (Altura reducida de h-64 a h-32/h-40) */}
            <div 
                onClick={!hasStarted ? startSpin : undefined}
                className={`
                    relative w-3 h-32 sm:h-40 cursor-pointer transition-transform duration-500 origin-bottom
                    ${isLeverPulled ? 'rotate-180 scale-y-90' : 'rotate-0'}
                    ${hasStarted ? 'cursor-not-allowed opacity-80' : 'hover:scale-105 active:scale-95'}
                `}
                style={{ transformOrigin: 'bottom center' }}
            >
                {/* La varilla metálica (más delgada) */}
                <div className="absolute inset-x-0 bottom-0 top-6 mx-auto w-3 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full border border-gray-500 shadow-md" />
                
                {/* La perilla (Reducida de w-16 a w-10/12) */}
                <div className="absolute -top-3 -left-3.5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_2px_4px_rgba(0,0,0,0.6)] border border-red-900 z-10" />
            </div>

            {/* Pivote inferior (Reducido) */}
            <div className="absolute bottom-0 w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-500 shadow-xl z-20 flex items-center justify-center">
                 <div className="w-3 h-3 bg-gray-900 rounded-full opacity-50" />
            </div>
        </div>
        {/* ================= FIN DE PALANCA ================= */}


        {/* CUERPO DE LA MÁQUINA (Padding y bordes reducidos) */}
        <div className="relative z-10 p-5 sm:p-8 bg-sos-dark rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border-t-[8px] border-sos-orange/30">
          {/* Lights / Side Decorations (Más finas) */}
          <div className="absolute top-0 left-0 h-full w-4 flex flex-col justify-around items-center py-6">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
              ))}
          </div>
          <div className="absolute top-0 right-0 h-full w-4 flex flex-col justify-around items-center py-6">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
              ))}
          </div>

          {/* Reels Container (Gap reducido) */}
          <div className="flex gap-2 sm:gap-3 bg-sos-beige p-3 rounded-xl overflow-hidden border-4 border-sos-dark/20">
            {[0, 1, 2].map((i) => (
              <Reel key={i} isSpinning={spinning[i]} icon={results[i]} />
            ))}
          </div>

          {/* Branding on Machine */}
          <div className="mt-4 text-center">
              <h3 className="text-sos-white text-base sm:text-lg font-black tracking-widest opacity-30 italic">SOS JACKPOT</h3>
          </div>
        </div>
      </div>

      <div className="text-sos-dark/50 font-black text-lg sm:text-xl uppercase tracking-tighter text-center">
        {!hasStarted ? "¡TIRA DE LA PALANCA!" : spinning.some(s => s) ? "GIRANDO..." : "¡BUENA SUERTE!"}
      </div>
    </div>
  );
};

// Componente Reel ajustado para tablet chica (tamaños w-20 a w-28 en vez de w-64)
const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  return (
    <div className="w-20 h-28 sm:w-28 sm:h-36 bg-white rounded-lg shadow-inner border-2 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-8 sm:gap-10">
            {SERVICE_ICONS.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.label} className="w-12 h-12 sm:w-20 sm:h-20 object-contain" />
            ))}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={`dup-${idx}`} src={item.image} alt={item.label} className="w-12 h-12 sm:w-20 sm:h-20 object-contain" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            {/* Imagen reducida */}
            <img src={icon.image} alt={icon.label} className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
            {/* Texto más chico y oculto en muy pequeño */}
            <span className="hidden sm:block text-sos-dark/30 font-black text-[10px] uppercase">{icon.label}</span>
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