import React, { useState } from 'react';
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
    // Aumenté max-w a 3xl y eliminé la reducción de escala para que se vea bien en Tablet
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto transform transition-transform duration-300">

      {/* Contenedor relativo */}
      <div className="relative group scale-100 md:scale-105 origin-top">

        {/* ================= LA PALANCA (Versión Ajustada/Más Chica) ================= */}
        <div className="absolute top-[80px] -right-[35px] md:-right-[45px] z-0 flex flex-col items-center">
          {/* Base de la palanca (más corta) */}
          <div className="w-3 h-12 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg shadow-lg absolute left-0 top-6" />

          {/* El brazo móvil (Altura reducida de h-64 a h-40/52) */}
          <div
            onClick={!hasStarted ? startSpin : undefined}
            className={`
            relative w-3 h-40 md:h-52 cursor-pointer transition-transform duration-500 origin-bottom
            ${isLeverPulled ? 'rotate-180 scale-y-90' : 'rotate-0'}
            ${hasStarted ? 'cursor-not-allowed opacity-80' : 'hover:scale-105 active:scale-95'}
        `}
            style={{ transformOrigin: 'bottom center' }}
          >
            {/* La varilla metálica */}
            <div className="absolute inset-x-0 bottom-0 top-6 mx-auto w-3 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full border border-gray-500 shadow-md" />

            {/* La perilla (Reducida de w-16 a w-10/12) */}
            <div className="absolute -top-3 -left-[14px] w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_2px_4px_rgba(0,0,0,0.6)] border border-red-900 z-10" />
          </div>

          {/* Pivote inferior (Reducido de w-12 a w-8/10) */}
          <div className="absolute bottom-0 w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full border-4 border-gray-500 shadow-xl z-20 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-900 rounded-full opacity-50" />
          </div>
        </div>
        {/* ================= FIN DE PALANCA ================= */}


        {/* CUERPO DE LA MÁQUINA (Padding aumentado) */}
        <div className="relative z-10 p-6 md:p-10 bg-sos-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-t-[10px] border-sos-orange/30">
          {/* Lights / Side Decorations */}
          <div className="absolute top-0 left-0 h-full w-6 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
            ))}
          </div>
          <div className="absolute top-0 right-0 h-full w-6 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white/20'}`} />
            ))}
          </div>

          {/* Reels Container (Gap más amplio) */}
          <div className="flex gap-3 md:gap-5 bg-sos-beige p-4 md:p-5 rounded-2xl overflow-hidden border-[6px] border-sos-dark/20">
            {[0, 1, 2].map((i) => (
              <Reel key={i} isSpinning={spinning[i]} icon={results[i]} />
            ))}
          </div>

       
        </div>
      </div>

      <div className="text-sos-dark/60 font-black text-xl uppercase tracking-tighter text-center mt-4">
        {!hasStarted ? "¡TIRA DE LA PALANCA!" : spinning.some(s => s) ? "GIRANDO..." : "¡BUENA SUERTE!"}
      </div>
    </div>
  );
};

// Componente Reel con imágenes más grandes
const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  return (
    <div className="w-24 h-32 md:w-36 md:h-48 bg-white rounded-xl shadow-inner border-2 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-12 md:gap-16">
            {SERVICE_ICONS.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.label} className="w-20 h-20 md:w-28 md:h-28 object-contain" />
            ))}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={`dup-${idx}`} src={item.image} alt={item.label} className="w-20 h-20 md:w-28 md:h-28 object-contain" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300 p-2">
            {/* Imagen aumentada considerablemente */}
            <img src={icon.image} alt={icon.label} className="w-20 h-20 md:w-28 md:h-28 object-contain mb-2" />
            {/* Texto visible y más legible en tablet */}
            <span className="text-sos-dark/40 font-black text-[10px] md:text-xs uppercase text-center leading-tight px-1">{icon.label}</span>
          </div>
        )}
      </div>

      {/* Glare effect más pronunciado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
    </div>
  );
};

export default SlotMachine;