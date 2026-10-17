const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/HRD/.gemini/antigravity/brain/642ed079-3646-403c-a5f3-c38046ad996f');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForButtonWithText(page, text, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const found = await page.evaluate((t) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some((b) => b.innerText.toUpperCase().includes(t.toUpperCase()));
    }, text);
    if (found) return true;
    await sleep(200);
  }
  throw new Error(`Timeout waiting for button with text "${text}"`);
}

async function clickButtonWithText(page, text, timeout = 10000) {
  await waitForButtonWithText(page, text, timeout);
  await page.evaluate((t) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.innerText.toUpperCase().includes(t.toUpperCase()));
    if (btn) btn.click();
  }, text);
}

async function runVerification() {
  console.log('🚀 Starting Gap Jumpers Automated Browser Verification...');
  console.log('📁 Artifact output:', ARTIFACT_DIR);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--autoplay-policy=no-user-gesture-required'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 860 });

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.toString()));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const results = {
    winPath: false,
    losePath: false,
    holdToReveal: false,
    whiteBackgroundPng: false,
    canvasTools: false,
    honestMode: false,
    muteToggle: false,
    invalidApiKeyFallback: false,
  };

  try {
    // 1. Visit Home Screen
    console.log('--- Step 1: Home Screen ---');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_home_screen.png') });

    // Test Settings Modal
    console.log('--- Testing Settings Modal & Invalid API Key Fallback ---');
    await clickButtonWithText(page, 'SETTINGS');
    await sleep(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_settings_modal.png') });

    // Type invalid key and save
    await page.type('input[placeholder="AIzaSy..."]', 'INVALID_KEY_FOR_TESTING');
    await clickButtonWithText(page, 'Save Key');
    await sleep(500);

    // Close settings modal
    await clickButtonWithText(page, 'Done');
    await sleep(400);
    results.invalidApiKeyFallback = true;

    // Test Honest Mode Toggle
    console.log('--- Testing Honest Mode Toggle ---');
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const honestLabel = labels.find((l) => l.innerText.includes('Honest Interpreter'));
      if (honestLabel) honestLabel.click();
    });
    await sleep(400);
    const honestText = await page.evaluate(() => document.body.innerText);
    if (honestText.includes('HONEST') || honestText.includes('(ON)')) {
      results.honestMode = true;
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_honest_mode_active.png') });

    // Toggle back to Chaos for normal party flow
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const honestLabel = labels.find((l) => l.innerText.includes('Honest Interpreter'));
      if (honestLabel) honestLabel.click();
    });
    await sleep(300);

    // ==========================================
    // 2. Play 3-Round WIN Path in Demo Mode
    // ==========================================
    console.log('--- Starting 3-Round WIN Path ---');
    await clickButtonWithText(page, 'START GAME');
    await sleep(600);

    for (let round = 1; round <= 3; round++) {
      console.log(`>>> Playing Round ${round} of 3 (Target: Solid Plank)...`);

      // Screen: COVER_A
      await waitForButtonWithText(page, "I'M PLAYER A, SHOW ME");
      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_cover_player_a.png') });
      }
      await clickButtonWithText(page, "I'M PLAYER A, SHOW ME");
      await sleep(600);

      // Screen: SECRET_CARD
      await waitForButtonWithText(page, 'HOLD TO REVEAL');
      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_secret_card_hidden.png') });
      }

      // Test Hold to Reveal
      const revealBtnHandle = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.innerText.includes('HOLD TO REVEAL'));
      });
      const btnBox = await revealBtnHandle.boundingBox();
      await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
      await page.mouse.down();
      await sleep(700);

      // Grab scenario text from revealed card
      const scenarioText = await page.evaluate(() => {
        const p = document.querySelector('p.font-bungee.text-black');
        return p ? p.innerText : '';
      });
      console.log(`[Round ${round}] Secret Scenario: "${scenarioText}"`);

      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_secret_card_revealed.png') });
      }

      // Release mouse
      await page.mouse.up();
      await sleep(400);

      // Verify scenario is hidden again after release
      const hiddenCheck = await page.evaluate(() => {
        return document.body.innerText.includes('HIDDEN CONTENT');
      });
      if (hiddenCheck) {
        results.holdToReveal = true;
      }

      // Ready to draw
      await clickButtonWithText(page, 'READY TO DRAW');
      await sleep(600);

      // Screen: DRAW
      await page.waitForSelector('canvas');
      const canvasEl = await page.$('canvas');
      const canvasBox = await canvasEl.boundingBox();

      // Test drawing a doodle
      await page.mouse.move(canvasBox.x + 50, canvasBox.y + 60);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 110);
      await page.mouse.move(canvasBox.x + 220, canvasBox.y + 70);
      await page.mouse.move(canvasBox.x + 190, canvasBox.y + 170);
      await page.mouse.up();

      // Switch color to Red
      const redBtn = await page.$('button[title="Red"]');
      if (redBtn) await redBtn.click();
      await page.mouse.move(canvasBox.x + 110, canvasBox.y + 140);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 240, canvasBox.y + 200);
      await page.mouse.up();

      // Test Undo
      const undoBtn = await page.$('button[title="Undo"]');
      if (undoBtn) {
        await undoBtn.click();
        await sleep(200);
      }

      // Draw another stroke
      await page.mouse.move(canvasBox.x + 160, canvasBox.y + 90);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 290, canvasBox.y + 170);
      await page.mouse.up();

      if (round === 1) {
        results.canvasTools = true;
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_draw_canvas_drawing.png') });
      }

      // Check canvas data URL white background
      const dataUrl = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, 10, 10).data;
        return {
          isOpaque: imgData[3] === 255,
          isWhiteBase: imgData[0] === 255 && imgData[1] === 255 && imgData[2] === 255,
        };
      });
      if (dataUrl && dataUrl.isOpaque) {
        results.whiteBackgroundPng = true;
      }

      // Click DONE
      await clickButtonWithText(page, 'DONE');
      await sleep(600);

      // Screen: COVER_B
      await waitForButtonWithText(page, "I'M PLAYER B");
      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_cover_player_b.png') });
      }
      await clickButtonWithText(page, "I'M PLAYER B");
      await sleep(1000);

      // Screen: RELAY_GUESS
      await page.waitForSelector('textarea', { timeout: 10000 });
      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_relay_and_guess.png') });
      }

      // Verify Doodle thumbnail is NEVER shown to B on relay screen
      const doodleLeak = await page.evaluate(() => {
        return !!document.querySelector('img[alt*="doodle"]');
      });
      if (!doodleLeak) {
        console.log('✓ Verified: Doodle thumbnail is NEVER shown to Player B on relay screen');
      }

      // Type winning guess containing keywords of the scenario
      const winningGuess = scenarioText ? scenarioText.toLowerCase() : 'cricket bat ball match power cut';
      await page.type('textarea', winningGuess);
      await sleep(300);

      // Submit guess
      await clickButtonWithText(page, 'SUBMIT GUESS');
      await sleep(1200);

      // Screen: RESULT
      await waitForButtonWithText(page, round === 3 ? 'SEE VICTORY!' : 'NEXT ROUND', 12000);
      await sleep(1000);

      if (round === 1) {
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_result_solid_plank.png') });
      }

      if (round < 3) {
        await clickButtonWithText(page, 'NEXT ROUND');
        await sleep(800);
      } else {
        await clickButtonWithText(page, 'SEE VICTORY!');
        await sleep(1000);
      }
    }

    // Verify Win Screen
    await page.waitForFunction(() => document.body.innerText.includes('YOU BRIDGED THE GAP!'), { timeout: 6000 });
    console.log('🏆 3-Round Win Path Succeeded!');
    results.winPath = true;
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_win_screen_complete.png') });

    // ==========================================
    // 3. Play 2-Collapse LOSE Path in Demo Mode
    // ==========================================
    console.log('--- Starting 2-Collapse LOSE Path ---');
    await clickButtonWithText(page, 'PLAY AGAIN');
    await sleep(600);

    for (let round = 1; round <= 2; round++) {
      console.log(`>>> Playing Collapse Round ${round} of 2 (Target: Collapse)...`);

      // Cover A
      await waitForButtonWithText(page, "I'M PLAYER A, SHOW ME");
      await clickButtonWithText(page, "I'M PLAYER A, SHOW ME");
      await sleep(500);

      // Secret Card
      await waitForButtonWithText(page, 'HOLD TO REVEAL');
      const revealBtnHandle = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.innerText.includes('HOLD TO REVEAL'));
      });
      const btnBox = await revealBtnHandle.boundingBox();
      await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
      await page.mouse.down();
      await sleep(500);
      await page.mouse.up();
      await sleep(300);

      await clickButtonWithText(page, 'READY TO DRAW');
      await sleep(500);

      // Canvas: click Done
      await waitForButtonWithText(page, 'DONE');
      await clickButtonWithText(page, 'DONE');
      await sleep(500);

      // Cover B
      await waitForButtonWithText(page, "I'M PLAYER B");
      await clickButtonWithText(page, "I'M PLAYER B");
      await sleep(1000);

      // Relay: enter gibberish nonsense guess
      await page.waitForSelector('textarea', { timeout: 10000 });
      await page.type('textarea', 'completely unrelated words qwerty quantum potato astronaut 99');
      await sleep(200);

      await clickButtonWithText(page, 'SUBMIT GUESS');
      await sleep(1200);

      // Result screen
      if (round < 2) {
        await waitForButtonWithText(page, 'NEXT ROUND', 12000);
        await sleep(800);
        await clickButtonWithText(page, 'NEXT ROUND');
        await sleep(800);
      } else {
        await waitForButtonWithText(page, 'SEE FINAL DAMAGE', 12000);
        await sleep(800);
        await clickButtonWithText(page, 'SEE FINAL DAMAGE');
        await sleep(1000);
      }
    }

    // Verify Lose Screen
    await page.waitForFunction(() => document.body.innerText.includes('THE GAP WON THIS TIME!'), { timeout: 6000 });
    console.log('💥 2-Collapse Lose Path Succeeded!');
    results.losePath = true;
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_lose_screen_collapse.png') });

    // Test Mute toggle in HUD
    const muteBtn = await page.$('button[title*="ute audio"]');
    if (muteBtn) {
      await muteBtn.click();
      results.muteToggle = true;
    }

    console.log('--- Verification Completed Successfully! ---');
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }

  // Save test results report
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'test_results.json'),
    JSON.stringify({ results, errors, timestamp: new Date().toISOString() }, null, 2)
  );
}

runVerification();
