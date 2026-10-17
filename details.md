# 🌉 GAP JUMPERS — Complete Technical Details

> **A 2-Player Pass-and-Play Party Game** | Built with React 19, TypeScript, Vite & Tailwind CSS

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Game Concept & Rules](#-game-concept--rules)
3. [Recent Fixes & Enhancements](#-recent-fixes--enhancements)
4. [Tech Stack & Dependencies](#-tech-stack--dependencies)
5. [Project Structure](#-project-structure)
6. [Architecture & Data Flow](#-architecture--data-flow)
7. [Type System](#-type-system)
8. [State Management](#-state-management)
9. [Screen-by-Screen Breakdown](#-screen-by-screen-breakdown)
10. [AI Engine (Gemini Integration)](#-ai-engine-gemini-integration)
11. [Offline / Demo Mode Engine](#-offline--demo-mode-engine)
12. [Audio System](#-audio-system)
13. [Drawing Canvas Implementation](#-drawing-canvas-implementation)
14. [Player B Guessing Timer](#-player-b-guessing-timer)
15. [Bridge Scene & Animations](#-bridge-scene--animations)
16. [UI / Design System](#-ui--design-system)
17. [Content & Data](#-content--data)
18. [Configuration Files](#-configuration-files)
19. [Implementation Status](#-implementation-status)

---

## 🎯 Project Overview

**Gap Jumpers** is a **2-player pass-and-play party game** designed to run on a **single laptop/device**.

### Core Premise
"Every translation loses something. Let's make that a game."

- **Player A** can **ONLY draw** (the Doodler)
- **Player B** can **ONLY type** (the Typist)
- An **AI Interpreter** (with dramatic personas like Bollywood Dubbing Artist, Cricket Commentator, Suspicious Aunt, Shakespeare, etc.) translates Player A's doodle into character-driven commentary for Player B.
- Player B never sees the drawing and must guess the secret scenario under a ridiculous constraint.
- Successful rounds build bridge planks; catastrophic failures collapse planks into a crocodile-infested river.

### Win/Lose Conditions
- 🏆 **WIN**: Successfully place 3 planks (solid or wobbly) across the river → Character crosses to victory.
- 💥 **LOSE**: 2 collapses (score < 30) → All lives lost.

---

## 🎮 Game Concept & Rules

### Round Flow

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  COVER_A    │───▶│ SECRET_CARD  │───▶│    DRAW      │───▶│  COVER_B   │───▶│ INTERPRETING │───▶│ RELAY_GUESS  │───▶│   RESULT    │
│ Pass to A   │    │ Reveal hint  │    │ 30s doodle   │    │ Pass to B  │    │ AI analyzing │    │ 60s guess    │    │ Score shown │
└─────────────┘    └──────────────┘    └──────────────┘    └────────────┘    └──────────────┘    └──────────────┘    └──────┬──────┘
                                                                                                                          │
                                                                                                           ┌──────────────┴──────────────┐
                                                                                                           │                             │
                                                                                                    Game not over?              Game over?
                                                                                                           │                             │
                                                                                                    ┌──────▼──────┐              ┌───────▼──────┐
                                                                                                    │ NEXT ROUND  │              │     END      │
                                                                                                    │ (COVER_A)   │              │  WIN / LOSE  │
                                                                                                    └─────────────┘              └──────────────┘
```

### Scoring Bands (Gap Score: 0–100)

| Score Range | Plank Type | Visual Effect | Sound Effect |
|-------------|------------|---------------|--------------|
| **70–100** | 🟩 Solid Plank | Slides in with spring bounce | Low thunk (square wave) |
| **30–69** | 🟨 Wobbly Plank | ~6° tilt + looping jiggle animation | Boing (sine wave wobble) |
| **0–29** | 💥 Collapse | Screen shakes, plank falls into river, splash effect | Crash (noise burst + low pitch drop) |

### Game Mechanics
- **Lives**: 2 (each collapse costs 1 life)
- **Reroll**: 1 scenario reroll allowed per round
- **Reveal**: Player A must hold-to-reveal the secret scenario (press-and-hold mechanic)
- **Drawing Time**: 30-second linear wall-clock countdown
- **Guessing Time**: 60-second (1-minute) linear wall-clock countdown for Player B
- **Constraints**: Player B must type their guess under a random silly constraint
- **Honest Mode**: Optional toggle that replaces dramatic personas with a calm, accurate interpreter
- **Demo Mode**: 100% offline play with keyword-matching scoring (no API key required)

---

## 🔧 Recent Fixes & Enhancements

### 1. Demo Mode Disabled Issue Fixed
- **Root Cause**:
  1. `GEMINI_MODEL` was configured as `'gemini-2.5-flash'`, which is an invalid model endpoint in Google's Generative Language API. Every network request immediately resulted in an HTTP 404 error, triggering the catch block to fall back to the offline demo mode generator.
  2. When Demo Mode was unchecked/disabled without an API key, the platform silently executed the offline fallback rather than informing the user.
  3. `TOGGLE_DEMO_MODE` did not persist in `localStorage`, causing inconsistent state across sessions.
- **Resolution**:
  - Updated `GEMINI_MODEL` to `'gemini-2.0-flash'` with automatic fallback to `'gemini-1.5-flash'`.
  - Added `formatGeminiError` to present descriptive toast errors (invalid key, quota exhausted, network failure) rather than silent masking.
  - Added localStorage persistence (`gap_jumpers_demo_mode`).
  - Added validation on `onStartGame`: if Demo Mode is disabled and no Gemini API key is configured, the user is notified with a clear toast and the Settings modal is opened.

### 2. Removal of Hackathon / Theme Elements
- Removed all "Devlympics", "Shunya 2026", and "Theme: Bridge the gap" badges and footers from:
  - `HomeScreen.tsx` (top badge pills and footer)
  - `EndScreen.tsx` (share/copy clipboard template)
  - `index.html` (title tag updated to `Gap Jumpers`)
  - `README.md` and documentation

### 3. Player A Drawing Timer Rapid Countdown Fixed
- **Root Cause**:
  - The previous timer in `DoodleCanvas.tsx` used `setInterval(..., 1000)` with `setTimeLeft((prev) => prev - 1)` whose `useEffect` had `handleFinish` as a dependency.
  - Whenever Player A drew on the canvas, state changes (`setIsDrawing`, `setCanUndo`, tool changes) or re-renders in the parent passed new function references, causing the effect to re-run and reset intervals erratically.
  - In React development mode / StrictMode, state updater callbacks are invoked twice, causing accelerated countdown.
- **Resolution**:
  - Switched to a strictly linear wall-clock countdown based on `Date.now()`: `endTime = Date.now() + 30 * 1000`.
  - The interval runs every 200ms calculating `Math.ceil((endTime - Date.now()) / 1000)`.
  - Callbacks are stored in persistent refs (`onFinishDoodleRef`, `handleFinishRef`).
  - The effect has an empty dependency array `[]`, ensuring it runs once on mount and is immune to drawing interactions and re-renders.

### 4. Player B Guessing Timer (1 Minute) Added
- **Implementation**:
  - Added a 60-second linear wall-clock countdown timer in `RelayGuessScreen.tsx`.
  - Uses the same robust `Date.now() + 60 * 1000` mechanism.
  - Features an on-screen timer badge `⏳ Xs` that pulses red/magenta when `timeLeft <= 15s`.
  - Plays audio tick in the final 5 seconds.
  - Automatically submits Player B's current input when the timer reaches 0 seconds.

### 5. Removed Floating Speech Text from Bridge Mascot
- **Resolution**:
  - Removed the floating speech bubble (`{speechText && ...}`) positioned above the robot mascot in `BridgeScene.tsx`.
  - Removed the redundant `speechText` prop from `BridgeScene` in `App.tsx`.
  - The interpreter's dialogue is already displayed cleanly in Player B's relay card in `RelayGuessScreen`.

### 6. Silly Typing Rule & Relatability Logic Fixed
- **Rule Enforcement**:
  - Player B's guess is now strictly validated against their assigned constraint (both programmatically via `checkConstraintRule` and via Gemini's 2-step evaluation rubric).
  - If Player B violates or ignores the silly typing rule, the score is capped between `0–20` (< 30), causing the bridge to **fail and collapse**, and the interpreter roasts them specifically for disobeying the rule.
- **Relatability Requirement**:
  - Simply typing words that satisfy the rule (e.g. typing only "woof woof" or "Bhai...") without guessing the scenario will NOT award points.
  - The guess must **relatably capture** the secret scenario under the silly constraint.
  - Planks (wobbly: 30–69, solid: 70–100) are only awarded when the rule is followed AND the guess aligns with the secret scenario.

### 7. Top Translation & Best Roast Logic Fixed (Scores Removed)
- **Score Number Removal**:
  - Removed `({score}/100)` from both "TOP TRANSLATION" and "BEST ROAST" cards on both winning and losing screens.
- **Logic Refinement**:
  - "Top Translation" highlights the highest scoring successful round (requires score >= 30 in a loss).
  - "Best Roast" highlights the lowest scoring round with score < 50, guaranteed not to duplicate "Top Translation".
  - Both cards display the scenario title and player guess for clear narrative context.

---

## 🛠️ Tech Stack & Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.8 | UI framework (React 19) |
| `react-dom` | ^19.2.8 | React DOM renderer |
| `framer-motion` | ^14.3.0 | Declarative animations (planks, transitions) |
| `canvas-confetti` | ^1.9.4 | Win-screen confetti celebration |
| `lucide-react` | ^1.59.0 | Icon library |
| `puppeteer-core` | ^25.14.0 | Verification and headless testing |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^8.3.0 | Build tool & dev server |
| `@vitejs/plugin-react` | ^6.1.1 | React Fast Refresh for Vite |
| `typescript` | ~6.0.2 | Type safety |
| `tailwindcss` | ^3.4.19 | Utility-first CSS framework |
| `postcss` | ^8.5.30 | PostCSS pipeline |
| `autoprefixer` | ^10.6.1 | CSS vendor prefixing |
| `oxlint` | ^1.81.0 | Fast linter |

---

## 📁 Project Structure

```
gap-jumpers/
├── public/
│   ├── favicon.svg                   # Bridge emoji favicon
│   └── icons.svg                     # SVG icon sprite
├── scripts/
│   └── verify-game.cjs               # Automated browser test suite
├── src/
│   ├── assets/
│   │   ├── hero.png                  # Hero image asset
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── screens/                  # Game screen components
│   │   │   ├── CoverAScreen.tsx      # Interstitial for Player A
│   │   │   ├── CoverBScreen.tsx      # Interstitial for Player B
│   │   │   ├── DrawScreen.tsx        # Canvas drawing wrapper
│   │   │   ├── EndScreen.tsx         # Victory/Defeat summary + stats
│   │   │   ├── HomeScreen.tsx        # Title screen + mode toggles
│   │   │   ├── InterpretingScreen.tsx# Mascot loading screen
│   │   │   ├── RelayGuessScreen.tsx  # Relay display + 60s guess timer
│   │   │   ├── ResultScreen.tsx      # Score gauge + round results
│   │   │   └── SecretCardScreen.tsx  # Hold-to-reveal scenario card
│   │   ├── BridgeScene.tsx           # Bridge visualization (cliffs, river, planks, mascot)
│   │   ├── DoodleCanvas.tsx          # 30s linear drawing canvas (5 colors, undo, clear)
│   │   ├── Hud.tsx                   # Top heads-up display
│   │   ├── ScoreGauge.tsx            # Animated radial SVG score gauge
│   │   ├── SettingsModal.tsx         # API key & Demo mode settings
│   │   └── Toast.tsx                 # Toast alerts
│   ├── data/
│   │   └── content.ts                # Scenarios, personas, constraints, loading quotes
│   ├── lib/
│   │   ├── ai.ts                     # Gemini 2.0/1.5 Flash + offline fallback
│   │   └── audio.ts                  # Web Audio API sound synthesis + SpeechSynthesis
│   ├── state/
│   │   └── game.ts                   # Game reducer & state machine
│   ├── types/
│   │   └── game.ts                   # TypeScript interfaces
│   ├── App.tsx                       # Main application shell
│   ├── index.css                     # Global styles, Neo-Brutalist utilities, animations
│   └── main.tsx                      # Application mount
├── details.md                        # Complete technical documentation
├── package.json                      # Dependencies & build scripts
├── tailwind.config.js                # Theme & colors
└── vite.config.ts                    # Vite build configuration
```

---

## 🏗️ Architecture & Data Flow

### Component Hierarchy

```
App.tsx (Root)
├── Toast                              # Toast notifications
├── SettingsModal                      # API key & mode settings
│
├── [HOME screen]
│   └── HomeScreen                     # Main menu + settings access
│
└── [IN-GAME screens]
    ├── Hud                            # Persistent status bar (round, planks, lives)
    ├── BridgeScene                    # Animated bridge, river, crocodile, mascot
    └── <main> (Active Screen)
        ├── CoverAScreen               # "Pass to Player A"
        ├── SecretCardScreen           # Hold-to-reveal card + reroll
        ├── DrawScreen                 # 30s linear drawing canvas
        ├── CoverBScreen               # "Pass to Player B"
        ├── InterpretingScreen         # Rotating funny quotes & mascot animation
        ├── RelayGuessScreen           # AI relay text + 60s guessing timer
        ├── ResultScreen               # Radial score gauge + comparison + audio
        └── EndScreen                  # Game outcome, statistics, confetti
```

---

## 📐 Type System

### Core Types (`src/types/game.ts`)

```typescript
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
  planks: PlankType[];
  lives: number;
  honestMode: boolean;
  demoMode: boolean;
  muted: boolean;
  apiKey: string;
  currentScenario: Scenario | null;
  scenarioRerolled: boolean;
  revealedAtLeastOnce: boolean;
  currentPersona: Persona | null;
  lastPersonaId: string | null;
  currentConstraint: Constraint | null;
  doodleDataUrl: string;
  relayText: string;
  isRelayAiGenerated: boolean;
  guessText: string;
  latestResult: RoundResult | null;
  history: RoundResult[];
  gameOutcome: 'WIN' | 'LOSE' | null;
  isAnalyzing: boolean;
  errorMessage: string | null;
}
```

---

## 🔄 State Management

### Reducer Actions (`src/state/game.ts`)
The application manages full round progression via React's `useReducer`:

- `START_GAME`: Resets round counter, lives (2), planks ([]), and selects random scenario, persona, and constraint.
- `PROCEED_TO_SECRET_CARD`: Transitions from Cover A to Secret Card.
- `REVEAL_SCENARIO_HELD`: Flags that scenario was revealed at least once.
- `REROLL_SCENARIO`: Allows 1 scenario swap per round.
- `PROCEED_TO_DRAW`: Transitions to drawing canvas.
- `SUBMIT_DOODLE`: Saves base64 PNG data URL, transitions to Cover B.
- `PROCEED_TO_INTERPRETING`: Starts AI relay analysis.
- `SET_RELAY_RESULT`: Stores relay commentary, moves to Relay Guess screen.
- `SET_GUESS_TEXT`: Updates Player B's guess string (max 200 chars).
- `SUBMIT_GUESS_START`: Starts AI scoring evaluation.
- `SET_SCORE_RESULT`: Computes solid plank (>=70), wobbly plank (30-69), or collapse (<30). Deducts life on collapse.
- `PROCEED_FROM_RESULT`: Checks win (3 planks) or lose (0 lives) → End screen, or advances to Next Round.
- `TOGGLE_DEMO_MODE`: Persists demo mode preference to `localStorage`.
- `TOGGLE_HONEST_MODE`: Swaps between chaos and honest personas.
- `TOGGLE_MUTE`: Persists audio mute state to `localStorage`.
- `SET_API_KEY`: Stores API key in `localStorage` and disables demo mode if valid.

---

## 🤖 AI Engine (Gemini Integration)

### File: `src/lib/ai.ts`

### Models
- **Primary**: `gemini-2.0-flash`
- **Fallback**: `gemini-1.5-flash`

### Call 1: Relay Generation (Multimodal Vision)
- **Input**: Base64 PNG image data of Player A's doodle.
- **Prompt**:
  - *Chaos Mode*: "You are [Persona Name]: [Style]. Look at this quick doodle drawn in 30 seconds by a player. Describe to a second player, who cannot see it, what is happening in the drawing... Respond ONLY as JSON: `{\"relay\": \"...\"}`"
  - *Honest Mode*: "You are a calm, accurate interpreter. Look at this quick doodle. Describe plainly and helpfully what you see... Respond ONLY as JSON: `{\"relay\": \"...\"}`"
- **Output**: JSON object `{ "relay": string }`.

### Call 2: Semantic Gap Scoring
- **Input**: Secret scenario text + Player B's guess text.
- **Rubric**:
  - `90–100`: Same meaning
  - `60–89`: Close with minor differences
  - `30–59`: Related but missing the main idea
  - `0–29`: Incorrect
- **Persona Commentary**: Writes a short roast (<50) or cheer (>=50) in the active persona's voice.
- **Output**: JSON object `{ "score": number, "comment": string }`.

---

## 📴 Offline / Demo Mode Engine

### Offline Relay (`getOfflineRelay`)
Uses pre-authored visual clues combined with persona template strings:
```
Template: "Arre! In this tragic tale, I see {clues}! Kya zamana aa gaya hai!"
Clues: "a bat and a ball and everything plunged in darkness"
Result: "Arre! In this tragic tale, I see a bat and a ball and everything plunged in darkness! Kya zamana aa gaya hai!"
```

### Offline Scoring (`getOfflineScore`)
Keyword tokenization algorithm:
1. Normalizes and tokenizes Player B's guess into words.
2. Matches against scenario's `keywords[]`.
3. Formula: `min(100, round((matches / 3) * 80) + (matches >= 4 ? 20 : 0)) + jitter(±5)`.
4. Selects contextual witty fallback comments based on score band.

---

## 🔊 Audio System

### File: `src/lib/audio.ts`
Zero external audio files — all sounds are procedurally synthesized using the **Web Audio API**:

- **Plank Thunk**: Square wave ramping from 140Hz down to 45Hz (~220ms).
- **Wobbly Boing**: Sine wave with 5-point pitch oscillation (220Hz → 440Hz → 260Hz → 360Hz → 200Hz).
- **Collapse Crash**: White noise buffer through lowpass filter (1000Hz → 150Hz) paired with low sawtooth boom.
- **Win Jingle**: 4-note ascending triangle wave arpeggio (C4, E4, G4, C5).
- **Countdown Tick**: 50ms sine wave click (800Hz → 300Hz) in final 5 seconds.

### SpeechSynthesis
- Reads AI interpreter relays and result commentary aloud.
- Tuned pitch and rate per persona.
- Automatic cancellation on screen navigation.
- Global mute toggle persisted in `localStorage`.

---

## 🎨 Drawing Canvas Implementation

### File: `src/components/DoodleCanvas.tsx`
- **Resolution**: 640×480 HTML5 Canvas (4:3 aspect ratio).
- **Tools**:
  - 5 Vibrant Colors: Black, Red, Blue, Green, Orange.
  - 3 Brush Sizes: S (4px), M (8px), L (16px).
  - Eraser tool (white stroke).
  - Undo stack: Snapshot history storing up to 20 states via `getImageData`.
  - Clear Canvas.
- **Timer**: 30-second linear wall-clock countdown (`Date.now() + 30000`) completely immune to drawing events.
- **Export**: Downscales to max 768px width offscreen canvas with guaranteed opaque white background, returning PNG data URL.

---

## ⏱️ Player B Guessing Timer

### File: `src/components/screens/RelayGuessScreen.tsx`
- **Duration**: 60 seconds (1 minute).
- **Timer Engine**: Linear wall-clock countdown using `Date.now() + 60000`.
- **UI Indicator**: Neo-brutalist badge `⏳ Xs` in the card header.
- **Urgency Warning**: Pulses magenta when `timeLeft <= 15s`.
- **Audio Cues**: Plays tick sound during the last 5 seconds.
- **Auto-Submit**: Automatically submits the player's typed guess when time runs out.

---

## 🌉 Bridge Scene & Animations

### File: `src/components/BridgeScene.tsx`
- **Environment**: Night sky gradient with star pulses, cliffs for Doodler and Typist, teal river basin with animated bobbing crocodile (🐊) and fish (🐟).
- **Bridge Slots**: 3 bridge slots showing construction progress.
- **Plank Animations**:
  - Solid: Spring bounce animation (stiffness: 350).
  - Wobbly: Spring animation with continuous CSS `animate-jiggle` (~6° tilt).
  - Collapse: Cracks with red flash, snap text, and rotates 65° down into splash effect (`💦💥💦`).
- **Mascot**: 🤖 robot interpreter on the bridge with persona emoji badge.
- **Cleaned View**: Floating speech text above the robot has been removed to keep the bridge unobstructed.

---

## 🎨 UI / Design System

### Neo-Brutalist Aesthetic
- **Colors**:
  - `indigoDark`: `#1B1464` (Main background)
  - `marigold`: `#FFB400` (Primary button / solid planks)
  - `saffron`: `#FF6B1A` (Wobbly planks / toasts)
  - `magenta`: `#E6007E` (Accents / timer warning / collapse)
  - `teal`: `#00B8A9` (River / honest mode)
  - `cream`: `#FFF6E0` (Card surfaces)
- **Shadows**: Hard-offset black drop shadows (`4px 4px 0px #000`, `6px 6px 0px #000`).
- **Typography**: Google Fonts Bungee (headings) & Poppins (body).
- **Button Press Effect**: Active translation `translate-x-1 translate-y-1 shadow-none`.

---

## 📦 Content & Data

### 18 Scenarios (`src/data/content.ts`)
1. Cricket match during a power cut
2. Chai stall in the rain
3. Delhi Metro at rush hour
4. Wedding baraat with a dancing horse
5. A cow blocking the traffic
6. Kite flying on Makar Sankranti
7. Auto-rickshaw driver arguing about the fare
8. Diwali night with a rocket going wrong
9. Biryani being stolen by a cat
10. Student studying in the last 5 minutes before exam
11. Waterlogged road with a floating scooter
12. Mom searching for the TV remote
13. Karaoke night with terrible singing
14. Monkey stealing a tourist's sunglasses
15. Pizza delivery guy lost in a narrow gali
16. Aliens landing at India Gate
17. Mango thief on a tree and an angry uncle
18. Camel ride gone wrong at the desert fair

### 6 Chaos Personas + 1 Honest Persona
- 🎬 **Dramatic Bollywood Dubbing Artist**
- 🏏 **Cricket Commentator**
- 👵 **Suspicious Aunt**
- 🎭 **Shakespeare**
- 📺 **Breaking News Anchor**
- ☕ **Sleepy Chai Wallah**
- 🤝 **Honest Interpreter**

### 10 Player B Typing Constraints
- ❓ Only questions allowed!
- 🎭 Type only in Shakespearean English!
- 3️⃣ Three words maximum!
- 🤐 No letter "E" allowed!
- 🐶 Answer like a dog (woof woof included)
- 📢 ALL CAPS ONLY!
- 🎬 Describe it like a movie title!
- 🧑‍🍳 Use at least one food word!
- 🤖 Speak like a robot with beep boop!
- 🗣️ Start your guess with 'Bhai...'

---

## ⚙️ Configuration Files

- `vite.config.ts`: React plugin configuration.
- `tailwind.config.js`: Neo-brutalist palette, fonts (Bungee, Poppins), custom shadows.
- `tsconfig.json`: TypeScript configurations with strict checking.
- `.env.example`: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`.

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| 9 Game Screens | ✅ Complete | Full pass-and-play flow |
| State Management | ✅ Complete | useReducer with localStorage persistence |
| Linear 30s Drawing Timer | ✅ Fixed | Strictly linear wall-clock countdown |
| Linear 60s Guessing Timer | ✅ Implemented | Auto-submits on expiration |
| Gemini 2.0 / 1.5 Flash | ✅ Fixed | Replaced invalid 2.5-flash model name |
| Error Notifications | ✅ Enhanced | Descriptive toast errors on API issues |
| Demo Mode Persistence | ✅ Fixed | Saved in `localStorage` |
| Devlympics / Theme Text | ✅ Removed | Completely decoupled from hackathon branding |
| Floating Robot Speech | ✅ Removed | Cleaner unobstructed bridge visual |
| Procedural Audio System | ✅ Complete | Web Audio API + SpeechSynthesis |
| Production Build | ✅ Verified | `npm run build` passes with zero errors |
