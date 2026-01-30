import React, { useEffect } from 'react';
import { GameResult } from '../types';
import { WIN_MESSAGES } from '../constants'; //

interface ResultScreenProps {
  result: GameResult;
  onFinish: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onFinish }) => {
  useEffect(() => {
    // Auto-reset after 12 seconds
    const timer = setTimeout(onFinish, 12000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // Obtenemos la configuración del mensaje basada en el ID ganador
  // Si por error no hay ID, usamos un fallback genérico
  const winContent = result.winningIcon
    ? WIN_MESSAGES[result.winningIcon.id]
    : { title: '¡GANASTE!', prize: 'PREMIO SORPRESA' };

  return (
    <div className="text-center animate-in zoom-in slide-in-from-bottom-24 duration-700 w-full flex flex-col items-center justify-center">
      {result.isWinner ? (
        // ============ VISTA GANADOR ============
        <div className="space-y-6 w-full max-w-md">
          <div className="relative inline-block">
            <div className="absolute -inset-6 bg-sos-orange/20 rounded-full blur-2xl animate-pulse" />
            <h1 className="text-2xl font-black text-sos-orange relative z-10 drop-shadow-lg">
              ¡FELICITACIONES!
            </h1>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl mx-auto border-t-4 border-sos-orange">
            <div className="text-4xl mb-4">🏆</div>

            {/* Título Personalizado */}
            <h2 className="text-2xl font-black mb-3 uppercase text-gray-800">
              {winContent.title}
            </h2>

            <button
              onClick={onFinish}
              className="w-full py-2 bg-sos-orange text-white rounded-xl text-lg font-black shadow-md hover:bg-sos-orange/90 transition-colors"
            >
              ¡EXCELENTE!
            </button>
          </div>
        </div>
      ) : (
        // ============ VISTA PERDEDOR (Sin cambios) ============
        <div className="space-y-6 w-full max-w-md">
          {/* ... tu código existente de perdedor ... */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl mx-auto border-4 border-white">
            <div className="text-4xl mb-4 opacity-40">🤝</div>
            <h2 className="text-2xl font-black mb-3 uppercase">Gracias por participar</h2>
            <div className="flex flex-col items-center gap-2">
              <img src="/sos-logo.png" alt="logo" className="w-20" />
              <p className="text-sm text-sos-dark/60 font-semibold mb-6 leading-snug">
                Siempre ahí<br /> en ruta con vos.
              </p>
            </div>
            <button
              onClick={onFinish}
              className="w-full py-3 bg-sos-dark text-white rounded-xl text-lg font-black hover:bg-sos-dark/90 transition-colors"
            >
              SIGUIENTE JUGADOR
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-sos-dark/40 font-bold animate-pulse uppercase tracking-widest text-xs">
        Reiniciando en unos segundos...
      </p>
    </div>
  );
};

export default ResultScreen;