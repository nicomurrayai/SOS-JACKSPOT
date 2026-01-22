
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-in fade-in zoom-in duration-500 max-w-4xl">
      <h1 className="text-4xl md:text-9xl font-black mb-8 leading-tight">
        LA SUERTE ESTÁ <br />
        <span className="text-sos-orange">DE TU LADO</span>
      </h1>
      <p className="text-2xl md:text-3xl text-sos-dark/70 mb-12 max-w-2xl mx-auto font-medium">
        ¡Prueba tu suerte con el Jackpot de SOS y gana premios exclusivos de asistencia vial y para el hogar!
      </p>
      
      <button
        onClick={onStart}
        className="group relative px-12 py-6 bg-sos-orange text-white rounded-2xl text-4xl font-black shadow-[0_12px_0_0_#d9341a] active:shadow-none active:translate-y-[8px] transition-all"
      >
        <span className="relative z-10">EMPEZAR A JUGAR</span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
      </button>
      
      <div className="mt-16 flex justify-center gap-12 opacity-40 grayscale scale-110">
        <span className="text-5xl">🚗</span>
        <span className="text-5xl">🐶</span>
        <span className="text-5xl">🏠</span>
        <span className="text-5xl">🚚</span>
      </div>
    </div>
  );
};

export default WelcomeScreen;
