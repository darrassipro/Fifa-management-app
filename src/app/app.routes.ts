import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TeamComponent } from './components/team/team.component';
import { PlayersComponent } from './components/players/players.component';
import { MatchesComponent } from './components/matches/matches.component';
import { TeamGuard } from './guards/team.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'players',
    component: PlayersComponent,
    canActivate: [TeamGuard]
  },
  {
    path: 'matches',
    component: MatchesComponent,
    canActivate: [TeamGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
