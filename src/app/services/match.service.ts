import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subject } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import { Match, MatchStatus, MatchEvent, EventType, MatchSimulationResult } from '../models/match.model';
import { Player } from '../models/player.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  
  private readonly MATCHES_STORAGE_KEY = 'fifa_manager_matches';
  private matchesSubject: BehaviorSubject<Match[]>;
  public matches$: Observable<Match[]>;

  private liveMatchSubject: Subject<MatchEvent> = new Subject();
  public liveMatchEvents$: Observable<MatchEvent> = this.liveMatchSubject.asObservable();

  constructor(private storageService: StorageService) {
    const savedMatches = this.loadMatchesFromStorage();
    this.matchesSubject = new BehaviorSubject<Match[]>(savedMatches);
    this.matches$ = this.matchesSubject.asObservable();
  }

  /**
   * Get all matches
   */
  getMatches(): Match[] {
    return this.matchesSubject.value;
  }

  /**
   * Get recent matches
   */
  getRecentMatches(limit: number = 5): Match[] {
    return [...this.matchesSubject.value]
      .filter(m => m.status === MatchStatus.FINISHED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Create and simulate a match
   */
  simulateMatch(
    homeTeam: string,
    awayTeam: string,
    homeRating: number,
    awayRating: number,
    homePlayers: Player[]
  ): Observable<Match> {
    const match: Match = {
      id: this.generateId(),
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      date: new Date(),
      status: MatchStatus.SCHEDULED,
      homeTeamRating: homeRating,
      awayTeamRating: awayRating,
      events: []
    };

    const result = this.runMatchSimulation(homeRating, awayRating, homePlayers);
    
    match.homeScore = result.homeScore;
    match.awayScore = result.awayScore;
    match.events = result.events;
    match.status = MatchStatus.FINISHED;

    this.addMatch(match);
    
    return new Observable(observer => {
      observer.next(match);
      observer.complete();
    });
  }

  /**
   * Simulate live match with real-time events using RxJS interval
   */
  simulateLiveMatch(
    homeTeam: string,
    awayTeam: string,
    homeRating: number,
    awayRating: number,
    homePlayers: Player[]
  ): Observable<Match> {
    const match: Match = {
      id: this.generateId(),
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      date: new Date(),
      status: MatchStatus.LIVE,
      homeTeamRating: homeRating,
      awayTeamRating: awayRating,
      events: []
    };

    const result = this.runMatchSimulation(homeRating, awayRating, homePlayers);
    const sortedEvents = result.events.sort((a, b) => a.minute - b.minute);

    return new Observable(observer => {
      let currentMinute = 0;
      let eventIndex = 0;
      let currentHomeScore = 0;
      let currentAwayScore = 0;

      // Emit events every second (representing ~2 minutes per second)
      const subscription = interval(1000).pipe(
        takeWhile(() => currentMinute <= 90),
        map(() => {
          currentMinute += 2;
          
          // Check for events at this minute
          while (eventIndex < sortedEvents.length && sortedEvents[eventIndex].minute <= currentMinute) {
            const event = sortedEvents[eventIndex];
            match.events.push(event);
            this.liveMatchSubject.next(event);
            
            if (event.type === EventType.GOAL) {
              if (event.description.includes(homeTeam)) {
                currentHomeScore++;
                match.homeScore = currentHomeScore;
              } else {
                currentAwayScore++;
                match.awayScore = currentAwayScore;
              }
            }
            
            eventIndex++;
          }

          // Update match with current scores
          const updatedMatch = { ...match };
          
          // Match finished
          if (currentMinute >= 90) {
            updatedMatch.status = MatchStatus.FINISHED;
            this.addMatch(updatedMatch);
          }

          return updatedMatch;
        })
      ).subscribe({
        next: (updatedMatch) => observer.next(updatedMatch),
        complete: () => {
          observer.complete();
          subscription.unsubscribe();
        }
      });
    });
  }

  /**
   * Run match simulation logic
   */
  private runMatchSimulation(
    homeRating: number,
    awayRating: number,
    homePlayers: Player[]
  ): MatchSimulationResult {
    let homeScore = 0;
    let awayScore = 0;
    const events: MatchEvent[] = [];

    // Calculate team strengths
    const homeStrength = homeRating + this.getRandomFactor();
    const awayStrength = awayRating + this.getRandomFactor();

    // Determine number of goals based on team strength
    const totalStrength = homeStrength + awayStrength;
    const homeGoalChance = homeStrength / totalStrength;

    // Simulate goals (0-5 goals per team)
    const maxGoals = Math.floor(Math.random() * 6) + 1;
    
    for (let i = 0; i < maxGoals; i++) {
      const minute = this.getRandomMinute();
      
      if (Math.random() < homeGoalChance) {
        homeScore++;
        const scorer = this.getRandomPlayer(homePlayers);
        events.push({
          minute,
          type: EventType.GOAL,
          playerName: scorer?.name || 'Unknown',
          description: `Goal! ${scorer?.name} scores for the home team!`
        });
      } else {
        awayScore++;
        events.push({
          minute,
          type: EventType.GOAL,
          playerName: 'Away Player',
          description: `Goal! Away team scores!`
        });
      }
    }

    // Add some random yellow cards
    const yellowCards = Math.floor(Math.random() * 3);
    for (let i = 0; i < yellowCards; i++) {
      const minute = this.getRandomMinute();
      const player = this.getRandomPlayer(homePlayers);
      events.push({
        minute,
        type: EventType.YELLOW_CARD,
        playerName: player?.name || 'Player',
        description: `Yellow card for ${player?.name}`
      });
    }

    const winner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw';

    return {
      homeScore,
      awayScore,
      events,
      winner
    };
  }

  /**
   * Add match to history
   */
  private addMatch(match: Match): void {
    const matches = [...this.matchesSubject.value, match];
    this.matchesSubject.next(matches);
    this.saveMatchesToStorage(matches);
  }

  /**
   * Get random match minute (1-90)
   */
  private getRandomMinute(): number {
    return Math.floor(Math.random() * 90) + 1;
  }

  /**
   * Get random player from list
   */
  private getRandomPlayer(players: Player[]): Player | null {
    if (players.length === 0) return null;
    const index = Math.floor(Math.random() * players.length);
    return players[index];
  }

  /**
   * Get random factor for simulation (-10 to +10)
   */
  private getRandomFactor(): number {
    return Math.floor(Math.random() * 21) - 10;
  }

  /**
   * Clear all matches
   */
  clearMatches(): void {
    this.matchesSubject.next([]);
    this.storageService.removeItem(this.MATCHES_STORAGE_KEY);
  }

  /**
   * Save matches to localStorage
   */
  private saveMatchesToStorage(matches: Match[]): void {
    this.storageService.setItem(this.MATCHES_STORAGE_KEY, matches);
  }

  /**
   * Load matches from localStorage
   */
  private loadMatchesFromStorage(): Match[] {
    return this.storageService.getItem<Match[]>(this.MATCHES_STORAGE_KEY) || [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get match statistics
   */
  getMatchStatistics() {
    const matches = this.matchesSubject.value.filter(m => m.status === MatchStatus.FINISHED);
    const wins = matches.filter(m => m.homeScore > m.awayScore).length;
    const draws = matches.filter(m => m.homeScore === m.awayScore).length;
    const losses = matches.filter(m => m.homeScore < m.awayScore).length;

    return {
      totalMatches: matches.length,
      wins,
      draws,
      losses,
      goalsScored: matches.reduce((sum, m) => sum + m.homeScore, 0),
      goalsConceded: matches.reduce((sum, m) => sum + m.awayScore, 0)
    };
  }
}
