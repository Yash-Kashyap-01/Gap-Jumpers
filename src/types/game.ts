export type Screen =
  | 'HOME'
  | 'COVER_A'
  | 'SECRET_CARD'
  | 'DRAW'
  | 'COVER_B'
  | 'INTERPRETING'
  | 'RELAY_GUESS'
  | 'RESULT'
  | 'END';

export interface Scenario {
  id: number;
  emoji: string;
  text: string;
  keywords: string[];
  clues: [string, string];
}

export interface Persona {
  id: string;
  name: string;
  emoji: string;
  style: string;
  pitch: number;
  rate: number;
  fallbackTemplate: string;
}

export interface Constraint {
  id: string;
  text: string;
}

export type PlankType = 'solid' | 'wobbly';

export interface RoundResult {
  roundNumber: number;
  scenario: Scenario;
  persona: Persona;
  constraint: Constraint;
  doodleDataUrl: string;
  relayText: string;
  guessText: string;
  score: number;
  comment: string;
  plankType?: PlankType;
  collapsed: boolean;
  isAiGenerated: boolean;
}

export interface GameState {
  screen: Screen;
  roundNumber: number;
  planks: PlankType[]; // Array of current planks (max 3 for win)
  lives: number; // Starts at 2
  honestMode: boolean;
  demoMode: boolean; // Force offline fallback even if API key exists
  muted: boolean;
  apiKey: string;
  
  // Current round data
  currentScenario: Scenario | null;
  scenarioRerolled: boolean;
  revealedAtLeastOnce: boolean;
  currentPersona: Persona | null;
  lastPersonaId: string | null;
  currentConstraint: Constraint | null;
  
  // In-flight round state
  doodleDataUrl: string;
  relayText: string;
  isRelayAiGenerated: boolean;
  guessText: string;
  latestResult: RoundResult | null;
  history: RoundResult[];
  
  // Game outcome
  gameOutcome: 'WIN' | 'LOSE' | null;
  
  // UI states
  isAnalyzing: boolean;
  errorMessage: string | null;
}
