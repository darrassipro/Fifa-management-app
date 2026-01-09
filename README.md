# FIFA Manager - Football Management Web App

A comprehensive FIFA-style football management web application built with Angular, featuring team management, player recruitment, and match simulation with real-time updates.

## 🎯 Features

### Core Features
- **Team Management**: Create and manage your custom football team
- **Player Recruitment**: Browse and recruit players from real football teams using TheSportsDB API
- **Match Simulation**: Play matches with two modes:
  - Instant simulation with immediate results
  - Live simulation with real-time event updates using RxJS intervals
- **Dashboard**: View team statistics, recent matches, and performance metrics
- **Persistent Storage**: All data saved to localStorage

### Technical Features
- Standalone Angular components
- Reactive data flow with RxJS BehaviorSubject and Observables
- Angular Router with route guards
- Reactive Forms with validation
- HTTP Client for API integration
- TypeScript interfaces and models
- **Tailwind CSS** for modern, utility-first styling
- SCSS for custom animations and components
- Responsive design (mobile-first)

## 📁 Project Structure

```
fifa-manager/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          # Dashboard component
│   │   │   ├── team/               # Team management component
│   │   │   ├── players/            # Players component
│   │   │   └── matches/            # Matches simulation component
│   │   ├── models/
│   │   │   ├── player.model.ts     # Player interface and enums
│   │   │   ├── team.model.ts       # Team interface and enums
│   │   │   └── match.model.ts      # Match interface and enums
│   │   ├── services/
│   │   │   ├── storage.service.ts      # LocalStorage service
│   │   │   ├── football-api.service.ts # External API service
│   │   │   ├── team.service.ts         # Team state management
│   │   │   ├── player.service.ts       # Player state management
│   │   │   └── match.service.ts        # Match simulation service
│   │   ├── guards/
│   │   │   └── team.guard.ts       # Route guard for team creation
│   │   ├── app.component.ts        # Root component
│   │   ├── app.routes.ts           # Route configuration
│   │   └── app.config.ts           # App configuration
│   ├── main.ts                     # Bootstrap file
│   ├── index.html                  # HTML entry point
│   └── styles.scss                 # Global styles
├── package.json
├── tsconfig.json
├── angular.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Tech Stack
- **Angular 17+** - Modern Angular with standalone components
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe development
- **SCSS** - Custom styling where needed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fifa-manager
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## 📖 Usage Guide

### 1. Create Your Team
- Navigate to the "Team" page
- Enter your team name, stadium, and select a formation
- The app will attempt to load a logo from TheSportsDB if you enter a real team name
- Click "Create Team" to proceed

### 2. Recruit Players
- Go to the "Players" page
- Search for players by team name (e.g., "Arsenal", "Liverpool")
- Browse available players and view detailed statistics
- Add players to your team (max 25 players)
- View your squad and manage player positions

### 3. Play Matches
- Navigate to the "Matches" page
- Select an opponent team from the dropdown
- Choose simulation mode:
  - **Instant**: Get immediate match results
  - **Live**: Watch the match unfold in real-time
- Click "Play Match" to start the simulation
- View match events, goals, and final scores

### 4. Monitor Dashboard
- Check your team's overall performance
- View recent match results
- Monitor player form and fitness levels
- Track wins, losses, and goal statistics

## 🏗️ Architecture

### State Management
The app uses a service-based state management approach with RxJS:

```typescript
// BehaviorSubject for state
private teamSubject = new BehaviorSubject<Team | null>(null);

// Observable for components to subscribe
public team$ = this.teamSubject.asObservable();
```

### Data Flow
1. Components subscribe to service observables
2. Services manage state using BehaviorSubjects
3. State changes are broadcast to all subscribers
4. LocalStorage keeps data persistent

### API Integration
- **TheSportsDB API**: Player images, team logos, and player data
- **Football-Data.org**: Player statistics (configured but uses mock data as fallback)
- Error handling with fallback to mock data

### Match Simulation
The match simulation uses RxJS operators for live updates:

```typescript
interval(1000).pipe(
  takeWhile(() => currentMinute <= 90),
  map(() => {
    // Simulate match events
    // Update scores
    // Emit events
  })
)
```

## 🎨 Styling

- Custom SCSS with variables
- Responsive design (mobile-first approach)
- Gradient backgrounds and modern UI
- Smooth animations and transitions
- Card-based layouts

## 🔧 Configuration

### Tailwind CSS
The app uses Tailwind CSS for styling. Configuration in `tailwind.config.js`:
- Custom color palette (primary, success, warning, danger)
- Custom animations (fade-in, slide-in)
- Extended theme with football-specific colors

See [TAILWIND.md](TAILWIND.md) for detailed Tailwind CSS documentation.

### Environment Setup
The app uses default Angular configuration. To modify:

1. **API Endpoints**: Edit `src/app/services/football-api.service.ts`
2. **Formations**: Add to `src/app/models/team.model.ts`
3. **Player Positions**: Modify `src/app/models/player.model.ts`
4. **Tailwind Theme**: Edit `tailwind.config.js`

### LocalStorage Keys
- `fifa_manager_team`: Team data
- `fifa_manager_matches`: Match history

## 📊 Data Models

### Player Model
```typescript
interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  imageUrl: string;
  form: number;
  fitness: number;
  overallRating: number;
  // ... attributes
}
```

### Team Model
```typescript
interface Team {
  id: string;
  name: string;
  logoUrl: string;
  formation: Formation;
  players: Player[];
  overallRating: number;
  // ... stats
}
```

### Match Model
```typescript
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  events: MatchEvent[];
}
```

## 🧪 Development

### Code Standards
- TypeScript strict mode enabled
- Standalone components (no NgModules)
- Reactive programming with RxJS
- OnPush change detection where applicable

### Component Lifecycle
All components implement OnInit and OnDestroy:
```typescript
ngOnInit() {
  // Subscribe to observables
  this.service.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => {
    // Handle data
  });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 🚀 Building for Production

```bash
ng build --configuration production
```

Output will be in the `dist/` directory.

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📝 Future Enhancements

- [ ] Add player training system
- [ ] Implement league table and seasons
- [ ] Add multiplayer (vs other users)
- [ ] Implement player transfer market
- [ ] Add tactics and strategy customization
- [ ] Integrate more detailed match statistics
- [ ] Add player injury system
- [ ] Implement team chemistry mechanics

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- TheSportsDB for player and team data
- Angular team for the framework
- RxJS for reactive programming capabilities

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Angular**
