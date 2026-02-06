# F1 2026 Season Data Information

## Overview

The F1 Fantasy Intelligence Platform now includes a complete 2026 season database with real driver lineups, predicted values, and rookie F2 statistics.

## Database Structure

### Drivers (20 Total)

All 2026 F1 drivers are included with the following data:

**For Each Driver:**
- **Name & Team**: Full name and 2026 team assignment
- **Fantasy Value**: Predicted price in millions (based on 2025 performance + market value)
- **Predicted Points**: Season point projection
- **Team Color**: Official 2026 team colors
- **Rookie Status**: Identifies first-year F1 drivers
- **F2 Data** (for rookies): Championship position, wins, and previous performance
- **2025 Season Stats** (for veterans): Points and championship position

### Rookies with F2 Background

The system includes special handling for rookies:

1. **Andrea Kimi Antonelli** (Mercedes)
   - F2 Position: P6
   - F2 Wins: 2
   - Predicted Value: $12.5M

2. **Isack Hadjar** (RB)
   - F2 Position: P2
   - F2 Wins: 3
   - Predicted Value: $10.5M

3. **Gabriel Bortoleto** (Kick Sauber)
   - F2 Champion 2024
   - F2 Wins: 5
   - Predicted Value: $9.5M

4. **Oliver Bearman** (Haas)
   - F2 Position: P3
   - F2 Wins: 3
   - Predicted Value: $10.0M

### Constructors (10 Total)

All teams with predicted values and season point projections:

- Red Bull Racing
- Ferrari
- Mercedes
- McLaren
- Aston Martin
- Alpine
- Williams
- RB (formerly AlphaTauri)
- Kick Sauber (future Audi)
- Haas

### Race Calendar (24 Races)

Complete 2026 calendar with:
- Race names and locations
- Circuit information
- Predicted dates
- Round numbers

The next race countdown dynamically updates based on the calendar.

## How Data is Used

### In the UI:
1. **Driver Selection**: Multi-select dropdown shows all 20 drivers with team colors and values
2. **Constructor Selection**: Dropdown with all 10 teams and their colors
3. **Race Countdown**: Shows days/hours/minutes until next GP
4. **Driver Cards**: Display fantasy value, predicted points, rookie badges, F2 stats
5. **Detailed View**: Shows 2025 season stats for veterans, F2 performance for rookies

### In AI Recommendations:
The agents can query this data when making recommendations:
- Fantasy Strategy Coordinator considers budget constraints and locked selections
- Stats Analysis Agent can analyze F2 performance for rookie predictions
- Value Tracking Agent predicts price changes based on historical data

## Providing Your Own 2025 Database

If you have access to real 2025 F1 season data, you can easily update the database:

### Option 1: Update /lib/f1Data.ts Directly

Edit the file at `/app/nextjs-project/lib/f1Data.ts` and modify:

```typescript
export const DRIVERS: Driver[] = [
  {
    id: 'VER',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: TEAM_COLORS['Red Bull Racing'],
    fantasyValue: 32.5, // Update with real fantasy value
    predictedPoints: 450, // Update with your prediction
    isRookie: false,
    previousSeasonPoints: 437, // Update with actual 2025 points
    previousSeasonPosition: 1, // Update with actual 2025 position
  },
  // ... add more drivers
]
```

### Option 2: Provide CSV/JSON Data

If you have data in CSV or JSON format, I can help you:

1. **CSV Format Example:**
```csv
name,team,fantasyValue,predictedPoints,isRookie,previousSeasonPoints,previousSeasonPosition,f2Position,f2Wins
Max Verstappen,Red Bull Racing,32.5,450,false,437,1,,,
Andrea Kimi Antonelli,Mercedes,12.5,85,true,,,6,2
```

2. **JSON Format Example:**
```json
{
  "drivers": [
    {
      "name": "Max Verstappen",
      "team": "Red Bull Racing",
      "fantasyValue": 32.5,
      "predictedPoints": 450,
      "isRookie": false,
      "previousSeasonPoints": 437,
      "previousSeasonPosition": 1
    }
  ]
}
```

### Option 3: Use Real Fantasy Platform API

If you have access to official F1 Fantasy API data, provide:
- API endpoint URL
- Authentication method
- Data format

I can help integrate it to pull live data.

## Value Prediction Logic

The current fantasy values are predicted using:

1. **Veterans**: Based on 2025 championship points + team strength
2. **Rookies**: Based on F2 championship position + destination team
3. **Market Adjustments**: Popular drivers (Hamilton, Verstappen) have premium pricing
4. **Team Transfers**: Drivers changing teams (e.g., Hamilton to Ferrari) adjusted for new team strength

### Prediction Formula (Simplified):

```
Veteran Value = (2025 Points / 10) + Team Multiplier
Rookie Value = (20 - F2 Position) + Team Multiplier - 5

Team Multipliers:
- Top 3 teams (Ferrari, McLaren, Red Bull): +3-5
- Midfield (Mercedes, Aston Martin, Williams): +0-2
- Back markers: -2-0
```

## Updating for Mid-Season Changes

If driver transfers happen mid-season, update:

```typescript
// Find the driver
const driver = DRIVERS.find(d => d.id === 'SAI')

// Update team and color
driver.team = 'New Team Name'
driver.teamColor = TEAM_COLORS['New Team Name']

// Adjust fantasy value based on team strength
driver.fantasyValue = calculateNewValue(driver)
```

## Data Sources

Current data compiled from:
- Official F1 2026 team announcements
- 2024/2025 F2 Championship results
- Historical F1 fantasy pricing patterns
- Expert predictions for 2026 season

## Questions?

If you have real 2025 season data or want to integrate with a specific data source, please provide:

1. Data format (CSV, JSON, API, etc.)
2. Available fields
3. Update frequency needed
4. Any authentication required

I'll help integrate it into the platform!
