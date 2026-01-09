import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { FootballApiService } from '../../services/football-api.service';
import { Player, PlayerPosition } from '../../models/player.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {
  
  team: Team | null = null;
  availablePlayers: Player[] = [];
  teamPlayers: Player[] = [];
  selectedPlayer: Player | null = null;
  searchTeamName = 'Arsenal';
  filterPosition: string = 'ALL';
  isLoading = false;
  private destroy$ = new Subject<void>();

  positions = ['ALL', ...Object.values(PlayerPosition)];

  constructor(
    private teamService: TeamService,
    private playerService: PlayerService,
    private footballApiService: FootballApiService
  ) {}

  ngOnInit(): void {
    // Subscribe to team changes
    this.teamService.team$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(team => {
      this.team = team;
      if (team) {
        this.teamPlayers = team.players;
      }
    });

    // Subscribe to available players
    this.playerService.players$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(players => {
      this.availablePlayers = players;
    });

    // Load initial players
    this.loadPlayers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlayers(): void {
    if (!this.searchTeamName) return;
    
    this.isLoading = true;
    this.footballApiService.getPlayers(this.searchTeamName).subscribe({
      next: (players) => {
        this.availablePlayers = players;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.isLoading = false;
      }
    });
  }

  getFilteredPlayers(): Player[] {
    if (this.filterPosition === 'ALL') {
      return this.availablePlayers;
    }
    return this.availablePlayers.filter(p => p.position === this.filterPosition);
  }

  addPlayerToTeam(player: Player): void {
    if (!this.team) return;
    
    // Check if player already in team
    if (this.teamPlayers.find(p => p.id === player.id)) {
      alert('Player already in your team!');
      return;
    }

    // Check max players (e.g., 25)
    if (this.teamPlayers.length >= 25) {
      alert('Team is full! Maximum 25 players allowed.');
      return;
    }

    this.teamService.addPlayer(player);
  }

  removePlayerFromTeam(playerId: string): void {
    if (confirm('Remove this player from your team?')) {
      this.teamService.removePlayer(playerId);
    }
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
  }

  closePlayerDetails(): void {
    this.selectedPlayer = null;
  }

  isPlayerInTeam(playerId: string): boolean {
    return this.teamPlayers.some(p => p.id === playerId);
  }

  getPositionColor(position: PlayerPosition): string {
    const colors: { [key: string]: string } = {
      'GK': '#f39c12',
      'LB': '#3498db',
      'CB': '#3498db',
      'RB': '#3498db',
      'CDM': '#9b59b6',
      'CM': '#9b59b6',
      'CAM': '#9b59b6',
      'LW': '#e74c3c',
      'RW': '#e74c3c',
      'ST': '#e74c3c'
    };
    return colors[position] || '#95a5a6';
  }

  getFormColor(form: number): string {
    if (form >= 80) return '#27ae60';
    if (form >= 60) return '#f39c12';
    return '#e74c3c';
  }

  getPlayersByPosition(position: string): Player[] {
    return this.teamPlayers.filter(p => p.position === position);
  }
}
