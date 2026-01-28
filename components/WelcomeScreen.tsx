import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans">
      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
        
        {/* Contenedor Grid para Desktop (Vehículo - Texto - Vehículo) */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* --- IMAGEN IZQUIERDA (Moto) --- */}
          <div className="lg:col-span-3 hidden lg:flex justify-end animate-in slide-in-from-left duration-1000">
             {/* Nota: Asegúrate de que la imagen no tenga fondo (PNG transparente) */}
            <img 
              src="/moto.png" 
              alt="Moto SOS" 
              className="w-full max-w-[300px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* --- TEXTO CENTRAL Y BOTÓN --- */}
          <div className="lg:col-span-6 text-center flex flex-col items-center z-20">
            <h1 className="text-2xl md:text-3xl  font-black text-gray-900 flex flex-col gap-2 mb-6 tracking-tight">
              LA SUERTE ESTÁ <br />
              <span className="text-sos-orange">DE TU LADO</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg mx-auto font-medium leading-relaxed">
              ¡Prueba tu suerte con el Jackpot de SOS y gana premios exclusivos de asistencia vial y para el hogar!
            </p>

            {/* Botón CTA mejorado */}
            <button
              onClick={onStart}
              className="group relative px-10 py-5 md:px-14 md:py-4 bg-[#FF2D20] text-white rounded-2xl shadow-[0_8px_0_0_#b91c1c] active:shadow-none active:translate-y-[8px] transition-all duration-150 ease-out hover:bg-[#ff4033]"
            >
              <span className="relative z-10 text-2xl md:text-3xl font-black tracking-wide uppercase italic">
                Empezar a Jugar
              </span>
              {/* Brillo interno */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20 rounded-2xl pointer-events-none" />
            </button>
            
            {/* Versión móvil de las imágenes (se muestran abajo en móviles) */}
            <div className="flex lg:hidden items-center justify-center gap-4 mt-12 opacity-90">
                <img src="/moto.png" alt="Moto" className="w-32 md:w-40 drop-shadow-xl" />
                <img src="/camion.png" alt="Camión" className="w-36 md:w-48 drop-shadow-xl" />
            </div>
          </div>

          {/* --- IMAGEN DERECHA (Camión) --- */}
          <div className="lg:col-span-3 hidden lg:flex justify-start animate-in slide-in-from-right duration-1000 delay-100">
            <img 
              src="/camion.png" 
              alt="Camión SOS" 
              className="w-full max-w-[350px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>

        </div>
      </main>

      {/* Elemento decorativo de fondo (Brillo central) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-3xl -z-0 pointer-events-none" />
    </div>
  );
};

export default WelcomeScreen;