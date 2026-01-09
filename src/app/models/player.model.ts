export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  imageUrl: string;
  form: number; // 1-100
  fitness: number; // 1-100
  overallRating: number; // 1-100
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  nationality: string;
  age: number;
  goals: number;
  assists: number;
  matchesPlayed: number;
}

export enum PlayerPosition {
  GK = 'GK',
  LB = 'LB',
  CB = 'CB',
  RB = 'RB',
  CDM = 'CDM',
  CM = 'CM',
  CAM = 'CAM',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST'
}

export interface PlayerStats {
  goals: number;
  assists: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}
