import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Player, PlayerPosition } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FootballApiService {
  
  private readonly SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';
  private readonly FOOTBALL_DATA_API = 'https://api.football-data.org/v4';

  constructor(private http: HttpClient) { }

  /**
   * Fetch players from TheSportsDB
   */
  getPlayers(teamName: string = 'Arsenal'): Observable<Player[]> {
    const url = `${this.SPORTSDB_API}/searchplayers.php?t=${teamName}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.player) {
          return this.mapSportsDbPlayersToPlayers(response.player);
        }
        return this.getMockPlayers();
      }),
      catchError((error) => {
        console.error('Error fetching players from API:', error);
        return of(this.getMockPlayers());
      })
    );
  }

  /**
   * Get team logo from TheSportsDB
   */
  getTeamLogo(teamName: string): Observable<string> {
    const url = `${this.SPORTSDB_API}/searchteams.php?t=${teamName}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.teams && response.teams.length > 0) {
          return response.teams[0].strTeamBadge || this.getDefaultLogo();
        }
        return this.getDefaultLogo();
      }),
      catchError(() => of(this.getDefaultLogo()))
    );
  }

  /**
   * Map TheSportsDB player data to our Player model
   */
  private mapSportsDbPlayersToPlayers(apiPlayers: any[]): Player[] {
    return apiPlayers.slice(0, 25).map((apiPlayer, index) => ({
      id: apiPlayer.idPlayer || `player-${index}`,
      name: apiPlayer.strPlayer || 'Unknown Player',
      position: this.mapPosition(apiPlayer.strPosition),
      imageUrl: apiPlayer.strCutout || apiPlayer.strThumb || this.getDefaultPlayerImage(),
      form: this.getRandomNumber(60, 95),
      fitness: this.getRandomNumber(70, 100),
      overallRating: this.getRandomNumber(65, 90),
      pace: this.getRandomNumber(50, 95),
      shooting: this.getRandomNumber(50, 90),
      passing: this.getRandomNumber(50, 90),
      dribbling: this.getRandomNumber(50, 90),
      defending: this.getRandomNumber(30, 85),
      physical: this.getRandomNumber(50, 90),
      nationality: apiPlayer.strNationality || 'Unknown',
      age: this.calculateAge(apiPlayer.dateBorn) || this.getRandomNumber(18, 35),
      goals: 0,
      assists: 0,
      matchesPlayed: 0
    }));
  }

  /**
   * Map position string to PlayerPosition enum
   */
  private mapPosition(position: string): PlayerPosition {
    if (!position) return PlayerPosition.CM;
    
    const posMap: { [key: string]: PlayerPosition } = {
      'Goalkeeper': PlayerPosition.GK,
      'Defender': PlayerPosition.CB,
      'Midfielder': PlayerPosition.CM,
      'Forward': PlayerPosition.ST,
      'Striker': PlayerPosition.ST,
      'Winger': PlayerPosition.LW
    };

    for (const [key, value] of Object.entries(posMap)) {
      if (position.includes(key)) {
        return value;
      }
    }

    return PlayerPosition.CM;
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: string): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Generate random number between min and max
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get default player image
   */
  private getDefaultPlayerImage(): string {
    return 'https://via.placeholder.com/150/0066cc/ffffff?text=Player';
  }

  /**
   * Get default team logo
   */
  private getDefaultLogo(): string {
    return 'https://via.placeholder.com/150/cc0000/ffffff?text=Team';
  }

  /**
   * Fallback mock players if API fails
   */
  private getMockPlayers(): Player[] {
    const positions = Object.values(PlayerPosition);
    const names = [
      'John Smith', 'David Johnson', 'Michael Brown', 'James Wilson',
      'Robert Taylor', 'William Anderson', 'Richard Thomas', 'Joseph Martin',
      'Charles Jackson', 'Thomas White', 'Daniel Harris', 'Matthew Clark',
      'Anthony Lewis', 'Mark Walker', 'Donald Hall', 'Steven Allen',
      'Paul Young', 'Andrew King', 'Joshua Wright', 'Kenneth Scott',
      'Kevin Green', 'Brian Adams', 'George Baker', 'Edward Nelson',
      'Ronald Carter'
    ];

    return names.map((name, index) => ({
      id: `mock-player-${index}`,
      name: name,
      position: positions[index % positions.length],
      imageUrl: this.getDefaultPlayerImage(),
      form: this.getRandomNumber(60, 95),
      fitness: this.getRandomNumber(70, 100),
      overallRating: this.getRandomNumber(65, 90),
      pace: this.getRandomNumber(50, 95),
      shooting: this.getRandomNumber(50, 90),
      passing: this.getRandomNumber(50, 90),
      dribbling: this.getRandomNumber(50, 90),
      defending: this.getRandomNumber(30, 85),
      physical: this.getRandomNumber(50, 90),
      nationality: 'England',
      age: this.getRandomNumber(18, 35),
      goals: 0,
      assists: 0,
      matchesPlayed: 0
    }));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
