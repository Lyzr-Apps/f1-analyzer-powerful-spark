'use client'

import { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import {
  DRIVERS,
  CONSTRUCTORS,
  getDriverByName,
  getConstructorByName,
  getNextRace,
  calculateDaysUntilRace,
  type Driver,
  type Constructor
} from '@/lib/f1Data'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Trophy,
  DollarSign,
  AlertCircle,
  Info,
  X,
  ChevronRight,
  Flag,
  Users,
  Zap,
  Target,
  Check,
  ChevronsUpDown
} from 'lucide-react'

// Agent IDs
const AGENTS = {
  FANTASY_COORDINATOR: '69858700c613a65b3c4193f1',
  STATS_ANALYSIS: '698586cf36d36472c112ac1b',
  NEWS_INTELLIGENCE: '698586deb90162af337b1e83',
  VALUE_TRACKING: '698586ec094c8b2d4207dcab',
  AI_NARRATIVE: '69858718f5dba64760ed7f27',
}

// TypeScript Interfaces from Test Responses
interface RecommendedTeam {
  drivers: string[]
  constructor: string
  total_cost: number
  projected_points: number
}

interface AlternativeTeam {
  drivers: string[]
  constructor: string
  total_cost: number
  projected_points: number
}

interface FantasyRecommendation {
  recommended_team: RecommendedTeam
  alternatives: AlternativeTeam[]
  confidence_score: number
  risk_level: 'Low' | 'Medium' | 'High'
}

interface NarrativeResponse {
  narrative: string
  performance_story: string
  risk_narrative: string
  value_story: string
  key_insights: string[]
}

interface Constraints {
  budget: number
  lockedDrivers: string[]
  lockedConstructor: string
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive'
}

type ViewMode = 'quick' | 'detailed' | 'comparison'

// Driver Card Component
function DriverCard({
  name,
  isRecommended = false,
  confidence = 0,
  riskLevel = 'Medium',
  onExplain,
  showDetails = false
}: {
  name: string
  isRecommended?: boolean
  confidence?: number
  riskLevel?: 'Low' | 'Medium' | 'High'
  onExplain?: () => void
  showDetails?: boolean
}) {
  const driver = getDriverByName(name)
  const team = driver?.team || 'Unknown'
  const teamColor = driver?.teamColor || '#dc0000'
  const fantasyValue = driver?.fantasyValue || 0
  const isRookie = driver?.isRookie || false

  const riskColors = {
    'Low': 'bg-green-500/20 text-green-400 border-green-500/50',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'High': 'bg-red-500/20 text-red-400 border-red-500/50',
  }

  return (
    <Card
      className="relative overflow-hidden transition-all hover:shadow-lg hover:shadow-red-500/20"
      style={{ borderLeft: `4px solid ${teamColor}` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-50"
        style={{ backgroundColor: teamColor }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
              {isRookie && (
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
                  Rookie
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{team}</p>
          </div>
          {isRecommended && (
            <Badge className="bg-[#e10600] text-white border-0">
              <Trophy className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isRecommended && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Confidence</span>
              <span className="text-sm font-bold text-white">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2" />

            <div className="flex items-center justify-between gap-2 pt-2">
              <Badge variant="outline" className={riskColors[riskLevel]}>
                {riskLevel} Risk
              </Badge>
              {onExplain && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExplain}
                  className="text-[#00d2be] hover:text-[#00d2be]/80 hover:bg-[#00d2be]/10"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Explain
                </Button>
              )}
            </div>
          </>
        )}

        {showDetails && driver && (
          <div className="pt-2 space-y-2 border-t border-gray-700">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Value</span>
              <span className="text-white font-mono">${fantasyValue}M</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Predicted Points</span>
              <span className="text-[#00d2be] font-bold">{driver.predictedPoints}</span>
            </div>
            {driver.isRookie && driver.f2ChampionshipPosition && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">F2 Position</span>
                <span className="text-yellow-400">P{driver.f2ChampionshipPosition}</span>
              </div>
            )}
            {!driver.isRookie && driver.previousSeasonPoints && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">2025 Points</span>
                <span className="text-gray-300">{driver.previousSeasonPoints}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Constructor Card Component
function ConstructorCard({
  name,
  isRecommended = false,
  confidence = 0
}: {
  name: string
  isRecommended?: boolean
  confidence?: number
}) {
  const constructor = getConstructorByName(name)
  const teamColor = constructor?.color || '#dc0000'
  const fantasyValue = constructor?.fantasyValue || 0

  return (
    <Card
      className="relative overflow-hidden transition-all hover:shadow-lg hover:shadow-red-500/20"
      style={{ borderLeft: `4px solid ${teamColor}` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-50"
        style={{ backgroundColor: teamColor }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
            <p className="text-xs text-gray-400 mt-1">Constructor</p>
          </div>
          {isRecommended && (
            <Badge className="bg-[#e10600] text-white border-0">
              <Trophy className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isRecommended && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Confidence</span>
              <span className="text-sm font-bold text-white">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2" />
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Race Countdown Widget
function RaceCountdown() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })
  const nextRace = getNextRace()

  useEffect(() => {
    if (!nextRace) return

    const updateCountdown = () => {
      setCountdown(calculateDaysUntilRace(nextRace.id))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [nextRace])

  if (!nextRace) {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardContent className="pt-6 text-center text-gray-400">
          No upcoming races
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Flag className="w-5 h-5 text-[#e10600]" />
          Next Race
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{nextRace.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{nextRace.circuit}</p>
          <p className="text-gray-500 text-xs mt-0.5">{nextRace.country}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e10600]">{countdown.days}</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e10600]">{countdown.hours}</div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e10600]">{countdown.minutes}</div>
            <div className="text-xs text-gray-400">Minutes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Constraint Panel Component
function ConstraintPanel({
  constraints,
  onChange
}: {
  constraints: Constraints
  onChange: (constraints: Constraints) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#e10600]" />
            Constraints
          </span>
          <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Budget Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">Budget</Label>
              <span className="text-sm font-mono text-[#00d2be]">${constraints.budget}M</span>
            </div>
            <Slider
              value={[constraints.budget]}
              onValueChange={([value]) => onChange({ ...constraints, budget: value })}
              min={50}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <Separator className="bg-gray-700" />

          {/* Risk Tolerance */}
          <div className="space-y-3">
            <Label className="text-white">Risk Tolerance</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Balanced', 'Aggressive'] as const).map((risk) => (
                <Button
                  key={risk}
                  variant={constraints.riskTolerance === risk ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange({ ...constraints, riskTolerance: risk })}
                  className={
                    constraints.riskTolerance === risk
                      ? 'bg-[#e10600] hover:bg-[#e10600]/90 text-white'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                >
                  {risk}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Locked Drivers Multi-Select */}
          <div className="space-y-3">
            <Label className="text-white">Lock Drivers</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  {constraints.lockedDrivers.length > 0
                    ? `${constraints.lockedDrivers.length} selected`
                    : "Select drivers..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700" align="start">
                <Command className="bg-gray-800">
                  <CommandInput placeholder="Search drivers..." className="text-white" />
                  <CommandEmpty>No driver found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {DRIVERS.map((driver) => {
                      const isSelected = constraints.lockedDrivers.includes(driver.name)
                      return (
                        <CommandItem
                          key={driver.id}
                          value={driver.name}
                          onSelect={() => {
                            const newLocked = isSelected
                              ? constraints.lockedDrivers.filter((d) => d !== driver.name)
                              : [...constraints.lockedDrivers, driver.name]
                            onChange({ ...constraints, lockedDrivers: newLocked })
                          }}
                          className="text-white hover:bg-gray-700"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className="w-1 h-6 rounded"
                              style={{ backgroundColor: driver.teamColor }}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-xs text-gray-400">{driver.team}</div>
                            </div>
                            <div className="text-xs text-gray-400">${driver.fantasyValue}M</div>
                          </div>
                          <Check
                            className={`ml-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                          />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {constraints.lockedDrivers.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {constraints.lockedDrivers.map((driverName) => {
                  const driver = getDriverByName(driverName)
                  return (
                    <Badge
                      key={driverName}
                      variant="outline"
                      className="border-gray-600 text-white"
                      style={{ borderColor: driver?.teamColor }}
                    >
                      {driverName}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() =>
                          onChange({
                            ...constraints,
                            lockedDrivers: constraints.lockedDrivers.filter((d) => d !== driverName),
                          })
                        }
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          <Separator className="bg-gray-700" />

          {/* Locked Constructor Select */}
          <div className="space-y-3">
            <Label className="text-white">Lock Constructor</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  {constraints.lockedConstructor || "Select constructor..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700" align="start">
                <Command className="bg-gray-800">
                  <CommandInput placeholder="Search constructors..." className="text-white" />
                  <CommandEmpty>No constructor found.</CommandEmpty>
                  <CommandGroup>
                    {CONSTRUCTORS.map((constructor) => (
                      <CommandItem
                        key={constructor.id}
                        value={constructor.name}
                        onSelect={(value) => {
                          onChange({
                            ...constraints,
                            lockedConstructor: value === constraints.lockedConstructor ? '' : value,
                          })
                        }}
                        className="text-white hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-1 h-6 rounded"
                            style={{ backgroundColor: constructor.color }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{constructor.name}</div>
                          </div>
                          <div className="text-xs text-gray-400">${constructor.fantasyValue}M</div>
                        </div>
                        <Check
                          className={`ml-2 h-4 w-4 ${
                            constraints.lockedConstructor === constructor.name
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {constraints.lockedConstructor && (
              <Badge
                variant="outline"
                className="border-gray-600 text-white mt-2"
                style={{ borderColor: getConstructorByName(constraints.lockedConstructor)?.color }}
              >
                {constraints.lockedConstructor}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => onChange({ ...constraints, lockedConstructor: '' })}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Narrative Panel Component
function NarrativePanel({
  isOpen,
  onClose,
  driverName,
  narrative
}: {
  isOpen: boolean
  onClose: () => void
  driverName: string
  narrative: NarrativeResponse | null
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[40%] bg-gray-900 border-l border-gray-700 shadow-2xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{driverName}</h2>
          <p className="text-sm text-gray-400 mt-1">AI Analysis</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {narrative ? (
          <>
            {/* Main Narrative */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#00d2be] flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed">{narrative.narrative}</p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Performance Story */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#00d2be] flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Performance Analysis
              </h3>
              <p className="text-gray-300 leading-relaxed">{narrative.performance_story}</p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Risk Narrative */}
            <div className="space-y-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Risk Disclosure
              </h3>
              <p className="text-gray-300 leading-relaxed">{narrative.risk_narrative}</p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Value Story */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#00d2be] flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Value Assessment
              </h3>
              <p className="text-gray-300 leading-relaxed">{narrative.value_story}</p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Key Insights */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Key Insights</h3>
              <ul className="space-y-2">
                {narrative.key_insights.map((insight, index) => (
                  <li key={index} className="flex gap-2 text-gray-300">
                    <ChevronRight className="w-5 h-5 text-[#e10600] flex-shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#e10600]" />
          </div>
        )}
      </div>
    </div>
  )
}

// Team Comparison Component
function TeamComparison({
  currentTeam,
  recommendedTeam
}: {
  currentTeam: RecommendedTeam | null
  recommendedTeam: RecommendedTeam
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Team */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            Current Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentTeam ? (
            <>
              <div className="grid gap-2">
                {currentTeam.drivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-white text-sm">{driver}</span>
                  </div>
                ))}
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <span className="text-white text-sm font-bold">{currentTeam.constructor}</span>
                <Badge variant="outline" className="border-gray-600 text-gray-400">Constructor</Badge>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Cost</span>
                <span className="text-white font-mono">${currentTeam.total_cost}M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Projected Points</span>
                <span className="text-white font-bold">{currentTeam.projected_points}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No current team set</p>
          )}
        </CardContent>
      </Card>

      {/* Recommended Team */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[#00d2be]/50 shadow-lg shadow-[#00d2be]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00d2be]" />
            Recommended Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {recommendedTeam.drivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#00d2be]/10 rounded border border-[#00d2be]/30">
                <span className="text-white text-sm">{driver}</span>
                {currentTeam && !currentTeam.drivers.includes(driver) && (
                  <Badge className="bg-[#00d2be] text-gray-900 text-xs">NEW</Badge>
                )}
              </div>
            ))}
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex items-center justify-between p-2 bg-[#00d2be]/10 rounded border border-[#00d2be]/30">
            <span className="text-white text-sm font-bold">{recommendedTeam.constructor}</span>
            <Badge variant="outline" className="border-[#00d2be] text-[#00d2be]">Constructor</Badge>
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Cost</span>
            <span className="text-[#00d2be] font-mono font-bold">${recommendedTeam.total_cost}M</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Projected Points</span>
            <span className="text-[#00d2be] font-bold">{recommendedTeam.projected_points}</span>
          </div>
          {currentTeam && (
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Point Difference</span>
                <span className={`font-bold flex items-center gap-1 ${
                  recommendedTeam.projected_points > currentTeam.projected_points
                    ? 'text-[#00d2be]'
                    : 'text-red-400'
                }`}>
                  {recommendedTeam.projected_points > currentTeam.projected_points ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {recommendedTeam.projected_points - currentTeam.projected_points > 0 ? '+' : ''}
                  {recommendedTeam.projected_points - currentTeam.projected_points}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Main Page Component
export default function Home() {
  const [constraints, setConstraints] = useState<Constraints>({
    budget: 95,
    lockedDrivers: [],
    lockedConstructor: '',
    riskTolerance: 'Balanced',
  })

  const [viewMode, setViewMode] = useState<ViewMode>('quick')
  const [recommendation, setRecommendation] = useState<FantasyRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [narrativePanel, setNarrativePanel] = useState<{
    isOpen: boolean
    driverName: string
    narrative: NarrativeResponse | null
  }>({
    isOpen: false,
    driverName: '',
    narrative: null,
  })

  const generateRecommendation = async () => {
    setLoading(true)
    setError(null)

    try {
      const nextRace = getNextRace()
      const raceName = nextRace ? nextRace.name : 'upcoming race'

      const message = `Generate optimal F1 fantasy team for ${raceName} with budget ${constraints.budget}M${
        constraints.lockedDrivers.length > 0 ? `, lock ${constraints.lockedDrivers.join(', ')}` : ''
      }${
        constraints.lockedConstructor ? ` and ${constraints.lockedConstructor} constructor` : ''
      }, ${constraints.riskTolerance.toLowerCase()} risk tolerance`

      const result = await callAIAgent(message, AGENTS.FANTASY_COORDINATOR)

      if (result.success && result.response.status === 'success') {
        setRecommendation(result.response.result as FantasyRecommendation)
      } else {
        setError(result.response.message || 'Failed to generate recommendation')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const explainDriver = async (driverName: string) => {
    setNarrativePanel({
      isOpen: true,
      driverName,
      narrative: null,
    })

    try {
      const nextRace = getNextRace()
      const raceName = nextRace ? nextRace.name : 'upcoming race'
      const circuitName = nextRace ? nextRace.circuit : 'the circuit'

      const message = `Explain why ${driverName} is recommended for ${raceName} at ${circuitName} with performance data, news context, and risk factors`
      const result = await callAIAgent(message, AGENTS.AI_NARRATIVE)

      if (result.success && result.response.status === 'success') {
        setNarrativePanel(prev => ({
          ...prev,
          narrative: result.response.result as NarrativeResponse,
        }))
      }
    } catch (err) {
      console.error('Failed to load narrative:', err)
    }
  }

  const nextRace = getNextRace()

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Flag className="w-8 h-8 text-[#e10600]" />
                F1 Fantasy Intelligence 2026
              </h1>
              <p className="text-gray-400 mt-1">AI-Powered Team Recommendations</p>
            </div>
            {nextRace && (
              <Badge className="bg-[#e10600] text-white text-sm px-4 py-2">
                {nextRace.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Constraints */}
          <div className="lg:col-span-3 space-y-6">
            <ConstraintPanel constraints={constraints} onChange={setConstraints} />
            <RaceCountdown />
          </div>

          {/* Center - Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Generate Button & View Mode Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <Button
                onClick={generateRecommendation}
                disabled={loading}
                className="bg-[#e10600] hover:bg-[#e10600]/90 text-white font-bold text-lg py-6 shadow-lg shadow-[#e10600]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Recommendation
                  </>
                )}
              </Button>

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="quick">Quick</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed</TabsTrigger>
                  <TabsTrigger value="comparison">Compare</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-500/10 border-red-500/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {recommendation && (
              <>
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-400 mb-1">Total Value</div>
                      <div className="text-2xl font-bold text-white font-mono">
                        ${recommendation.recommended_team.total_cost}M
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-400 mb-1">Projected Points</div>
                      <div className="text-2xl font-bold text-[#00d2be]">
                        {recommendation.recommended_team.projected_points}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-400 mb-1">Confidence</div>
                      <div className="text-2xl font-bold text-white">
                        {recommendation.confidence_score}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                      <Badge className={`text-sm ${
                        recommendation.risk_level === 'Low' ? 'bg-green-500' :
                        recommendation.risk_level === 'Medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {recommendation.risk_level}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* View Mode Content */}
                {viewMode === 'comparison' ? (
                  <TeamComparison
                    currentTeam={null}
                    recommendedTeam={recommendation.recommended_team}
                  />
                ) : (
                  <>
                    {/* Drivers Grid */}
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-[#e10600]" />
                        Recommended Drivers
                      </h2>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendation.recommended_team.drivers.map((driver, index) => (
                          <DriverCard
                            key={index}
                            name={driver}
                            isRecommended={true}
                            confidence={recommendation.confidence_score}
                            riskLevel={recommendation.risk_level}
                            onExplain={() => explainDriver(driver)}
                            showDetails={viewMode === 'detailed'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Constructor */}
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-[#e10600]" />
                        Recommended Constructor
                      </h2>
                      <div className="max-w-md">
                        <ConstructorCard
                          name={recommendation.recommended_team.constructor}
                          isRecommended={true}
                          confidence={recommendation.confidence_score}
                        />
                      </div>
                    </div>

                    {/* Alternatives */}
                    {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-4">Alternative Teams</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {recommendation.alternatives.map((alt, index) => (
                            <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-white text-lg">
                                  Alternative {index + 1}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-400">Drivers</div>
                                  <div className="text-sm text-white">
                                    {alt.drivers.join(', ')}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-400">Constructor</div>
                                  <div className="text-sm text-white font-bold">{alt.constructor}</div>
                                </div>
                                <Separator className="bg-gray-700" />
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Cost</span>
                                  <span className="text-white font-mono">${alt.total_cost}M</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Points</span>
                                  <span className="text-white font-bold">{alt.projected_points}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Empty State */}
            {!recommendation && !loading && (
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="py-16 text-center">
                  <Flag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Build Your Team?</h3>
                  <p className="text-gray-400 mb-6">
                    Set your constraints and click Generate Recommendation to get started
                  </p>
                  <Button
                    onClick={generateRecommendation}
                    className="bg-[#e10600] hover:bg-[#e10600]/90 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Side Panel */}
      <NarrativePanel
        isOpen={narrativePanel.isOpen}
        onClose={() => setNarrativePanel({ isOpen: false, driverName: '', narrative: null })}
        driverName={narrativePanel.driverName}
        narrative={narrativePanel.narrative}
      />
    </div>
  )
}
