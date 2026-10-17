import type { Persona, Scenario, Constraint } from '../types/game';
import { FALLBACK_COMMENTS } from '../data/content';

export const GEMINI_MODEL = 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];

export interface RelayResponse {
  relay: string;
  isAi: boolean;
}

export interface ScoreResponse {
  score: number;
  comment: string;
  isAi: boolean;
}

export interface ConstraintCheckResult {
  followed: boolean;
  violationReason?: string;
}

// Programmatic validator for silly typing rules
export function checkConstraintRule(guess: string, constraint: Constraint): ConstraintCheckResult {
  const trimmed = guess.trim();
  if (!trimmed) {
    return { followed: false, violationReason: 'No guess was submitted!' };
  }

  switch (constraint.id) {
    case 'questions': {
      // Must contain a question mark
      const hasQuestionMark = trimmed.includes('?');
      if (!hasQuestionMark) {
        return { followed: false, violationReason: 'You broke the rule: Guess must be a question ending with "?"!' };
      }
      return { followed: true };
    }

    case 'shakespeare': {
      // Must contain Shakespearean / archaic English words
      const archaicPattern = /\b(thou|thee|thy|thine|doth|dost|hark|art|alas|nay|ye|shall|shalt|wherefore|hath|forsooth|prithee|anon|fair|tis|methinks|oft|whither|thence)\b/i;
      if (!archaicPattern.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: Guess must include Shakespearean English (thou, thee, hark, alas, etc.)!' };
      }
      return { followed: true };
    }

    case 'three_words': {
      // Max 3 words
      const words = trimmed.split(/\s+/).filter(Boolean);
      if (words.length > 3) {
        return { followed: false, violationReason: `You broke the rule: Only 3 words allowed (you typed ${words.length} words)!` };
      }
      return { followed: true };
    }

    case 'no_e': {
      // No letter E or e
      if (/[eE]/.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: No letter "E" allowed in your guess!' };
      }
      return { followed: true };
    }

    case 'dog': {
      // Dog sounds
      const dogPattern = /\b(woof|bark|barks|bow|ruff|bhow|arff|arf|yap)\b/i;
      if (!dogPattern.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: Must answer like a dog with woof/bark/bow!' };
      }
      return { followed: true };
    }

    case 'caps': {
      // All caps
      const hasLetters = /[a-zA-Z]/.test(trimmed);
      const isAllCaps = trimmed === trimmed.toUpperCase();
      if (!hasLetters || !isAllCaps) {
        return { followed: false, violationReason: 'You broke the rule: Must type in ALL CAPS ONLY!' };
      }
      return { followed: true };
    }

    case 'movie_title': {
      // Movie title format: starts with The/A, or contains colon/dash, or short title <= 6 words
      const moviePattern = /\b(the|a|part|returns|story|mission|chronicles|revenge|strike|legend|tale|rise|fall)\b/i;
      const isShortTitle = trimmed.split(/\s+/).length <= 6;
      const hasPunctuation = /[:\-"']/.test(trimmed);
      if (!moviePattern.test(trimmed) && !hasPunctuation && !isShortTitle) {
        return { followed: false, violationReason: 'You broke the rule: Must format guess like a movie title!' };
      }
      return { followed: true };
    }

    case 'food_word': {
      // Must contain food or drink word
      const foodPattern = /\b(chai|tea|coffee|biryani|roti|samosa|curry|rice|bread|pizza|burger|snack|paneer|sweet|laddu|mango|apple|banana|potato|aloo|dal|butter|cheese|soup|cookie|cake|sugar|salt|oil|spicy|sauce|water|milk|juice|dish|meal|food|tiffin|bhaji|paratha|naan|dosa|idli)\b/i;
      if (!foodPattern.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: Must include at least one food or drink word!' };
      }
      return { followed: true };
    }

    case 'robot': {
      // Robot sounds or words
      const robotPattern = /\b(beep|boop|bzz|robot|executing|processing|unit|system|protocol|error|01|code|initiating|calculating)\b/i;
      if (!robotPattern.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: Must speak like a robot with beep boop!' };
      }
      return { followed: true };
    }

    case 'bhai': {
      // Must start with Bhai
      if (!/^\s*bhai[\s\.,!:\-]/i.test(trimmed) && !/^\s*bhai$/i.test(trimmed)) {
        return { followed: false, violationReason: 'You broke the rule: Must start your guess with "Bhai..."!' };
      }
      return { followed: true };
    }

    default:
      return { followed: true };
  }
}

// Tokenize guess and compute deterministic fallback score with rule & relatability checks
export function getOfflineScore(
  guess: string,
  scenario: Scenario,
  constraint?: Constraint,
  persona?: Persona
): ScoreResponse {
  const trimmed = guess.trim();
  if (!trimmed) {
    const comments = FALLBACK_COMMENTS.low;
    const comment = comments[Math.floor(Math.random() * comments.length)];
    return { score: 0, comment, isAi: false };
  }

  // 1. Check Silly Typing Rule Constraint
  if (constraint) {
    const ruleCheck = checkConstraintRule(trimmed, constraint);
    if (!ruleCheck.followed) {
      // Bridge FAILS, score is low because silly rule was violated!
      const personaName = persona?.name || 'Interpreter';
      const comment = `${personaName} says: "${ruleCheck.violationReason} The bridge collapsed!"`;
      return {
        score: Math.floor(Math.random() * 11) + 10, // 10 to 20 (always < 30)
        comment,
        isAi: false,
      };
    }
  }

  // Lowercase and strip punctuation
  const cleanGuess = trimmed.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = new Set(cleanGuess.split(/\s+/).filter(Boolean));

  let matches = 0;
  for (const kw of scenario.keywords) {
    const lowerKw = kw.toLowerCase().trim();
    if (words.has(lowerKw) || cleanGuess.includes(lowerKw)) {
      matches++;
    }
  }

  // 2. Relatability check:
  // If player followed silly rule, it must align with scenario keywords!
  // If 0 keywords matched, score stays low (15-25) with a roast!
  if (matches === 0) {
    const personaName = persona?.name || 'Interpreter';
    return {
      score: Math.floor(Math.random() * 11) + 15, // 15 to 25 (< 30)
      comment: `${personaName} says: "You followed the rule, but your guess has nothing to do with what was drawn! Bridge collapsed!"`,
      isAi: false,
    };
  }

  // Formula from spec: min(100, round(matches/3*80) + (matches>=4 ? 20 : 0)) + random jitter ±5, clamped 30-100
  const base = Math.min(100, Math.round((matches / 3) * 80) + (matches >= 4 ? 20 : 0));
  const jitter = Math.floor(Math.random() * 11) - 5; // -5 to +5
  const score = Math.max(30, Math.min(100, base + jitter));

  let commentList = FALLBACK_COMMENTS.medium;
  if (score >= 70) {
    commentList = FALLBACK_COMMENTS.high;
  }
  const comment = commentList[Math.floor(Math.random() * commentList.length)];

  return { score, comment, isAi: false };
}

// Offline fallback for Relay
export function getOfflineRelay(scenario: Scenario, persona: Persona): RelayResponse {
  const joinedClues = scenario.clues.join(' and ');
  const relay = persona.fallbackTemplate.replace('{clues}', joinedClues);
  return { relay, isAi: false };
}

// Strip base64 metadata header if present
function extractBase64Data(dataUrl: string): { data: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/png', data: dataUrl };
}

// Robust JSON extractor handling raw strings, markdown codeblocks, and thought signatures
export function extractJsonFromResponse<T = any>(rawText: string): T {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  throw new Error(`Unable to parse valid JSON from AI response: ${rawText.slice(0, 100)}...`);
}

// Helper to extract clean error message
export function formatGeminiError(err: any): string {
  const msg = err?.message || String(err || '');
  if (msg.includes('API_KEY_INVALID')) {
    return 'Invalid Gemini API key. Please check Settings.';
  }
  if (msg.includes('400')) {
    return 'Gemini API request error (400). Please check your API key.';
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini API quota exhausted. Using offline interpreter.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Network connection error. Using offline interpreter.';
  }
  return 'AI error encountered, using backup interpreter.';
}

// Generic Gemini caller with model fallback chain
async function callGeminiApi(apiKey: string, body: unknown): Promise<any> {
  const cleanKey = apiKey.trim();
  let lastError: any = null;

  for (const model of GEMINI_FALLBACK_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini HTTP ${response.status} (${model}): ${errorText}`);
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textParts = parts
        .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
        .filter(Boolean);

      if (textParts.length === 0) {
        throw new Error(`Empty response from Gemini API (${model})`);
      }

      const combinedText = textParts.join('\n');
      return extractJsonFromResponse(combinedText);
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      if (msg.includes('API_KEY_INVALID') || msg.includes('400')) {
        break;
      }
      // Brief pause before trying fallback model
      await new Promise(r => setTimeout(r, 200));
    }
  }

  throw lastError;
}

// Call 1: Relay from Doodle
export async function generateRelay(
  doodleDataUrl: string,
  persona: Persona,
  honestMode: boolean,
  apiKey: string | null,
  demoMode: boolean,
  scenarioForFallback: Scenario,
  onHiccup?: (msg: string) => void
): Promise<RelayResponse> {
  if (demoMode || !apiKey || !apiKey.trim()) {
    return getOfflineRelay(scenarioForFallback, persona);
  }

  const { data: base64Data, mimeType } = extractBase64Data(doodleDataUrl);

  const promptText = honestMode
    ? `You are a calm, accurate interpreter. Look at this quick doodle. Describe plainly and helpfully what you see so a second player, who cannot see it, can understand it. Mention the main objects, people, setting and actions. Do not give a single final title. Max 50 words. Respond ONLY as JSON: {"relay": "..."}`
    : `You are ${persona.name}: ${persona.style}. Look at this quick doodle drawn in 30 seconds by a player. Describe to a second player, who cannot see it, what is happening in the drawing. Stay completely in character and be dramatic and funny, but your description MUST include at least two TRUE visual details actually visible in the drawing (objects, people, setting, actions). Exaggerate the tone only, not the facts. Do NOT state a single final title or answer. Max 60 words. Respond ONLY as JSON: {"relay": "..."}`;

  const body = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.9,
    },
  };

  try {
    const res = await callGeminiApi(apiKey.trim(), body);
    if (res && typeof res.relay === 'string' && res.relay.trim()) {
      return { relay: res.relay.trim(), isAi: true };
    }
    throw new Error('Invalid JSON structure for relay');
  } catch (err) {
    console.warn('Gemini Call 1 error:', err);
    onHiccup?.(formatGeminiError(err));
    return getOfflineRelay(scenarioForFallback, persona);
  }
}

// Call 2: Score Guess with Silly Rule & Relatability evaluation
export async function generateScore(
  scenario: Scenario,
  guess: string,
  constraint: Constraint,
  persona: Persona,
  honestMode: boolean,
  apiKey: string | null,
  demoMode: boolean,
  onHiccup?: (msg: string) => void
): Promise<ScoreResponse> {
  // Pre-validate constraint programmatically to guarantee consistency
  const ruleCheck = checkConstraintRule(guess, constraint);

  if (demoMode || !apiKey || !apiKey.trim()) {
    return getOfflineScore(guess, scenario, constraint, persona);
  }

  const honestNote = honestMode ? 'Keep the comment kind and encouraging, no harsh roasting.' : '';
  const promptText = `
Secret scenario: '${scenario.text}'.
Player B's typed guess: '${guess}'.
Required silly typing rule: '${constraint.text}'.

EVALUATION CRITERIA (Strict 2-step evaluation):

STEP 1: SILLY TYPING RULE VALIDATION
Did Player B follow the required silly typing rule '${constraint.text}'?
- If the player DID NOT follow the silly typing rule:
  The score MUST be between 0 and 20 (Score < 30 causes the bridge to collapse). The bridge MUST fail because they disobeyed the rule!
  The comment MUST explicitly call out their failure to follow the silly typing rule.

STEP 2: GUESS & SCENARIO RELATABILITY (Only if the rule WAS followed):
If the player DID follow the silly typing rule, evaluate how relatable and close their guess is in meaning to the secret scenario:
- 90-100: Accurately captures the secret scenario while creatively following the silly rule!
- 60-89: Relatable and close to the scenario with minor differences under the silly constraint.
- 30-59: Somewhat related to the scenario, but missing key elements.
- 0-29: The guess followed the rule but is completely unrelated or nonsensical to the secret scenario (e.g., just random words satisfying the constraint without actually guessing the scene).

Write ONE short line (max 20 words) in the character voice of ${persona.name}:
- If score < 50: a playful roast (mentioning rule failure if broken, or wrong guess).
- If score >= 50: an excited cheer praising their clever translation under the constraint.
${honestNote}

Respond ONLY as JSON: {"score": <integer 0-100>, "comment": "..."}
`.trim();

  const body = {
    contents: [
      {
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8,
    },
  };

  try {
    const res = await callGeminiApi(apiKey.trim(), body);
    let scoreNum = Math.max(0, Math.min(100, Math.round(Number(res?.score) || 0)));
    let commentStr = (res?.comment && typeof res.comment === 'string') ? res.comment.trim() : 'Interesting translation!';

    // Enforce programmatic rule check as safeguard:
    // If the silly rule was definitively broken, clamp score < 30 so bridge collapses!
    if (!ruleCheck.followed && scoreNum >= 30) {
      scoreNum = Math.min(scoreNum, 20);
      if (!commentStr.toLowerCase().includes('rule') && !commentStr.toLowerCase().includes('constraint')) {
        commentStr = `${ruleCheck.violationReason} ${commentStr}`;
      }
    }

    return { score: scoreNum, comment: commentStr, isAi: true };
  } catch (err) {
    console.warn('Gemini Call 2 error:', err);
    onHiccup?.(formatGeminiError(err));
    return getOfflineScore(guess, scenario, constraint, persona);
  }
}
