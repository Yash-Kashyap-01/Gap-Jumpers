import type { GameState, Scenario, Persona, Constraint, RoundResult, PlankType } from '../types/game';
import { SCENARIOS, CHAOS_PERSONAS, HONEST_PERSONA, CONSTRAINTS } from '../data/content';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PROCEED_TO_SECRET_CARD' }
  | { type: 'NEXT_ROUND' }
  | { type: 'REVEAL_SCENARIO_HELD' }
  | { type: 'REROLL_SCENARIO' }
  | { type: 'PROCEED_TO_DRAW' }
  | { type: 'SUBMIT_DOODLE'; doodleDataUrl: string }
  | { type: 'PROCEED_TO_INTERPRETING' }
  | { type: 'SET_RELAY_RESULT'; relayText: string; isAi: boolean }
  | { type: 'SET_GUESS_TEXT'; guessText: string }
  | { type: 'SUBMIT_GUESS_START' }
  | { type: 'SET_SCORE_RESULT'; score: number; comment: string; isAi: boolean }
  | { type: 'PROCEED_FROM_RESULT' }
  | { type: 'RESTART_GAME' }
  | { type: 'GO_HOME' }
  | { type: 'TOGGLE_HONEST_MODE' }
  | { type: 'TOGGLE_DEMO_MODE' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_API_KEY'; apiKey: string }
  | { type: 'SET_ANALYZING'; isAnalyzing: boolean }
  | { type: 'SET_ERROR'; message: string | null };

function getStoredString(key: string, fallback = ''): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function getStoredBool(key: string, fallback = false): boolean {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : fallback;
  } catch {
    return fallback;
  }
}

function pickRandomScenario(usedIds: number[]): Scenario {
  let available = SCENARIOS.filter(s => !usedIds.includes(s.id));
  if (available.length === 0) {
    available = SCENARIOS;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function pickRandomPersona(lastPersonaId: string | null, honestMode: boolean): Persona {
  if (honestMode) {
    return HONEST_PERSONA;
  }
  const pool = CHAOS_PERSONAS.filter(p => p.id !== lastPersonaId);
  return pool[Math.floor(Math.random() * pool.length)] || CHAOS_PERSONAS[0];
}

function pickRandomConstraint(): Constraint {
  return CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
}

const envApiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';
const storedApiKey = getStoredString('gap_jumpers_gemini_key', envApiKey);

export const initialGameState: GameState = {
  screen: 'HOME',
  roundNumber: 1,
  planks: [],
  lives: 2,
  honestMode: getStoredBool('gap_jumpers_honest', false),
  demoMode: getStoredBool('gap_jumpers_demo_mode', !storedApiKey),
  muted: getStoredBool('gap_jumpers_muted', false),
  apiKey: storedApiKey,
  
  currentScenario: null,
  scenarioRerolled: false,
  revealedAtLeastOnce: false,
  currentPersona: null,
  lastPersonaId: null,
  currentConstraint: null,
  
  doodleDataUrl: '',
  relayText: '',
  isRelayAiGenerated: false,
  guessText: '',
  latestResult: null,
  history: [],
  
  gameOutcome: null,
  isAnalyzing: false,
  errorMessage: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const scenario = pickRandomScenario([]);
      const persona = pickRandomPersona(null, state.honestMode);
      const constraint = pickRandomConstraint();

      return {
        ...state,
        screen: 'COVER_A',
        roundNumber: 1,
        planks: [],
        lives: 2,
        history: [],
        gameOutcome: null,
        currentScenario: scenario,
        scenarioRerolled: false,
        revealedAtLeastOnce: false,
        currentPersona: persona,
        lastPersonaId: persona.id,
        currentConstraint: constraint,
        doodleDataUrl: '',
        relayText: '',
        isRelayAiGenerated: false,
        guessText: '',
        latestResult: null,
        isAnalyzing: false,
        errorMessage: null,
      };
    }

    case 'PROCEED_TO_SECRET_CARD': {
      return {
        ...state,
        screen: 'SECRET_CARD',
      };
    }

    case 'NEXT_ROUND': {
      const usedScenarioIds = state.history.map(h => h.scenario.id);
      const scenario = pickRandomScenario(usedScenarioIds);
      const persona = pickRandomPersona(state.lastPersonaId, state.honestMode);
      const constraint = pickRandomConstraint();

      return {
        ...state,
        screen: 'COVER_A',
        roundNumber: state.roundNumber + 1,
        currentScenario: scenario,
        scenarioRerolled: false,
        revealedAtLeastOnce: false,
        currentPersona: persona,
        lastPersonaId: persona.id,
        currentConstraint: constraint,
        doodleDataUrl: '',
        relayText: '',
        isRelayAiGenerated: false,
        guessText: '',
        latestResult: null,
        isAnalyzing: false,
        errorMessage: null,
      };
    }

    case 'REVEAL_SCENARIO_HELD': {
      return {
        ...state,
        revealedAtLeastOnce: true,
      };
    }

    case 'REROLL_SCENARIO': {
      if (state.scenarioRerolled || !state.currentScenario) return state;
      const usedScenarioIds = [
        ...state.history.map(h => h.scenario.id),
        state.currentScenario.id,
      ];
      const newScenario = pickRandomScenario(usedScenarioIds);
      return {
        ...state,
        currentScenario: newScenario,
        scenarioRerolled: true,
        revealedAtLeastOnce: false,
      };
    }

    case 'PROCEED_TO_DRAW': {
      return {
        ...state,
        screen: 'DRAW',
      };
    }

    case 'SUBMIT_DOODLE': {
      return {
        ...state,
        doodleDataUrl: action.doodleDataUrl,
        screen: 'COVER_B',
      };
    }

    case 'PROCEED_TO_INTERPRETING': {
      return {
        ...state,
        screen: 'INTERPRETING',
        isAnalyzing: true,
      };
    }

    case 'SET_RELAY_RESULT': {
      return {
        ...state,
        relayText: action.relayText,
        isRelayAiGenerated: action.isAi,
        isAnalyzing: false,
        screen: 'RELAY_GUESS',
      };
    }

    case 'SET_GUESS_TEXT': {
      return {
        ...state,
        guessText: action.guessText.slice(0, 200),
      };
    }

    case 'SUBMIT_GUESS_START': {
      return {
        ...state,
        isAnalyzing: true,
        screen: 'INTERPRETING',
      };
    }

    case 'SET_SCORE_RESULT': {
      const score = Math.max(0, Math.min(100, action.score));
      let plankType: PlankType | undefined = undefined;
      let newPlanks = [...state.planks];
      let newLives = state.lives;
      let collapsed = false;

      if (score >= 70) {
        plankType = 'solid';
        if (newPlanks.length < 3) newPlanks.push('solid');
      } else if (score >= 30) {
        plankType = 'wobbly';
        if (newPlanks.length < 3) newPlanks.push('wobbly');
      } else {
        // Collapse: remove last plank if any and use 1 life
        collapsed = true;
        if (newPlanks.length > 0) {
          newPlanks.pop();
        }
        newLives = Math.max(0, newLives - 1);
      }

      let outcome: 'WIN' | 'LOSE' | null = null;
      if (newPlanks.length >= 3) {
        outcome = 'WIN';
      } else if (newLives <= 0) {
        outcome = 'LOSE';
      }

      const result: RoundResult = {
        roundNumber: state.roundNumber,
        scenario: state.currentScenario!,
        persona: state.currentPersona!,
        constraint: state.currentConstraint!,
        doodleDataUrl: state.doodleDataUrl,
        relayText: state.relayText,
        guessText: state.guessText,
        score,
        comment: action.comment,
        plankType,
        collapsed,
        isAiGenerated: action.isAi,
      };

      return {
        ...state,
        planks: newPlanks,
        lives: newLives,
        gameOutcome: outcome,
        latestResult: result,
        history: [...state.history, result],
        isAnalyzing: false,
        screen: 'RESULT',
      };
    }

    case 'PROCEED_FROM_RESULT': {
      if (state.gameOutcome) {
        return {
          ...state,
          screen: 'END',
        };
      }
      return gameReducer(state, { type: 'NEXT_ROUND' });
    }

    case 'RESTART_GAME': {
      return gameReducer(state, { type: 'START_GAME' });
    }

    case 'GO_HOME': {
      return {
        ...state,
        screen: 'HOME',
        gameOutcome: null,
        history: [],
        planks: [],
        lives: 2,
        roundNumber: 1,
        latestResult: null,
      };
    }

    case 'TOGGLE_HONEST_MODE': {
      const nextHonest = !state.honestMode;
      try {
        localStorage.setItem('gap_jumpers_honest', String(nextHonest));
      } catch {}
      
      const newPersona = nextHonest
        ? HONEST_PERSONA
        : (state.lastPersonaId && state.lastPersonaId !== 'honest'
            ? CHAOS_PERSONAS.find(p => p.id === state.lastPersonaId) || CHAOS_PERSONAS[0]
            : pickRandomPersona(null, false));

      return {
        ...state,
        honestMode: nextHonest,
        currentPersona: state.currentPersona ? newPersona : null,
      };
    }

    case 'TOGGLE_DEMO_MODE': {
      const nextDemo = !state.demoMode;
      try {
        localStorage.setItem('gap_jumpers_demo_mode', String(nextDemo));
      } catch {}
      return {
        ...state,
        demoMode: nextDemo,
      };
    }

    case 'TOGGLE_MUTE': {
      const nextMuted = !state.muted;
      try {
        localStorage.setItem('gap_jumpers_muted', String(nextMuted));
      } catch {}
      return {
        ...state,
        muted: nextMuted,
      };
    }

    case 'SET_API_KEY': {
      const hasKey = Boolean(action.apiKey && action.apiKey.trim());
      try {
        localStorage.setItem('gap_jumpers_gemini_key', action.apiKey);
        localStorage.setItem('gap_jumpers_demo_mode', String(!hasKey));
      } catch {}
      return {
        ...state,
        apiKey: action.apiKey,
        demoMode: !hasKey,
      };
    }

    case 'SET_ANALYZING': {
      return {
        ...state,
        isAnalyzing: action.isAnalyzing,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        errorMessage: action.message,
      };
    }

    default:
      return state;
  }
}
