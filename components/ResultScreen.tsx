
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
    <div className="text-center animate-in zoom-in slide-in-from-bottom-24 duration-700">
      {result.isWinner ? (
        <div className="space-y-8">
          <div className="relative inline-block">
            <div className="absolute -inset-12 bg-sos-orange/20 rounded-full blur-3xl animate-pulse" />
            <h1 className="text-7xl font-black text-sos-orange relative z-10 drop-shadow-xl">
              ¡GANASTE!
            </h1>
          </div>
          
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-2xl mx-auto border-t-8 border-sos-orange">
             <div className="text-9xl mb-6">🏆</div>
             <h2 className="text-4xl font-black mb-4 uppercase">Jackpot Asegurado</h2>
             <p className="text-2xl text-sos-dark/60 font-semibold mb-8">
               ¡Revisa tu correo! Te enviamos un cupón por <br />
               <span className="text-sos-orange font-black">1 AÑO GRATIS DE {result.winningIcon?.label.toUpperCase()}</span>
             </p>
             <button
               onClick={onFinish}
               className="w-full py-6 bg-sos-orange text-white rounded-2xl text-2xl font-black shadow-lg"
             >
               ¡EXCELENTE!
             </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
   
          
          <div className="bg-white/50 backdrop-blur-sm p-12 rounded-[3rem] shadow-xl max-w-2xl mx-auto border-4 border-white">
             <div className="text-9xl mb-6 opacity-40">🤝</div>
             <h2 className="text-4xl font-black mb-4 uppercase">Gracias por participar</h2>
             <p className="text-2xl text-sos-dark/60 font-semibold mb-8">
               Aunque no ganaste el jackpot, SOS siempre te protege. <br />
               Revisa tu correo para un <span className="text-sos-orange">10% de descuento</span> especial en cualquier servicio.
             </p>
             <button
               onClick={onFinish}
               className="w-full py-6 bg-sos-dark text-white rounded-2xl text-2xl font-black"
             >
               SIGUIENTE JUGADOR
             </button>
          </div>
        </div>
      )}
      
      <p className="mt-12 text-sos-dark/30 font-bold animate-pulse uppercase tracking-[0.2em]">
        Reiniciando en unos segundos...
      </p>
    </div>
  );
};

export default ResultScreen;
