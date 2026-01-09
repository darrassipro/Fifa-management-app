import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { FootballApiService } from '../../services/football-api.service';
import { Team, Formation } from '../../models/team.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  
  teamForm: FormGroup;
  team: Team | null = null;
  formations = Object.values(Formation);
  isEditing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private footballApiService: FootballApiService,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      logoUrl: ['https://via.placeholder.com/150/cc0000/ffffff?text=Team'],
      formation: [Formation.F_4_3_3, Validators.required],
      stadium: ['Home Stadium', Validators.required]
    });
  }

  ngOnInit(): void {
    this.teamService.team$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(team => {
      this.team = team;
      if (team) {
        this.teamForm.patchValue({
          name: team.name,
          logoUrl: team.logoUrl,
          formation: team.formation,
          stadium: team.stadium
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.value;

      if (this.team) {
        // Update existing team
        this.teamService.updateTeam({
          name: formValue.name,
          logoUrl: formValue.logoUrl,
          formation: formValue.formation,
          stadium: formValue.stadium
        });
        this.isEditing = false;
      } else {
        // Create new team
        this.teamService.createTeam(
          formValue.name,
          formValue.logoUrl,
          formValue.formation,
          formValue.stadium
        );
        this.router.navigate(['/players']);
      }
    }
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    if (this.team) {
      this.teamForm.patchValue({
        name: this.team.name,
        logoUrl: this.team.logoUrl,
        formation: this.team.formation,
        stadium: this.team.stadium
      });
    }
  }

  deleteTeam(): void {
    if (confirm('Are you sure you want to delete your team? This action cannot be undone.')) {
      this.teamService.deleteTeam();
      this.router.navigate(['/dashboard']);
    }
  }

  loadTeamLogo(teamName: string): void {
    if (teamName) {
      this.footballApiService.getTeamLogo(teamName).subscribe(logoUrl => {
        this.teamForm.patchValue({ logoUrl });
      });
    }
  }

  onTeamNameChange(): void {
    const teamName = this.teamForm.get('name')?.value;
    if (teamName && teamName.length > 2) {
      this.loadTeamLogo(teamName);
    }
  }

  get canEdit(): boolean {
    return !this.team || this.isEditing;
  }
}
