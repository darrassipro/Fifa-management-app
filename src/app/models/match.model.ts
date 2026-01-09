export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  status: MatchStatus;
  homeTeamRating: number;
  awayTeamRating: number;
  events: MatchEvent[];
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED'
}

export interface MatchEvent {
  minute: number;
  type: EventType;
  playerName: string;
  description: string;
}

export enum EventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SUBSTITUTION = 'SUBSTITUTION'
}

export interface MatchSimulationResult {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  winner: 'home' | 'away' | 'draw';
}
