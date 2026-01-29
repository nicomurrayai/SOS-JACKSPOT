import React, { useState } from 'react';
import { SERVICE_ICONS, CONFIG } from '../constants';
import { ServiceIcon, GameResult } from '../types';

interface SlotMachineProps {
  onComplete: (result: GameResult) => void;
}

const REEL_COUNT = 3; // Mantenemos los 3 reels que configuramos antes

const SlotMachine: React.FC<SlotMachineProps> = ({ onComplete }) => {
  const [spinning, setSpinning] = useState<boolean[]>(new Array(REEL_COUNT).fill(false));
  
  // Inicializamos solo con los 3 primeros (SOS, Grua, Moto) para la vista estática
  const [results, setResults] = useState<ServiceIcon[]>([
    SERVICE_ICONS[0],
    SERVICE_ICONS[1],
    SERVICE_ICONS[2],
  ]);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isLeverPulled, setIsLeverPulled] = useState(false);

  const determineWin = (): GameResult => {
    // 1. Probabilidad Global: 0.15%
    // Usamos 0.0015 directamente o asegúrate que CONFIG.WIN_PROBABILITY valga 0.0015
    const isWinner = Math.random() < CONFIG.WIN_PROBABILITY;

    if (isWinner) {
      // 2. LÓGICA DE GANADORES RESTRINGIDA
      // Solo permitimos ganar a SOS (0) y Grúa (1).
      // Creamos un sub-array solo con los íconos permitidos para ganar.
      const allowedWinners = [SERVICE_ICONS[0], SERVICE_ICONS[1]];
      
      // Elegimos aleatoriamente cual de los dos gana
      const winningIcon = allowedWinners[Math.floor(Math.random() * allowedWinners.length)];
      
      return { isWinner: true, winningIcon };
    } else {
      // 3. LÓGICA DE PÉRDIDA CON VISIBILIDAD DE TODOS LOS ÍCONOS
      let res: ServiceIcon[] = [];
      
      // Generamos 3 íconos aleatorios usando EL LISTADO COMPLETO (incluyendo Moto, Moura, Lüsqtoff)
      // Esto asegura que visualmente aparezcan aunque no ganen.
      while (res.length < REEL_COUNT) {
        const icon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
        res.push(icon);
      }
      
      // 4. SEGURIDAD ANTI-JACKPOT
      // Si por puro azar salen 3 Motos, 3 Mouras o 3 Lüsqtoffs, NO deben ganar.
      // El sistema detectará que son iguales y forzará el cambio del último ícono.
      const allEqual = res.every(val => val.id === res[0].id);
      
      if (allEqual) {
        // Buscamos íconos diferentes al que salió repetido para romper la línea
        const otherIcons = SERVICE_ICONS.filter(i => i.id !== res[0].id);
        // Reemplazamos el último reel
        res[REEL_COUNT - 1] = otherIcons[Math.floor(Math.random() * otherIcons.length)];
      }
      
      return { isWinner: false };
    }
  };

  const startSpin = () => {
    if (hasStarted) return;

    setIsLeverPulled(true);
    setTimeout(() => setIsLeverPulled(false), 500);

    setHasStarted(true);
    setSpinning(new Array(REEL_COUNT).fill(true));

    // Calculamos el resultado con la nueva estructura de probabilidades
    const finalOutcome = determineWin();
    
    // Preparamos los íconos finales para la animación
    const finalIcons = finalOutcome.isWinner
      ? new Array(REEL_COUNT).fill(finalOutcome.winningIcon!)
      : (() => {
          // Replicamos la lógica de pérdida para el renderizado final
          let res: ServiceIcon[] = [];
          while (res.length < REEL_COUNT) {
             res.push(SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)]);
          }
          // Chequeo de seguridad visual (para que lo que se ve coincida con la lógica interna)
          if (res.every(r => r.id === res[0].id)) {
             const others = SERVICE_ICONS.filter(i => i.id !== res[0].id);
             res[REEL_COUNT - 1] = others[0];
          }
          return res;
        })();

    Array.from({ length: REEL_COUNT }, (_, i) => i).forEach((i) => {
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

        if (i === REEL_COUNT - 1) {
          setTimeout(() => {
            onComplete(finalOutcome);
          }, 1500);
        }
      }, CONFIG.SPIN_DURATION + (i * CONFIG.REEL_DELAY));
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto transform transition-transform duration-300">
      <div className="relative group origin-top">
        {/* PALANCA (Sin cambios visuales) */}
        <div className="absolute top-[80px] -right-[25px] md:-right-[45px] z-0 flex flex-col items-center">
          <div className="w-3 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg shadow-lg absolute left-0 top-6" />
          <div
            onClick={!hasStarted ? startSpin : undefined}
            className={`
            relative w-3 h-36  transition-transform duration-500 origin-bottom
            ${isLeverPulled ? 'rotate-180 scale-y-90' : 'rotate-0'}
            ${hasStarted ? 'cursor-not-allowed' : 'cursor-pointer '}
        `}
            style={{ transformOrigin: 'bottom center' }}
          >
            <div className="absolute inset-x-0 bottom-0 top-6 mx-auto w-3 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full border border-gray-500 shadow-md" />
            <div className="absolute -top-3 -left-[14px] w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_2px_4px_rgba(0,0,0,0.6)] border border-red-900 z-10" />
          </div>
          <div className="absolute bottom-0 w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full border-4 border-gray-500 shadow-xl z-20 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-900 rounded-full opacity-50" />
          </div>
        </div>

        {/* CUERPO DE LA MÁQUINA */}
        <div className="relative z-10 p-4 md:p-8 bg-sos-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-t-[10px] border-sos-orange/30">
          {/* Luces decorativas */}
          <div className="absolute top-0 left-0 h-full w-4 md:w-6 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white'}`} />
            ))}
          </div>
          <div className="absolute top-0 right-0 h-full w-4 md:w-6 flex flex-col justify-around items-center py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${hasStarted ? 'bg-sos-orange animate-pulse' : 'bg-white'}`} />
            ))}
          </div>

          {/* Reels Container */}
          <div className="flex gap-1 md:gap-3 bg-sos-beige p-2 md:p-4 rounded-2xl overflow-hidden border-[6px] border-black/40">
            {Array.from({ length: REEL_COUNT }, (_, i) => i).map((i) => (
              <Reel key={i} isSpinning={spinning[i]} icon={results[i]} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-sos-dark/60 font-black text-sm md:text-base uppercase tracking-tighter text-center px-4">
        {!hasStarted ? "¡TIRA DE LA PALANCA!" : spinning.some(s => s) ? "GIRANDO..." : "¡BUENA SUERTE!"}
      </div>
    </div>
  );
};

const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  return (
    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-32 md:h-44 bg-white rounded-lg md:rounded-xl shadow-inner border-2 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-8 md:gap-16">
            {/* Al hacer map de SERVICE_ICONS completo aquí, aseguramos que 
              Moura y Lüsqtoff pasen girando visualmente. 
            */}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.label} className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain" />
            ))}
            {SERVICE_ICONS.map((item, idx) => (
              <img key={`dup-${idx}`} src={item.image} alt={item.label} className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300 p-1">
            <img src={icon.image} alt={icon.label} className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain mb-1 md:mb-2" />
            <span className="text-sos-dark/40 font-black text-[8px] sm:text-[10px] md:text-xs uppercase text-center leading-tight px-1 truncate w-full">
              {icon.label}
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
    </div>
  );
};

export default SlotMachine;