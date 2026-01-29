import React, { useEffect } from 'react';
import { GameResult } from '../types';

interface ResultScreenProps {
  result: GameResult;
  onFinish: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onFinish }) => {
  useEffect(() => {
    // Auto-reset after 10 seconds of display
    const timer = setTimeout(onFinish, 12000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  
  return (
    <div className="text-center animate-in zoom-in slide-in-from-bottom-24 duration-700 w-full flex flex-col items-center justify-center">
      {result.isWinner ? (
        // ============ VISTA GANADOR ============
        <div className="space-y-6 w-full max-w-md">
          <div className="relative inline-block">
            <div className="absolute -inset-6 bg-sos-orange/20 rounded-full blur-2xl animate-pulse" />
            <h1 className="text-2xl font-black text-sos-orange relative z-10 drop-shadow-lg">
              ¡GANASTE!
            </h1>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl mx-auto border-t-4 border-sos-orange">
            <div className="text-2xl mb-4">🏆</div>

            <h2 className="text-2xl font-black mb-3 uppercase">Jackpot Asegurado</h2>

            <p className="text-lg text-sos-dark/60 font-semibold mb-6 leading-tight">
              ¡Revisa tu correo! Te enviamos un cupón por <br />
              <span className="text-sos-orange font-black text-xl block mt-1">
                1 AÑO GRATIS DE {result.winningIcon?.label.toUpperCase()}
              </span>
            </p>

            <button
              onClick={onFinish}
              className="w-full py-2 bg-sos-orange text-white rounded-xl text-lg font-black shadow-md hover:bg-sos-orange/90 transition-colors"
            >
              ¡EXCELENTE!
            </button>
          </div>
        </div>
      ) : (
        // ============ VISTA PERDEDOR ============
        <div className="space-y-6 w-full max-w-md">

          {/* Tarjeta reducida */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl mx-auto border-4 border-white">
            {/* Emoji reducido */}
            <div className="text-6xl mb-4 opacity-40">🤝</div>

            {/* Título reducido */}
            <h2 className="text-2xl font-black mb-3 uppercase">Gracias por participar</h2>

            {/* Texto cuerpo reducido */}
            <p className="text-lg text-sos-dark/60 font-semibold mb-6 leading-snug">
              Aunque no ganaste el jackpot, SOS siempre te protege.
            </p>

            {/* Botón más compacto */}
            <button
              onClick={onFinish}
              className="w-full py-3 bg-sos-dark text-white rounded-xl text-lg font-black hover:bg-sos-dark/90 transition-colors"
            >
              SIGUIENTE JUGADOR
            </button>
          </div>
        </div>
      )}

      {/* Texto de footer reducido y margen ajustado */}
      <p className="mt-4 text-sos-dark/40 font-bold animate-pulse uppercase tracking-widest text-xs">
        Reiniciando en unos segundos...
      </p>
    </div>
  );
};

export default ResultScreen;