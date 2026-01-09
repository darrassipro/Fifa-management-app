import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player.service';
import { Team } from '../../models/team.model';
import { Match, MatchStatus, MatchEvent } from '../../models/match.model';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit, OnDestroy {
  
  team: Team | null = null;
  matches: Match[] = [];
  currentMatch: Match | null = null;
  isSimulating = false;
  opponentTeam = 'Manchester United';
  opponentRating = 85;
  simulationMode: 'instant' | 'live' = 'instant';
  liveMatchEvents: MatchEvent[] = [];
  
  private destroy$ = new Subject<void>();

  opponentTeams = [
    { name: 'Manchester United', rating: 85 },
    { name: 'Liverpool', rating: 87 },
    { name: 'Chelsea', rating: 83 },
    { name: 'Manchester City', rating: 90 },
    { name: 'Arsenal', rating: 84 },
    { name: 'Tottenham', rating: 82 },
    { name: 'Real Madrid', rating: 92 },
    { name: 'Barcelona', rating: 88 },
    { name: 'Bayern Munich', rating: 89 },
    { name: 'Juventus', rating: 86 }
  ];

  constructor(
    private teamService: TeamService,
    private matchService: MatchService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    // Subscribe to team
    this.teamService.team$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(team => {
      this.team = team;
    });

    // Subscribe to matches
    this.matchService.matches$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(matches => {
      this.matches = matches.filter(m => m.status === MatchStatus.FINISHED);
    });

    // Subscribe to live match events
    this.matchService.liveMatchEvents$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.liveMatchEvents.push(event);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOpponentChange(): void {
    const selected = this.opponentTeams.find(t => t.name === this.opponentTeam);
    if (selected) {
      this.opponentRating = selected.rating;
    }
  }

  playMatch(): void {
    if (!this.team || this.team.players.length === 0) {
      alert('You need players in your team to play a match!');
      return;
    }

    this.isSimulating = true;
    this.liveMatchEvents = [];

    if (this.simulationMode === 'instant') {
      this.playInstantMatch();
    } else {
      this.playLiveMatch();
    }
  }

  private playInstantMatch(): void {
    this.matchService.simulateMatch(
      this.team!.name,
      this.opponentTeam,
      this.team!.overallRating,
      this.opponentRating,
      this.team!.players
    ).subscribe({
      next: (match) => {
        this.currentMatch = match;
        this.updateTeamStats(match);
        this.updatePlayerStats(match);
        this.isSimulating = false;
      },
      error: (error) => {
        console.error('Error simulating match:', error);
        this.isSimulating = false;
      }
    });
  }

  private playLiveMatch(): void {
    this.matchService.simulateLiveMatch(
      this.team!.name,
      this.opponentTeam,
      this.team!.overallRating,
      this.opponentRating,
      this.team!.players
    ).subscribe({
      next: (match) => {
        this.currentMatch = match;
      },
      complete: () => {
        if (this.currentMatch) {
          this.updateTeamStats(this.currentMatch);
          this.updatePlayerStats(this.currentMatch);
        }
        this.isSimulating = false;
      },
      error: (error) => {
        console.error('Error simulating live match:', error);
        this.isSimulating = false;
      }
    });
  }

  private updateTeamStats(match: Match): void {
    const won = match.homeScore > match.awayScore;
    const drawn = match.homeScore === match.awayScore;
    
    this.teamService.updateTeamStats(
      won,
      drawn,
      match.homeScore,
      match.awayScore
    );
  }

  private updatePlayerStats(match: Match): void {
    // Update player forms based on match result
    const won = match.homeScore > match.awayScore;
    const formChange = won ? 2 : -1;

    // Decrease fitness for all players
    this.playerService.decreaseAllPlayersFitness(5);

    // Update forms
    this.team?.players.forEach(player => {
      this.playerService.updatePlayerForm(player.id, formChange);
    });

    // Update goals and assists for scorers
    match.events.forEach(event => {
      if (event.type === 'GOAL') {
        const player = this.team?.players.find(p => p.name === event.playerName);
        if (player) {
          this.playerService.updatePlayerStats(player.id, 1, 0);
          // Update in team service as well
          const updatedPlayer = { ...player, goals: player.goals + 1, matchesPlayed: player.matchesPlayed + 1 };
          this.teamService.updatePlayer(updatedPlayer);
        }
      }
    });
  }

  closeMatchResult(): void {
    this.currentMatch = null;
    this.liveMatchEvents = [];
  }

  getMatchResult(match: Match): string {
    if (match.homeScore > match.awayScore) return 'WIN';
    if (match.homeScore < match.awayScore) return 'LOSS';
    return 'DRAW';
  }

  getMatchResultClass(match: Match): string {
    const result = this.getMatchResult(match);
    return result.toLowerCase();
  }

  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'GOAL': '⚽',
      'YELLOW_CARD': '🟨',
      'RED_CARD': '🟥',
      'SUBSTITUTION': '🔄'
    };
    return icons[type] || '📋';
  }
}
