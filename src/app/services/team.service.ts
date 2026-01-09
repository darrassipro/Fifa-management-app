import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team, Formation, TeamStats } from '../models/team.model';
import { Player } from '../models/player.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  
  private readonly TEAM_STORAGE_KEY = 'fifa_manager_team';
  private teamSubject: BehaviorSubject<Team | null>;
  public team$: Observable<Team | null>;

  constructor(private storageService: StorageService) {
    const savedTeam = this.loadTeamFromStorage();
    this.teamSubject = new BehaviorSubject<Team | null>(savedTeam);
    this.team$ = this.teamSubject.asObservable();
  }

  /**
   * Get current team value
   */
  getCurrentTeam(): Team | null {
    return this.teamSubject.value;
  }

  /**
   * Create a new team
   */
  createTeam(name: string, logoUrl: string, formation: Formation, stadium: string = 'Home Stadium'): Team {
    const newTeam: Team = {
      id: this.generateId(),
      name,
      logoUrl,
      formation,
      players: [],
      overallRating: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      foundedDate: new Date(),
      stadium
    };

    this.teamSubject.next(newTeam);
    this.saveTeamToStorage(newTeam);
    return newTeam;
  }

  /**
   * Update team information
   */
  updateTeam(updates: Partial<Team>): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedTeam = { ...currentTeam, ...updates };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Add player to team
   */
  addPlayer(player: Player): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedPlayers = [...currentTeam.players, player];
      const updatedTeam = {
        ...currentTeam,
        players: updatedPlayers,
        overallRating: this.calculateTeamRating(updatedPlayers)
      };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Remove player from team
   */
  removePlayer(playerId: string): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedPlayers = currentTeam.players.filter(p => p.id !== playerId);
      const updatedTeam = {
        ...currentTeam,
        players: updatedPlayers,
        overallRating: this.calculateTeamRating(updatedPlayers)
      };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Update player in team
   */
  updatePlayer(updatedPlayer: Player): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedPlayers = currentTeam.players.map(p => 
        p.id === updatedPlayer.id ? updatedPlayer : p
      );
      const updatedTeam = {
        ...currentTeam,
        players: updatedPlayers,
        overallRating: this.calculateTeamRating(updatedPlayers)
      };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Set all players for team
   */
  setPlayers(players: Player[]): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedTeam = {
        ...currentTeam,
        players,
        overallRating: this.calculateTeamRating(players)
      };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Update team stats after match
   */
  updateTeamStats(won: boolean, drawn: boolean, goalsScored: number, goalsConceded: number): void {
    const currentTeam = this.teamSubject.value;
    if (currentTeam) {
      const updatedTeam = {
        ...currentTeam,
        wins: won ? currentTeam.wins + 1 : currentTeam.wins,
        draws: drawn ? currentTeam.draws + 1 : currentTeam.draws,
        losses: (!won && !drawn) ? currentTeam.losses + 1 : currentTeam.losses,
        goalsScored: currentTeam.goalsScored + goalsScored,
        goalsConceded: currentTeam.goalsConceded + goalsConceded
      };
      this.teamSubject.next(updatedTeam);
      this.saveTeamToStorage(updatedTeam);
    }
  }

  /**
   * Get team statistics
   */
  getTeamStats(): TeamStats | null {
    const team = this.teamSubject.value;
    if (!team) return null;

    const matchesPlayed = team.wins + team.draws + team.losses;
    const averagePlayerForm = team.players.length > 0
      ? team.players.reduce((sum, p) => sum + p.form, 0) / team.players.length
      : 0;

    return {
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      goalsScored: team.goalsScored,
      goalsConceded: team.goalsConceded,
      matchesPlayed,
      averagePlayerForm: Math.round(averagePlayerForm),
      teamRating: team.overallRating
    };
  }

  /**
   * Calculate team overall rating based on players
   */
  private calculateTeamRating(players: Player[]): number {
    if (players.length === 0) return 0;
    const totalRating = players.reduce((sum, player) => sum + player.overallRating, 0);
    return Math.round(totalRating / players.length);
  }

  /**
   * Save team to localStorage
   */
  private saveTeamToStorage(team: Team): void {
    this.storageService.setItem(this.TEAM_STORAGE_KEY, team);
  }

  /**
   * Load team from localStorage
   */
  private loadTeamFromStorage(): Team | null {
    return this.storageService.getItem<Team>(this.TEAM_STORAGE_KEY);
  }

  /**
   * Delete team
   */
  deleteTeam(): void {
    this.teamSubject.next(null);
    this.storageService.removeItem(this.TEAM_STORAGE_KEY);
  }

  /**
   * Check if team exists
   */
  hasTeam(): boolean {
    return this.teamSubject.value !== null;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
