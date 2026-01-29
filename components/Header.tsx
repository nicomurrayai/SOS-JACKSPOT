
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-8 flex justify-between items-center w-full z-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <img src="/sos-logo.png" alt="SOS Logo" className="w-20 " />
      </div>
      <div className="text-sos-orange text-sm font-bold animate-pulse">
        GANA PREMIOS AL INSTANTE • JUEGA AHORA
      </div>
    </header>
  );
};

export default Header;
