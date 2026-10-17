# 🌉 GAP JUMPERS

> *"Every translation loses something. Let's make that a game."*

**Gap Jumpers** is a 2-player pass-and-play party game built on a single laptop.

Player A can **ONLY draw**, Player B can **ONLY type** under hilarious silly constraints, and an AI Interpreter (with dramatic Bollywood, Cricket, Aunt, or Shakespeare personas) bridges the gap between image and text. Accurate, creative rounds build sturdy bridge planks; catastrophic failures collapse the bridge into a crocodile-infested river!

---

## 🎮 How to Play

1. **Secret Scenario (Player A)**: Player A holds the reveal button to secretly read their scenario (e.g., *"Cricket match during a power cut"*). 1 reroll is allowed per round.
2. **Doodle Canvas (Player A)**: Player A has a **30-second linear countdown** to draw the scenario using 5 vibrant colors, brush sizes, and undo tools.
3. **AI Translation (The Bridge)**: The AI Interpreter inspects the doodle and describes what it sees to Player B in character (or plainly in Honest Mode) using synthesized speech. Player B **never** sees the doodle!
4. **Silly Guess (Player B)**: Player B has a **60-second (1-minute) countdown** to guess the secret scenario under a silly typing rule (e.g., *dog sounds*, *Shakespearean English*, *only questions*, *no letter 'E'*).
5. **Silly Typing Rule & Relatability Logic**:
   - ⚠️ **Rule Enforcement**: If Player B does **not** follow the silly typing rule, the bridge **fails and collapses** (score capped between 0–20) and the interpreter roasts them for breaking the rule!
   - 🎯 **Relatability Requirement**: Following the silly rule is required, but not sufficient on its own. The guess must also **align and relate** to the secret scenario. Typing random words that fulfill the rule without guessing the scene will still collapse the bridge! Planks are only earned when the rule is followed AND the guess relates to the scenario.
6. **Gap Score & Bridge Physics**:
   - **70–100 (Solid Plank)**: Wooden plank slides in with a bounce and low thunk sound.
   - **30–69 (Wobbly Plank)**: Placed with a ~6° tilt and a looping jiggle animation.
   - **0–29 (Collapse)**: Bridge cracks, screen shakes, planks splash into the crocodile river, and 1 life is lost.
7. **Victory, Defeat & Game Highlights**:
   - 🏆 **3 Planks**: Bridge is completed! Character crosses to victory with confetti and fanfare!
   - 💥 **2 Collapses**: All lives lost! The gap claims another victim.
   - 🌟 **Top Translation**: Highlights the best collaborative translation of the match without displaying raw scores.
   - 🔥 **Best Roast**: Highlights the funniest interpreter roast from failed rounds without displaying raw scores.

---

## 🎨 Design & Aesthetic

- **Neo-Brutalist Chai-Stall Poster**: Bold 3px/4px black outlines, hard offset drop shadows (`4px 4px 0px #000`), angled sticker cards, and dot patterns.
- **Palette**: Indigo (`#1B1464`), Marigold (`#FFB400`), Saffron (`#FF6B1A`), Magenta (`#E6007E`), Teal (`#00B8A9`), and Cream (`#FFF6E0`).
- **Typography**: Google Fonts Bungee (headings) & Poppins (body).

---

## 🤖 AI & Offline Fallback Engine

- **Model**: Google Gemini 2.0 Flash (`gemini-2.0-flash`) with automatic fallback to `gemini-1.5-flash`.
- **Call 1 (Relay)**: Base64 multimodal doodle analysis with persona character prompting.
- **Call 2 (Gap Score)**: 2-step evaluation verifying that the silly typing rule was followed and that the guess relatably captures the secret scenario (0–100).
- **100% Offline Demo Mode**: Zero internet needed! Features programmatic constraint validation, keyword tokenization scoring, and persona template relay.
- **Fail-safe Resilience**: Automatic model fallback and informative toast notifications on network drops or invalid API keys.

---

## 🔊 Audio System

- **Web Audio API**: Real-time synthesized sound effects with zero external audio assets (plank thunk, wobbly boing, collapse crash, win jingle, countdown tick).
- **SpeechSynthesis**: Persona-tuned pitch and speech rate with automatic cancellation on screen changes and global mute.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/vinitabalotiya/gap-jumpers.git
cd gap-jumpers

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### (Optional) Gemini API Key

- Copy `.env.example` to `.env` and add your API key:
  ```env
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```
- Or enter it directly in the in-app **Settings** modal (stored strictly in your browser's `localStorage`).
- Without a key, **Demo Mode** can be toggled on for complete offline play!

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Neo-Brutalist utility classes
- **Animation**: Framer Motion + Canvas Confetti
- **Icons**: Lucide React
- **Audio**: Web Audio API + Web SpeechSynthesis API
- **Testing**: Automated Puppeteer verification suite
