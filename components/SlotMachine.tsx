import React, { useState } from 'react';
import { useQuery } from 'convex/react'; //
import { api } from '../convex/_generated/api'; // Asegúrate que la ruta sea correcta
import { SERVICE_ICONS, CONFIG } from '../constants';
import { ServiceIcon, GameResult } from '../types';

interface SlotMachineProps {
  onComplete: (result: GameResult) => void;
}

const REEL_COUNT = 3;

const SlotMachine: React.FC<SlotMachineProps> = ({ onComplete }) => {
  // 1. Obtener probabilidades de la BD
  const probabilities = useQuery(api.leads.getProbabilities);

  const [spinning, setSpinning] = useState<boolean[]>(new Array(REEL_COUNT).fill(false));

  const [results, setResults] = useState<ServiceIcon[]>([
    SERVICE_ICONS[0],
    SERVICE_ICONS[1],
    SERVICE_ICONS[2],
  ]);

  const [hasStarted, setHasStarted] = useState(false);
  const [isLeverPulled, setIsLeverPulled] = useState(false);

  // Lógica de Ganador Dinámica (Weighted Random)
  const determineWin = (): GameResult => {
    // Si no han cargado las probabilidades, forzamos pérdida por seguridad
    if (!probabilities) return { isWinner: false };

    const randomValue = Math.random();
    let cumulativeProbability = 0;

    // Recorremos los iconos definidos en constantes
    for (const icon of SERVICE_ICONS) {
      // TypeScript cree que podemos estar accediendo a '_id' (string) o '_creationTime'
      // Forzamos la lectura de la propiedad
      const val = probabilities[icon.id as keyof typeof probabilities];

      // Verificamos que sea estrictamente un número para evitar errores de tipo y de runtime
      // Si es undefined, null o un ID (string), usamos 0
      const iconProb = typeof val === 'number' ? val : 0;

      cumulativeProbability += iconProb;

      // Si el número aleatorio cae dentro del rango acumulado, este icono gana
      if (randomValue < cumulativeProbability) {
        return { isWinner: true, winningIcon: icon , prize:icon.label };
      }
    }

    // Si randomValue es mayor que la suma de todas las probabilidades, es una pérdida.
    // Lógica de visualización de pérdida (Mantenemos la lógica visual original)
    let res: ServiceIcon[] = [];

    while (res.length < REEL_COUNT) {
      const icon = SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)];
      res.push(icon);
    }

    // Seguridad Anti-Jackpot visual (para que no parezca que ganaron si salió false)
    const allEqual = res.every(val => val.id === res[0].id);

    if (allEqual) {
      const otherIcons = SERVICE_ICONS.filter(i => i.id !== res[0].id);
      res[REEL_COUNT - 1] = otherIcons[Math.floor(Math.random() * otherIcons.length)];
    }

    return { isWinner: false };
  };

  const startSpin = () => {
    // Evitar tirar si ya empezó O si los datos de convex no han cargado
    if (hasStarted || probabilities === undefined) return;

    setIsLeverPulled(true);
    setTimeout(() => setIsLeverPulled(false), 500);

    setHasStarted(true);
    setSpinning(new Array(REEL_COUNT).fill(true));

    const finalOutcome = determineWin();

    const finalIcons = finalOutcome.isWinner
      ? new Array(REEL_COUNT).fill(finalOutcome.winningIcon!)
      : (() => {
        // Replicamos la lógica de pérdida para el renderizado final
        let res: ServiceIcon[] = [];
        while (res.length < REEL_COUNT) {
          res.push(SERVICE_ICONS[Math.floor(Math.random() * SERVICE_ICONS.length)]);
        }
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
          }, 2000);
        }
      }, CONFIG.SPIN_DURATION + (i * CONFIG.REEL_DELAY));
    });
  };

  // Calculamos si la palanca debe estar deshabilitada
  const isLeverDisabled = hasStarted || probabilities === undefined;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto transform transition-transform duration-300">
      <div className="relative group origin-top">
        {/* PALANCA */}
        <div className="absolute top-[80px] -right-[25px] md:-right-[45px] z-0 flex flex-col items-center">
          <div className="w-3 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg shadow-lg absolute left-0 top-6" />
          <div
            onClick={!isLeverDisabled ? startSpin : undefined}
            className={`
            relative w-3 h-36  transition-transform duration-500 origin-bottom
            ${isLeverPulled ? 'rotate-180 scale-y-90' : 'rotate-0'}
            ${isLeverDisabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer '}
        `}
            style={{ transformOrigin: 'bottom center' }}
          >
            <div className="absolute inset-x-0 bottom-0 top-6 mx-auto w-3 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full border border-gray-500 shadow-md" />
            <div className={`absolute -top-3 -left-[14px] w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_2px_4px_rgba(0,0,0,0.6)] border border-red-900 z-10 ${probabilities === undefined ? 'grayscale' : ''}`} />
          </div>
          <div className="absolute bottom-0 w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full border-4 border-gray-500 shadow-xl z-20 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-900 rounded-full opacity-50" />
          </div>
        </div>

        {/* CUERPO DE LA MÁQUINA */}
        <div className="relative z-10 p-4 md:p-8 bg-sos-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-t-[10px] border-sos-orange/30">
          {/* ... (Mismo código de luces decorativas) ... */}
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
        {probabilities === undefined
          ? "CARGANDO SISTEMA..."
          : !hasStarted
            ? "¡TIRA DE LA PALANCA!"
            : spinning.some(s => s) ? "GIRANDO..." : "¡BUENA SUERTE!"
        }
      </div>
    </div>
  );
};

// ... (El componente Reel se mantiene igual)

const Reel: React.FC<{ isSpinning: boolean; icon: ServiceIcon }> = ({ isSpinning, icon }) => {
  // ... (Tu código actual de Reel)
  return (
    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-32 md:h-44 bg-white rounded-lg md:rounded-xl shadow-inner border-2 border-sos-dark/5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="flex flex-col gap-8 md:gap-16">
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