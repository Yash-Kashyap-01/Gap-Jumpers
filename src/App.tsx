import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { initialGameState, gameReducer } from './state/game';
import { audioManager } from './lib/audio';
import { generateRelay, generateScore } from './lib/ai';

// Components
import { Hud } from './components/Hud';
import { BridgeScene } from './components/BridgeScene';
import { OceanBackground } from './components/OceanBackground';
import { Toast } from './components/Toast';
import { SettingsModal } from './components/SettingsModal';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { CoverAScreen } from './components/screens/CoverAScreen';
import { SecretCardScreen } from './components/screens/SecretCardScreen';
import { DrawScreen } from './components/screens/DrawScreen';
import { CoverBScreen } from './components/screens/CoverBScreen';
import { InterpretingScreen } from './components/screens/InterpretingScreen';
import { RelayGuessScreen } from './components/screens/RelayGuessScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { EndScreen } from './components/screens/EndScreen';

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [collapsedPlankIndex, setCollapsedPlankIndex] = useState<number | null>(null);

  // Sync mute state with audio manager
  useEffect(() => {
    audioManager.setMuted(state.muted);
  }, [state.muted]);

  // Cancel any ongoing speech on screen transitions
  useEffect(() => {
    audioManager.stopSpeech();
  }, [state.screen]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Bridge collapse trigger for Result screen
  const triggerBridgeCollapse = useCallback(() => {
    setIsCollapsing(true);
    setCollapsedPlankIndex(Math.max(0, state.planks.length));
    setTimeout(() => {
      setIsCollapsing(false);
      setCollapsedPlankIndex(null);
    }, 1800);
  }, [state.planks.length]);

  // Handle Relay generation when entering INTERPRETING from Player B cover
  useEffect(() => {
    if (state.screen === 'INTERPRETING' && !state.isRelayAiGenerated && !state.relayText && state.doodleDataUrl) {
      let isMounted = true;
      (async () => {
        try {
          const res = await generateRelay(
            state.doodleDataUrl,
            state.currentPersona!,
            state.honestMode,
            state.apiKey,
            state.demoMode,
            state.currentScenario!,
            showToast
          );
          if (isMounted) {
            dispatch({ type: 'SET_RELAY_RESULT', relayText: res.relay, isAi: res.isAi });
          }
        } catch (err) {
          console.error('Relay error:', err);
          if (isMounted) {
            showToast('AI had a hiccup, using backup interpreter');
            dispatch({
              type: 'SET_RELAY_RESULT',
              relayText: 'Look at this mystery! I see shadows and wonders!',
              isAi: false,
            });
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    }
  }, [
    state.screen,
    state.relayText,
    state.isRelayAiGenerated,
    state.doodleDataUrl,
    state.currentPersona,
    state.honestMode,
    state.apiKey,
    state.demoMode,
    state.currentScenario,
    showToast,
  ]);

  // Handle Scoring when entering INTERPRETING after guess submission
  useEffect(() => {
    if (state.screen === 'INTERPRETING' && state.relayText && state.isAnalyzing && !state.latestResult) {
      let isMounted = true;
      (async () => {
        try {
          const res = await generateScore(
            state.currentScenario!,
            state.guessText,
            state.currentConstraint!,
            state.currentPersona!,
            state.honestMode,
            state.apiKey,
            state.demoMode,
            showToast
          );
          if (isMounted) {
            dispatch({
              type: 'SET_SCORE_RESULT',
              score: res.score,
              comment: res.comment,
              isAi: res.isAi,
            });
          }
        } catch (err) {
          console.error('Score error:', err);
          if (isMounted) {
            showToast('AI had a hiccup, using backup interpreter');
            dispatch({
              type: 'SET_SCORE_RESULT',
              score: 50,
              comment: 'The bridge holds despite the confusion!',
              isAi: false,
            });
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    }
  }, [
    state.screen,
    state.relayText,
    state.isAnalyzing,
    state.latestResult,
    state.currentScenario,
    state.guessText,
    state.currentConstraint,
    state.currentPersona,
    state.honestMode,
    state.apiKey,
    state.demoMode,
    showToast,
  ]);

  const handleStartGame = useCallback(() => {
    if (!state.demoMode && (!state.apiKey || !state.apiKey.trim())) {
      showToast('Demo Mode is disabled: Please add a Gemini API key or turn Demo Mode ON.');
      setIsSettingsOpen(true);
      return;
    }
    dispatch({ type: 'START_GAME' });
  }, [state.demoMode, state.apiKey, showToast]);

  const handleSubmitDoodle = useCallback((dataUrl: string) => {
    dispatch({ type: 'SUBMIT_DOODLE', doodleDataUrl: dataUrl });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between text-black relative">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={state.apiKey}
        onSaveKey={(key) => dispatch({ type: 'SET_API_KEY', apiKey: key })}
        demoMode={state.demoMode}
        onToggleDemoMode={() => dispatch({ type: 'TOGGLE_DEMO_MODE' })}
      />

      {/* Main Screen Router */}
      {state.screen === 'HOME' ? (
        <HomeScreen
          onStartGame={handleStartGame}
          onOpenSettings={() => setIsSettingsOpen(true)}
          honestMode={state.honestMode}
          onToggleHonest={() => dispatch({ type: 'TOGGLE_HONEST_MODE' })}
          demoMode={state.demoMode}
          onToggleDemo={() => dispatch({ type: 'TOGGLE_DEMO_MODE' })}
          hasApiKey={Boolean(state.apiKey && state.apiKey.trim())}
        />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Extended Full-Page Ocean Background with Animated Swimming Fish, Crabs, Waves, Bubbles */}
          <OceanBackground />

          {/* Persistent In-Game HUD */}
          <div className="relative z-20">
            <Hud
              roundNumber={state.roundNumber}
              planks={state.planks}
              lives={state.lives}
              honestMode={state.honestMode}
              onToggleHonest={() => dispatch({ type: 'TOGGLE_HONEST_MODE' })}
              muted={state.muted}
              onToggleMute={() => dispatch({ type: 'TOGGLE_MUTE' })}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onRestart={() => dispatch({ type: 'RESTART_GAME' })}
              onGoHome={() => dispatch({ type: 'GO_HOME' })}
              isDemoMode={state.demoMode}
            />
          </div>

          {/* Persistent In-Game Animated Bridge Scene */}
          <div className="relative z-20">
            <BridgeScene
              planks={state.planks}
              persona={state.currentPersona}
              isCollapsing={isCollapsing}
              isWon={state.gameOutcome === 'WIN'}
              isLost={state.gameOutcome === 'LOSE'}
              collapsedPlankIndex={collapsedPlankIndex}
            />
          </div>

          {/* Active Screen Body */}
          <main className="flex-1 flex flex-col justify-center relative z-20">
            {state.screen === 'COVER_A' && (
              <CoverAScreen
                roundNumber={state.roundNumber}
                onProceed={() => dispatch({ type: 'PROCEED_TO_SECRET_CARD' })}
              />
            )}

            {state.screen === 'SECRET_CARD' && state.currentScenario && (
              <SecretCardScreen
                scenario={state.currentScenario}
                revealedAtLeastOnce={state.revealedAtLeastOnce}
                scenarioRerolled={state.scenarioRerolled}
                onRevealHeld={() => dispatch({ type: 'REVEAL_SCENARIO_HELD' })}
                onReroll={() => dispatch({ type: 'REROLL_SCENARIO' })}
                onReadyToDraw={() => dispatch({ type: 'PROCEED_TO_DRAW' })}
              />
            )}

            {state.screen === 'DRAW' && state.currentScenario && (
              <DrawScreen
                scenario={state.currentScenario}
                onSubmitDoodle={handleSubmitDoodle}
              />
            )}

            {state.screen === 'COVER_B' && (
              <CoverBScreen
                roundNumber={state.roundNumber}
                onProceed={() => dispatch({ type: 'PROCEED_TO_INTERPRETING' })}
              />
            )}

            {state.screen === 'INTERPRETING' && state.currentPersona && (
              <InterpretingScreen
                persona={state.currentPersona}
                isScoring={Boolean(state.guessText)}
              />
            )}

            {state.screen === 'RELAY_GUESS' && state.currentPersona && state.currentConstraint && (
              <RelayGuessScreen
                relayText={state.relayText}
                persona={state.currentPersona}
                constraint={state.currentConstraint}
                guessText={state.guessText}
                onChangeGuess={(val) => dispatch({ type: 'SET_GUESS_TEXT', guessText: val })}
                onSubmitGuess={() => dispatch({ type: 'SUBMIT_GUESS_START' })}
                isSubmitting={state.isAnalyzing}
              />
            )}

            {state.screen === 'RESULT' && state.latestResult && (
              <ResultScreen
                result={state.latestResult}
                isGameOver={Boolean(state.gameOutcome)}
                gameOutcome={state.gameOutcome}
                onProceed={() => dispatch({ type: 'PROCEED_FROM_RESULT' })}
                triggerBridgeCollapse={triggerBridgeCollapse}
              />
            )}

            {state.screen === 'END' && state.gameOutcome && (
              <EndScreen
                outcome={state.gameOutcome}
                rounds={state.roundNumber}
                history={state.history}
                onPlayAgain={() => dispatch({ type: 'START_GAME' })}
                onGoHome={() => dispatch({ type: 'GO_HOME' })}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
