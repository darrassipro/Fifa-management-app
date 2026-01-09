import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { FootballApiService } from './football-api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  private playersSubject: BehaviorSubject<Player[]>;
  public players$: Observable<Player[]>;

  constructor(private footballApiService: FootballApiService) {
    this.playersSubject = new BehaviorSubject<Player[]>([]);
    this.players$ = this.playersSubject.asObservable();
  }

  /**
   * Load players from API
   */
  loadPlayers(teamName: string = 'Arsenal'): void {
    this.footballApiService.getPlayers(teamName).subscribe({
      next: (players) => {
        this.playersSubject.next(players);
      },
      error: (error) => {
        console.error('Error loading players:', error);
      }
    });
  }

  /**
   * Get current players
   */
  getCurrentPlayers(): Player[] {
    return this.playersSubject.value;
  }

  /**
   * Get player by ID
   */
  getPlayerById(id: string): Player | undefined {
    return this.playersSubject.value.find(p => p.id === id);
  }

  /**
   * Update player form after match
   */
  updatePlayerForm(playerId: string, formChange: number): void {
    const players = this.playersSubject.value;
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const newForm = Math.max(1, Math.min(100, player.form + formChange));
        return { ...player, form: newForm };
      }
      return player;
    });
    this.playersSubject.next(updatedPlayers);
  }

  /**
   * Update player fitness
   */
  updatePlayerFitness(playerId: string, fitnessChange: number): void {
    const players = this.playersSubject.value;
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const newFitness = Math.max(1, Math.min(100, player.fitness + fitnessChange));
        return { ...player, fitness: newFitness };
      }
      return player;
    });
    this.playersSubject.next(updatedPlayers);
  }

  /**
   * Update player stats after match
   */
  updatePlayerStats(playerId: string, goals: number = 0, assists: number = 0): void {
    const players = this.playersSubject.value;
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          goals: player.goals + goals,
          assists: player.assists + assists,
          matchesPlayed: player.matchesPlayed + 1
        };
      }
      return player;
    });
    this.playersSubject.next(updatedPlayers);
  }

  /**
   * Decrease fitness for all players after match
   */
  decreaseAllPlayersFitness(amount: number = 5): void {
    const players = this.playersSubject.value;
    const updatedPlayers = players.map(player => ({
      ...player,
      fitness: Math.max(1, player.fitness - amount)
    }));
    this.playersSubject.next(updatedPlayers);
  }

  /**
   * Restore all players fitness (training/rest)
   */
  restoreAllPlayersFitness(amount: number = 10): void {
    const players = this.playersSubject.value;
    const updatedPlayers = players.map(player => ({
      ...player,
      fitness: Math.min(100, player.fitness + amount)
    }));
    this.playersSubject.next(updatedPlayers);
  }

  /**
   * Get top scorers
   */
  getTopScorers(limit: number = 5): Player[] {
    return [...this.playersSubject.value]
      .sort((a, b) => b.goals - a.goals)
      .slice(0, limit);
  }

  /**
   * Get top assist providers
   */
  getTopAssists(limit: number = 5): Player[] {
    return [...this.playersSubject.value]
      .sort((a, b) => b.assists - a.assists)
      .slice(0, limit);
  }

  /**
   * Get players by position
   */
  getPlayersByPosition(position: string): Player[] {
    return this.playersSubject.value.filter(p => p.position === position);
  }

  /**
   * Clear all players
   */
  clearPlayers(): void {
    this.playersSubject.next([]);
  }
}
