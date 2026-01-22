
import { ServiceIcon } from './types';

export const SERVICE_ICONS: ServiceIcon[] = [
  { id: 'towing', emoji: '🚗', label: 'Asistencia Vial', color: '#ff4020' },
  { id: 'pet', emoji: '🐶', label: 'Mascotas', color: '#4a90e2' },
  { id: 'recovery', emoji: '🚚', label: 'Remolque / Grúa', color: '#f5a623' },
  { id: 'home', emoji: '🏠', label: 'Asistencia Hogar', color: '#7ed321' },
];

export const CONFIG = {
  WIN_PROBABILITY: 0.15, // 15% chance to win
  SPIN_DURATION: 3000,   // ms
  REEL_DELAY: 500,       // stagger between reels
  APP_NAME: 'SOS Asistencia',
  BRAND_ORANGE: '#ff4020',
};
