// F1 2026 Season Database
// This includes confirmed drivers, predicted rookies with F2 data, and fantasy values

export interface Driver {
  id: string
  name: string
  team: string
  teamColor: string
  fantasyValue: number // in millions
  predictedPoints: number // season prediction
  isRookie: boolean
  f2ChampionshipPosition?: number // for rookies
  f2Wins?: number // for rookies
  previousSeasonPoints?: number
  previousSeasonPosition?: number
}

export interface Constructor {
  id: string
  name: string
  color: string
  fantasyValue: number
  predictedPoints: number
}

export interface RaceCalendar {
  id: string
  name: string
  circuit: string
  country: string
  date: string
  round: number
}

// F1 Team Colors (2026)
export const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
  'RB': '#6692FF', // Renamed from AlphaTauri
  'Kick Sauber': '#52E252', // Renamed from Alfa Romeo
  'Haas': '#B6BABD',
}

// 2026 F1 Drivers (based on confirmed lineups + predictions)
export const DRIVERS: Driver[] = [
  // Red Bull Racing
  {
    id: 'VER',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: TEAM_COLORS['Red Bull Racing'],
    fantasyValue: 32.5,
    predictedPoints: 450,
    isRookie: false,
    previousSeasonPoints: 437,
    previousSeasonPosition: 1,
  },
  {
    id: 'LAW',
    name: 'Liam Lawson',
    team: 'Red Bull Racing',
    teamColor: TEAM_COLORS['Red Bull Racing'],
    fantasyValue: 15.2,
    predictedPoints: 180,
    isRookie: false, // Debuted in 2025
    previousSeasonPoints: 24,
    previousSeasonPosition: 15,
  },

  // Ferrari
  {
    id: 'HAM',
    name: 'Lewis Hamilton',
    team: 'Ferrari',
    teamColor: TEAM_COLORS['Ferrari'],
    fantasyValue: 28.0,
    predictedPoints: 340,
    isRookie: false,
    previousSeasonPoints: 223,
    previousSeasonPosition: 3,
  },
  {
    id: 'LEC',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    teamColor: TEAM_COLORS['Ferrari'],
    fantasyValue: 26.5,
    predictedPoints: 360,
    isRookie: false,
    previousSeasonPoints: 319,
    previousSeasonPosition: 2,
  },

  // Mercedes
  {
    id: 'RUS',
    name: 'George Russell',
    team: 'Mercedes',
    teamColor: TEAM_COLORS['Mercedes'],
    fantasyValue: 24.0,
    predictedPoints: 290,
    isRookie: false,
    previousSeasonPoints: 245,
    previousSeasonPosition: 4,
  },
  {
    id: 'ANT',
    name: 'Andrea Kimi Antonelli',
    team: 'Mercedes',
    teamColor: TEAM_COLORS['Mercedes'],
    fantasyValue: 12.5,
    predictedPoints: 85,
    isRookie: true,
    f2ChampionshipPosition: 6,
    f2Wins: 2,
  },

  // McLaren
  {
    id: 'NOR',
    name: 'Lando Norris',
    team: 'McLaren',
    teamColor: TEAM_COLORS['McLaren'],
    fantasyValue: 27.5,
    predictedPoints: 380,
    isRookie: false,
    previousSeasonPoints: 374,
    previousSeasonPosition: 2,
  },
  {
    id: 'PIA',
    name: 'Oscar Piastri',
    team: 'McLaren',
    teamColor: TEAM_COLORS['McLaren'],
    fantasyValue: 22.0,
    predictedPoints: 260,
    isRookie: false,
    previousSeasonPoints: 292,
    previousSeasonPosition: 4,
  },

  // Aston Martin
  {
    id: 'ALO',
    name: 'Fernando Alonso',
    team: 'Aston Martin',
    teamColor: TEAM_COLORS['Aston Martin'],
    fantasyValue: 20.0,
    predictedPoints: 180,
    isRookie: false,
    previousSeasonPoints: 70,
    previousSeasonPosition: 9,
  },
  {
    id: 'STR',
    name: 'Lance Stroll',
    team: 'Aston Martin',
    teamColor: TEAM_COLORS['Aston Martin'],
    fantasyValue: 14.5,
    predictedPoints: 90,
    isRookie: false,
    previousSeasonPoints: 74,
    previousSeasonPosition: 10,
  },

  // Alpine
  {
    id: 'GAS',
    name: 'Pierre Gasly',
    team: 'Alpine',
    teamColor: TEAM_COLORS['Alpine'],
    fantasyValue: 16.5,
    predictedPoints: 110,
    isRookie: false,
    previousSeasonPoints: 16,
    previousSeasonPosition: 16,
  },
  {
    id: 'DOO',
    name: 'Jack Doohan',
    team: 'Alpine',
    teamColor: TEAM_COLORS['Alpine'],
    fantasyValue: 11.0,
    predictedPoints: 45,
    isRookie: false, // Debuted in 2025
    previousSeasonPoints: 8,
    previousSeasonPosition: 18,
  },

  // Williams
  {
    id: 'ALB',
    name: 'Alex Albon',
    team: 'Williams',
    teamColor: TEAM_COLORS['Williams'],
    fantasyValue: 15.0,
    predictedPoints: 95,
    isRookie: false,
    previousSeasonPoints: 16,
    previousSeasonPosition: 17,
  },
  {
    id: 'SAI',
    name: 'Carlos Sainz',
    team: 'Williams',
    teamColor: TEAM_COLORS['Williams'],
    fantasyValue: 21.0,
    predictedPoints: 140,
    isRookie: false,
    previousSeasonPoints: 244,
    previousSeasonPosition: 5,
  },

  // RB (formerly AlphaTauri)
  {
    id: 'TSU',
    name: 'Yuki Tsunoda',
    team: 'RB',
    teamColor: TEAM_COLORS['RB'],
    fantasyValue: 13.5,
    predictedPoints: 70,
    isRookie: false,
    previousSeasonPoints: 30,
    previousSeasonPosition: 12,
  },
  {
    id: 'HAD',
    name: 'Isack Hadjar',
    team: 'RB',
    teamColor: TEAM_COLORS['RB'],
    fantasyValue: 10.5,
    predictedPoints: 40,
    isRookie: true,
    f2ChampionshipPosition: 2,
    f2Wins: 3,
  },

  // Kick Sauber (future Audi)
  {
    id: 'HUL',
    name: 'Nico Hulkenberg',
    team: 'Kick Sauber',
    teamColor: TEAM_COLORS['Kick Sauber'],
    fantasyValue: 12.0,
    predictedPoints: 50,
    isRookie: false,
    previousSeasonPoints: 41,
    previousSeasonPosition: 11,
  },
  {
    id: 'BOR',
    name: 'Gabriel Bortoleto',
    team: 'Kick Sauber',
    teamColor: TEAM_COLORS['Kick Sauber'],
    fantasyValue: 9.5,
    predictedPoints: 25,
    isRookie: true,
    f2ChampionshipPosition: 1, // 2024 F2 Champion
    f2Wins: 5,
  },

  // Haas
  {
    id: 'BEA',
    name: 'Oliver Bearman',
    team: 'Haas',
    teamColor: TEAM_COLORS['Haas'],
    fantasyValue: 10.0,
    predictedPoints: 35,
    isRookie: true,
    f2ChampionshipPosition: 3,
    f2Wins: 3,
  },
  {
    id: 'OCO',
    name: 'Esteban Ocon',
    team: 'Haas',
    teamColor: TEAM_COLORS['Haas'],
    fantasyValue: 14.0,
    predictedPoints: 75,
    isRookie: false,
    previousSeasonPoints: 23,
    previousSeasonPosition: 14,
  },
]

// 2026 F1 Constructors
export const CONSTRUCTORS: Constructor[] = [
  {
    id: 'RBR',
    name: 'Red Bull Racing',
    color: TEAM_COLORS['Red Bull Racing'],
    fantasyValue: 35.0,
    predictedPoints: 630,
  },
  {
    id: 'FER',
    name: 'Ferrari',
    color: TEAM_COLORS['Ferrari'],
    fantasyValue: 32.0,
    predictedPoints: 700,
  },
  {
    id: 'MER',
    name: 'Mercedes',
    color: TEAM_COLORS['Mercedes'],
    fantasyValue: 28.0,
    predictedPoints: 375,
  },
  {
    id: 'MCL',
    name: 'McLaren',
    color: TEAM_COLORS['McLaren'],
    fantasyValue: 34.0,
    predictedPoints: 640,
  },
  {
    id: 'AST',
    name: 'Aston Martin',
    color: TEAM_COLORS['Aston Martin'],
    fantasyValue: 22.0,
    predictedPoints: 270,
  },
  {
    id: 'ALP',
    name: 'Alpine',
    color: TEAM_COLORS['Alpine'],
    fantasyValue: 18.0,
    predictedPoints: 155,
  },
  {
    id: 'WIL',
    name: 'Williams',
    color: TEAM_COLORS['Williams'],
    fantasyValue: 20.0,
    predictedPoints: 235,
  },
  {
    id: 'RB',
    name: 'RB',
    color: TEAM_COLORS['RB'],
    fantasyValue: 16.0,
    predictedPoints: 110,
  },
  {
    id: 'KIC',
    name: 'Kick Sauber',
    color: TEAM_COLORS['Kick Sauber'],
    fantasyValue: 14.0,
    predictedPoints: 75,
  },
  {
    id: 'HAA',
    name: 'Haas',
    color: TEAM_COLORS['Haas'],
    fantasyValue: 15.0,
    predictedPoints: 110,
  },
]

// 2026 Race Calendar (Confirmed + Predictions)
export const RACE_CALENDAR: RaceCalendar[] = [
  {
    id: 'AUS',
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    date: '2026-03-15',
    round: 1,
  },
  {
    id: 'CHN',
    name: 'Chinese Grand Prix',
    circuit: 'Shanghai International Circuit',
    country: 'China',
    date: '2026-03-22',
    round: 2,
  },
  {
    id: 'JPN',
    name: 'Japanese Grand Prix',
    circuit: 'Suzuka Circuit',
    country: 'Japan',
    date: '2026-04-05',
    round: 3,
  },
  {
    id: 'BHR',
    name: 'Bahrain Grand Prix',
    circuit: 'Bahrain International Circuit',
    country: 'Bahrain',
    date: '2026-04-19',
    round: 4,
  },
  {
    id: 'SAU',
    name: 'Saudi Arabian Grand Prix',
    circuit: 'Jeddah Corniche Circuit',
    country: 'Saudi Arabia',
    date: '2026-04-26',
    round: 5,
  },
  {
    id: 'MIA',
    name: 'Miami Grand Prix',
    circuit: 'Miami International Autodrome',
    country: 'United States',
    date: '2026-05-03',
    round: 6,
  },
  {
    id: 'ITA',
    name: 'Emilia Romagna Grand Prix',
    circuit: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    date: '2026-05-17',
    round: 7,
  },
  {
    id: 'MON',
    name: 'Monaco Grand Prix',
    circuit: 'Circuit de Monaco',
    country: 'Monaco',
    date: '2026-05-24',
    round: 8,
  },
  {
    id: 'ESP',
    name: 'Spanish Grand Prix',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    date: '2026-06-07',
    round: 9,
  },
  {
    id: 'CAN',
    name: 'Canadian Grand Prix',
    circuit: 'Circuit Gilles Villeneuve',
    country: 'Canada',
    date: '2026-06-14',
    round: 10,
  },
  {
    id: 'AUT',
    name: 'Austrian Grand Prix',
    circuit: 'Red Bull Ring',
    country: 'Austria',
    date: '2026-06-28',
    round: 11,
  },
  {
    id: 'GBR',
    name: 'British Grand Prix',
    circuit: 'Silverstone Circuit',
    country: 'Great Britain',
    date: '2026-07-05',
    round: 12,
  },
  {
    id: 'HUN',
    name: 'Hungarian Grand Prix',
    circuit: 'Hungaroring',
    country: 'Hungary',
    date: '2026-07-19',
    round: 13,
  },
  {
    id: 'BEL',
    name: 'Belgian Grand Prix',
    circuit: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    date: '2026-07-26',
    round: 14,
  },
  {
    id: 'NED',
    name: 'Dutch Grand Prix',
    circuit: 'Circuit Zandvoort',
    country: 'Netherlands',
    date: '2026-08-30',
    round: 15,
  },
  {
    id: 'ITA2',
    name: 'Italian Grand Prix',
    circuit: 'Autodromo Nazionale di Monza',
    country: 'Italy',
    date: '2026-09-06',
    round: 16,
  },
  {
    id: 'AZE',
    name: 'Azerbaijan Grand Prix',
    circuit: 'Baku City Circuit',
    country: 'Azerbaijan',
    date: '2026-09-20',
    round: 17,
  },
  {
    id: 'SIN',
    name: 'Singapore Grand Prix',
    circuit: 'Marina Bay Street Circuit',
    country: 'Singapore',
    date: '2026-09-27',
    round: 18,
  },
  {
    id: 'USA',
    name: 'United States Grand Prix',
    circuit: 'Circuit of the Americas',
    country: 'United States',
    date: '2026-10-18',
    round: 19,
  },
  {
    id: 'MEX',
    name: 'Mexico City Grand Prix',
    circuit: 'Autódromo Hermanos Rodríguez',
    country: 'Mexico',
    date: '2026-10-25',
    round: 20,
  },
  {
    id: 'BRA',
    name: 'São Paulo Grand Prix',
    circuit: 'Autódromo José Carlos Pace',
    country: 'Brazil',
    date: '2026-11-01',
    round: 21,
  },
  {
    id: 'LVG',
    name: 'Las Vegas Grand Prix',
    circuit: 'Las Vegas Street Circuit',
    country: 'United States',
    date: '2026-11-21',
    round: 22,
  },
  {
    id: 'QAT',
    name: 'Qatar Grand Prix',
    circuit: 'Lusail International Circuit',
    country: 'Qatar',
    date: '2026-11-29',
    round: 23,
  },
  {
    id: 'ABU',
    name: 'Abu Dhabi Grand Prix',
    circuit: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    date: '2026-12-06',
    round: 24,
  },
]

// Helper functions
export function getDriverById(id: string): Driver | undefined {
  return DRIVERS.find(d => d.id === id)
}

export function getDriverByName(name: string): Driver | undefined {
  return DRIVERS.find(d => d.name === name)
}

export function getDriversByTeam(team: string): Driver[] {
  return DRIVERS.filter(d => d.team === team)
}

export function getConstructorById(id: string): Constructor | undefined {
  return CONSTRUCTORS.find(c => c.id === id)
}

export function getConstructorByName(name: string): Constructor | undefined {
  return CONSTRUCTORS.find(c => c.name === name)
}

export function getNextRace(): RaceCalendar | undefined {
  const now = new Date()
  return RACE_CALENDAR.find(race => new Date(race.date) > now)
}

export function getRookieDrivers(): Driver[] {
  return DRIVERS.filter(d => d.isRookie)
}

export function getDriversUnderBudget(maxBudget: number): Driver[] {
  return DRIVERS.filter(d => d.fantasyValue <= maxBudget).sort((a, b) => b.predictedPoints - a.predictedPoints)
}

export function calculateDaysUntilRace(raceId: string): { days: number; hours: number; minutes: number } {
  const race = RACE_CALENDAR.find(r => r.id === raceId)
  if (!race) return { days: 0, hours: 0, minutes: 0 }

  const now = new Date()
  const raceDate = new Date(race.date)
  const diff = raceDate.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}
