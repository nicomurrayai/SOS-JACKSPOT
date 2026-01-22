
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-8 flex justify-between items-center w-full z-10">
      <div className="flex items-center gap-4">
        <div className="bg-sos-orange text-sos-white px-6 py-2 rounded-full font-black text-4xl shadow-lg">
          SOS
        </div>
        <div className="hidden md:block h-10 w-1 bg-sos-dark/10 rounded-full" />
        <span className="text-xl font-bold uppercase tracking-widest text-sos-dark/60 hidden md:block">
          Red de Asistencia
        </span>
      </div>
      <div className="text-sos-orange font-bold text-lg animate-pulse">
        GANA PREMIOS AL INSTANTE • JUEGA AHORA
      </div>
    </header>
  );
};

export default Header;
