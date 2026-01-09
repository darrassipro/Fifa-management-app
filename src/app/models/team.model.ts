import { Player } from './player.model';

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  formation: Formation;
  players: Player[];
  overallRating: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  foundedDate: Date;
  stadium: string;
}

export enum Formation {
  F_4_3_3 = '4-3-3',
  F_4_4_2 = '4-4-2',
  F_3_5_2 = '3-5-2',
  F_4_2_3_1 = '4-2-3-1',
  F_3_4_3 = '3-4-3'
}

export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  matchesPlayed: number;
  averagePlayerForm: number;
  teamRating: number;
}
