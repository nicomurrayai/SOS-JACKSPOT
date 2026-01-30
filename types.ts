
export enum AppState {
  WELCOME = 'WELCOME',
  EMAIL_INPUT = 'EMAIL_INPUT',
  GAME = 'GAME',
  RESULT = 'RESULT'
}

export interface ServiceIcon {
  id: string;
  image: string;
  label: string;
  color: string;
}

export interface GameResult {
  isWinner: boolean;
  prize?: string | null;
  winningIcon?: ServiceIcon | null;
}

export interface Lead {
  email: string;
  isWinner: boolean;
  prize: null | string;
}
