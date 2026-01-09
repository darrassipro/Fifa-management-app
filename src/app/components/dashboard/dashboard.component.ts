import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { MatchService } from '../../services/match.service';
import { Team, TeamStats } from '../../models/team.model';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  team: Team | null = null;
  teamStats: TeamStats | null = null;
  recentMatches: Match[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private teamService: TeamService,
    private matchService: MatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to team changes
    this.teamService.team$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(team => {
      this.team = team;
      if (team) {
        this.teamStats = this.teamService.getTeamStats();
      }
    });

    // Subscribe to match changes
    this.matchService.matches$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.recentMatches = this.matchService.getRecentMatches(5);
    });

    // Initial load
    this.recentMatches = this.matchService.getRecentMatches(5);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }

  navigateToPlayers(): void {
    this.router.navigate(['/players']);
  }

  navigateToMatches(): void {
    this.router.navigate(['/matches']);
  }

  getWinPercentage(): number {
    if (!this.teamStats || this.teamStats.matchesPlayed === 0) return 0;
    return Math.round((this.teamStats.wins / this.teamStats.matchesPlayed) * 100);
  }

  getGoalDifference(): number {
    if (!this.teamStats) return 0;
    return this.teamStats.goalsScored - this.teamStats.goalsConceded;
  }
}
