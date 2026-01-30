
import { ServiceIcon } from './types';

export const SERVICE_ICONS: ServiceIcon[] = [
  { id: 'sos', image: '/sos-logo.png', label: 'SOS', color: '#ff4020' },
  { id: 'grua', image: '/camion.png', label: 'Grúa', color: '#f5a623' },
  { id: 'moto', image: '/moto.png', label: 'Moto', color: '#4a90e2' },
  { id: 'moura', image: '/moura-logo.png', label: 'Moura', color: '#113c70' },
  { id: 'lusqtoff', image: '/lusqtoff.png', label: 'Lüsqtoff', color: '#ff6f00' },
];

export const CONFIG = {
  WIN_PROBABILITY: 0.15,
  SPIN_DURATION: 2000,
  REEL_DELAY: 2500,
};

export const WIN_MESSAGES: Record<string, { title: string }> = {
  sos: {
    title: '¡Te ganaste un Voucher por $10.000 en Atalaya!'
  },
  grua: {
    title: '¡Te ganaste un regalo de SOS!',
  },
  moto: {
    title: '¡Te ganaste un regalo de SOS!',
  },
  moura: {
    title: '¡Te ganaste un regalo de Moura!',
  },
  lusqtoff: {
    title: '¡Te ganaste un regalo de Lüsqtoff!',
  },
};
