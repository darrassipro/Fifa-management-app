import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TeamService } from '../services/team.service';

@Injectable({
  providedIn: 'root'
})
export class TeamGuard implements CanActivate {
  
  constructor(
    private teamService: TeamService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.teamService.hasTeam()) {
      return true;
    }
    
    // Redirect to team creation if no team exists
    return this.router.createUrlTree(['/team']);
  }
}
