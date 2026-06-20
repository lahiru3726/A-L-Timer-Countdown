/* =====================================================================
   countdown.js  –  AL EXAM TIMER (countdown side)
   Reads target datetime from localStorage (set by admin page) or
   defaults to the hardcoded date: August 10, 2026.
   Polls every second for live countdown.
   ===================================================================== */

"use strict";

// ── MOTIVATION SENTENCES (rotate every 60 s) ─────────────────────────
const MOTIVATIONS = [
  "STAY FOCUS!",
  "YOU CAN DO THIS!",
  "EVERY SECOND COUNTS!",
  "BELIEVE IN YOURSELF!",
  "HARD WORK PAYS OFF!",
  "KEEP PUSHING FORWARD!",
  "YOUR FUTURE STARTS NOW!",
  "ONE DAY CLOSER TO SUCCESS!",
  "STAY STRONG, STAY SHARP!",
  "CHAMPIONS NEVER QUIT!",
  "DREAM IT. WORK FOR IT!",
  "CONSISTENCY IS KEY!",
  "MAKE TODAY COUNT!",
  "YOUR EFFORT DEFINES YOU!",
  "FOCUS ON THE GOAL!",
];

// ── HARDCODED TARGET DATE DEFAULTS (10.08.2026) ───────────────────────
const DEFAULT_TARGET_ISO = "2026-08-10T00:00:00"; 
const DEFAULT_TARGET_MS  = new Date(DEFAULT_TARGET_ISO).getTime();
// Dynamically set total duration from the exact moment the script loads to the exam day
const DEFAULT_TOTAL_DURATION = DEFAULT_TARGET_MS - Date.now();

// ── DOM REFS ──────────────────────────────────────────────────────────
const ringProgress  = document.getElementById("ringProgress");
const rowTop        = document.getElementById("rowTop");
const rowBottom     = document.getElementById("rowBottom");
const valYear       = document.getElementById("valYear");
const valMonth      = document.getElementById("valMonth");
const valDay        = document.getElementById("valDay");
const valHour       = document.getElementById("valHour");
const valMin        = document.getElementById("valMin");
const valSec        = document.getElementById("valSec");
const motivationEl  = document.getElementById("motivation");
const navbar        = document.querySelector(".navbar");
const circleBefore  = document.querySelector(".circle-wrapper");

// Top-row separator elements
const topSeps   = document.querySelectorAll(".top-sep");
const topVals   = document.querySelectorAll(".time-value:not(.bottom-val)");
const botVals   = document.querySelectorAll(".bottom-val");
const botSeps   = document.querySelectorAll(".bottom-sep");

// SVG ring geometry (r=175 in a 400×400 viewBox)
const RADIUS         = 175;
const CIRCUMFERENCE  = 2 * Math.PI * RADIUS;
ringProgress.style.strokeDasharray  = CIRCUMFERENCE;
ringProgress.style.strokeDashoffset = CIRCUMFERENCE;  // empty on load

// ── STATE ─────────────────────────────────────────────────────────────
let totalDurationMs  = 0;   // full span from start → target
let targetTimestamp  = 0;   // epoch ms of target
let motivationIndex  = 0;
let lastMotivationMinute = -1;

// ── COLOUR INTERPOLATION ──────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0,2), 16),
    parseInt(h.substring(2,4), 16),
    parseInt(h.substring(4,6), 16),
  ];
}
function lerpColor(ratio) {
  // ratio 0 → start colour, ratio 1 → danger colour
  const start  = hexToRgb("688CD9");
  const danger = hexToRgb("8E0204");
  const r = Math.round(start[0] + (danger[0] - start[0]) * ratio);
  const g = Math.round(start[1] + (danger[1] - start[1]) * ratio);
  const b = Math.round(start[2] + (danger[2] - start[2]) * ratio);
  return `rgb(${r},${g},${b})`;
}

// ── APPLY COLOURS ─────────────────────────────────────────────────────
function applyColours(ratio) {
  const col = lerpColor(ratio);
  // navbar + circle inner bg
  if (navbar) navbar.style.backgroundColor = col;
  if (ringProgress) ringProgress.style.stroke    = col;
  if (circleBefore) circleBefore.style.setProperty("--color-ring-fill", col);

  // top row values
  topVals.forEach(el => el.style.color = col);
  topSeps.forEach(el => el.style.color = col);

  // bottom row: lerp from #6317E5 → #8E0204
  const botStart  = hexToRgb("6317E5");
  const botDanger = hexToRgb("8E0204");
  const br = Math.round(botStart[0] + (botDanger[0] - botStart[0]) * ratio);
  const bg = Math.round(botStart[1] + (botDanger[1] - botStart[1]) * ratio);
  const bb = Math.round(botStart[2] + (botDanger[2] - botStart[2]) * ratio);
  const botCol = `rgb(${br},${bg},${bb})`;
  botVals.forEach(el => el.style.color = botCol);
  botSeps.forEach(el => el.style.color = botCol);
}

// ── RING PROGRESS ─────────────────────────────────────────────────────
function setRingProgress(ratio) {
  // ratio = 0 → empty, ratio = 1 → full ring (clock fills as time passes)
  const offset = CIRCUMFERENCE * (1 - ratio);
  if (ringProgress) ringProgress.style.strokeDashoffset = offset;
}

// ── TIME BREAKDOWN ────────────────────────────────────────────────────
function breakdown(ms) {
  if (ms <= 0) return { years:0, months:0, days:0, hours:0, mins:0, secs:0 };
  const totalSecs = Math.floor(ms / 1000);
  const secs  = totalSecs % 60;
  const totalMins = Math.floor(totalSecs / 60);
  const mins  = totalMins % 60;
  const totalHours = Math.floor(totalMins / 60);
  const hours = totalHours % 24;
  const totalDays  = Math.floor(totalHours / 24);
  const years = Math.floor(totalDays / 365);
  const remDays = totalDays - years * 365;
  const months = Math.floor(remDays / 30);
  const days   = remDays - months * 30;
  return { years, months, days, hours, mins, secs };
}

// ── LAYOUT: show/hide rows based on what is non-zero ─────────────────
function pad(n) { return String(n).padStart(2, "0"); }

function updateLayout(b) {
  const hasTop = b.years > 0 || b.months > 0 || b.days > 0;

  if (hasTop) {
    if (rowTop) rowTop.classList.remove("hidden");

    // Selectively show year / month / day units + separators
    const showYear  = b.years  > 0;
    const showMonth = b.months > 0;
    const showDay   = b.days   > 0;

    const uYear = document.getElementById("unitYear");
    const uMonth = document.getElementById("unitMonth");
    const uDay = document.getElementById("unitDay");

    if (uYear) uYear.classList.toggle("hidden",  !showYear);
    if (uMonth) uMonth.classList.toggle("hidden", !showMonth);
    if (uDay) uDay.classList.toggle("hidden",   !showDay);

    // Separators: between year-month and month-day
    if (rowTop) {
      const seps = rowTop.querySelectorAll(".top-sep");
      if (seps[0]) seps[0].classList.toggle("hidden", !showYear || !showMonth);
      if (seps[1]) seps[1].classList.toggle("hidden", !(showMonth || showYear) || !showDay);
    }

    if (valYear) valYear.textContent  = pad(b.years);
    if (valMonth) valMonth.textContent = pad(b.months);
    if (valDay) valDay.textContent   = pad(b.days);

    // Bottom row uses normal smaller size
    if (rowBottom) {
      rowBottom.querySelectorAll(".bottom-val").forEach(el => {
        el.style.removeProperty("font-size");
      });
      rowBottom.querySelectorAll(".bottom-sep").forEach(el => {
        el.style.removeProperty("font-size");
      });
    }

  } else {
    // No years/months/days → hide top row, enlarge bottom row
    if (rowTop) rowTop.classList.add("hidden");

    // Upscale bottom row to match top-row font sizes
    if (rowBottom) {
      rowBottom.querySelectorAll(".bottom-val").forEach(el => {
        el.style.fontSize = "clamp(24px, 5.5vw, 85px)";
      });
      rowBottom.querySelectorAll(".bottom-sep").forEach(el => {
        el.style.fontSize = "clamp(24px, 5.5vw, 85px)";
      });
    }
  }

  if (valHour) valHour.textContent = pad(b.hours);
  if (valMin) valMin.textContent  = pad(b.mins);
  if (valSec) valSec.textContent  = pad(b.secs);
}

// ── MOTIVATION ROTATION ───────────────────────────────────────────────
function updateMotivation() {
  if (!motivationEl) return;
  const currentMinute = Math.floor(Date.now() / 60000);
  if (currentMinute !== lastMotivationMinute) {
    lastMotivationMinute = currentMinute;
    motivationEl.style.opacity = "0";
    setTimeout(() => {
      motivationEl.textContent = MOTIVATIONS[motivationIndex % MOTIVATIONS.length];
      motivationIndex++;
      motivationEl.style.opacity = "1";
    }, 500);
  }
}

// ── MAIN TICK ─────────────────────────────────────────────────────────
function tick() {
  const stored = localStorage.getItem("al_exam_target");
  
  if (!stored) {
    // FALLBACK: Use your requested 10.08.2026 date if localStorage is empty
    targetTimestamp = DEFAULT_TARGET_MS;
    totalDurationMs = DEFAULT_TOTAL_DURATION;
  } else {
    // Admin override exists in localStorage
    const data = JSON.parse(stored);
    targetTimestamp = data.target;
    totalDurationMs = data.totalDuration;
  }

  const now       = Date.now();
  const remaining = targetTimestamp - now;

  if (remaining <= 0) {
    // Timer ended
    const done = { years:0, months:0, days:0, hours:0, mins:0, secs:0 };
    updateLayout(done);
    setRingProgress(1);
    applyColours(1);
    document.body.classList.add("timer-ended");
    if (motivationEl) motivationEl.textContent = "TIME IS UP! GOOD LUCK!";
    return;
  }

  // Elapsed ratio for ring & colour (0 at start → 1 at end)
  const elapsed = totalDurationMs - remaining;
  const ratio   = totalDurationMs > 0 ? Math.min(elapsed / totalDurationMs, 1) : 0;

  const b = breakdown(remaining);
  updateLayout(b);
  setRingProgress(ratio);
  applyColours(ratio);
  updateMotivation();
}

// ── LISTEN FOR ADMIN UPDATES (cross-tab via storage event) ───────────
window.addEventListener("storage", (e) => {
  if (e.key === "al_exam_target") tick();
});

// ── INIT ──────────────────────────────────────────────────────────────
if (motivationEl) {
  motivationEl.textContent = MOTIVATIONS[0];
  motivationIndex = 1;
}
tick();
setInterval(tick, 1000);