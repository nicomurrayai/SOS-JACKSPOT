
import React, { useState } from 'react';

interface EmailFormProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido');
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-12 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-4">¿QUIERES JUGAR?</h2>
        <p className="text-lg text-sos-dark/60 font-semibold">Ingresa tu correo para activar la Máquina Jackpot de SOS</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="tu@correo.com"
            className="w-full px-8 py-4 text-2xl font-bold bg-sos-beige/50 border-4 border-transparent focus:border-sos-orange outline-none rounded-2xl transition-all text-center"
            autoFocus
          />
          {error && (
            <p className="text-sos-orange font-bold text-center mt-4 text-xl animate-bounce">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-4 text-white rounded-2xl text-2xl font-black bg-sos-orange shadow-xl transition-all"
        >
          RECLAMAR TIRO GRATIS
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full py-4 text-sos-dark/40 font-bold text-lg hover:text-sos-dark transition-colors"
        >
          ← REGRESAR
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
