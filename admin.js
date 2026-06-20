/* =====================================================================
   admin.js  –  AL EXAM TIMER Admin Page
   Stores target datetime in localStorage so countdown.js can read it.
   If you replace localStorage with a real backend, update set/get below.
   ===================================================================== */

"use strict";

// ── STATE ─────────────────────────────────────────────────────────────
let selectedYear  = null;
let selectedMonth = null; // 0-based
let selectedDay   = null;
let viewYear      = new Date().getFullYear();
let viewMonth     = new Date().getMonth();

// ── DOM REFS ──────────────────────────────────────────────────────────
const calDaysEl        = document.getElementById("calDays");
const calMonthYearEl   = document.getElementById("calMonthYear");
const prevMonthBtn     = document.getElementById("prevMonth");
const nextMonthBtn     = document.getElementById("nextMonth");
const selectedDateDisp = document.getElementById("selectedDateDisplay");
const inputHour        = document.getElementById("inputHour");
const inputMin         = document.getElementById("inputMin");
const inputSec         = document.getElementById("inputSec");
const btnSet           = document.getElementById("btnSet");
const btnClear         = document.getElementById("btnClear");
const statusBanner     = document.getElementById("statusBanner");
const statusText       = document.getElementById("statusText");
const timerInfo        = document.getElementById("timerInfo");
const infoTarget       = document.getElementById("infoTarget");

// ── CALENDAR RENDER ───────────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function renderCalendar() {
  calMonthYearEl.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
  calDaysEl.innerHTML = "";

  const today = new Date();
  today.setHours(0,0,0,0);

  // First day of the month
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  // Days in this month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Days in previous month (for padding)
  const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();

  // Leading empty cells (prev month days)
  for (let i = 0; i < firstDay; i++) {
    const d = document.createElement("div");
    d.className = "cal-day other-month";
    d.textContent = daysInPrev - firstDay + 1 + i;
    calDaysEl.appendChild(d);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "cal-day";
    cell.textContent = d;

    const cellDate = new Date(viewYear, viewMonth, d);
    cellDate.setHours(0,0,0,0);

    if (cellDate < today) cell.classList.add("past");
    if (cellDate.getTime() === today.getTime()) cell.classList.add("today");

    if (
      selectedYear  === viewYear  &&
      selectedMonth === viewMonth &&
      selectedDay   === d
    ) {
      cell.classList.add("selected");
    }

    if (!cell.classList.contains("past")) {
      cell.addEventListener("click", () => {
        selectedYear  = viewYear;
        selectedMonth = viewMonth;
        selectedDay   = d;
        renderCalendar();
        selectedDateDisp.textContent =
          `Selected: ${MONTH_NAMES[viewMonth]} ${d}, ${viewYear}`;
      });
    }

    calDaysEl.appendChild(cell);
  }

  // Trailing empty cells (fill to complete last row)
  const total = firstDay + daysInMonth;
  const trailing = 7 - (total % 7);
  if (trailing < 7) {
    for (let i = 1; i <= trailing; i++) {
      const d = document.createElement("div");
      d.className = "cal-day other-month";
      d.textContent = i;
      calDaysEl.appendChild(d);
    }
  }
}

prevMonthBtn.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

// ── SET TIMER ─────────────────────────────────────────────────────────
btnSet.addEventListener("click", () => {
  if (!selectedYear || selectedDay === null) {
    showStatus("⚠ Please select a date on the calendar first.", "warn");
    return;
  }

  const h = parseInt(inputHour.value) || 0;
  const m = parseInt(inputMin.value)  || 0;
  const s = parseInt(inputSec.value)  || 0;

  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
    showStatus("⚠ Please enter a valid time (H: 0-23, M/S: 0-59).", "warn");
    return;
  }

  const target = new Date(selectedYear, selectedMonth, selectedDay, h, m, s);
  const now    = Date.now();

  if (target.getTime() <= now) {
    showStatus("⚠ The selected date/time is in the past. Please choose a future time.", "warn");
    return;
  }

  const totalDuration = target.getTime() - now;

  const data = {
    target:        target.getTime(),
    totalDuration: totalDuration,
    setAt:         now,
  };

  localStorage.setItem("al_exam_target", JSON.stringify(data));

  showStatus("✔ Timer set successfully! Countdown page updated.", "ok");
  infoTarget.textContent = target.toLocaleString();
  timerInfo.style.display = "block";
});

// ── CLEAR TIMER ───────────────────────────────────────────────────────
btnClear.addEventListener("click", () => {
  localStorage.removeItem("al_exam_target");
  showStatus("Timer cleared.", "neutral");
  timerInfo.style.display = "none";
});

// ── STATUS HELPER ─────────────────────────────────────────────────────
function showStatus(msg, type) {
  statusText.textContent = msg;
  statusBanner.style.borderLeftColor =
    type === "ok"      ? "#2A9D42" :
    type === "warn"    ? "#E09000" :
    type === "neutral" ? "#8E8E8E" : "#46169A";
  statusBanner.style.color =
    type === "ok"      ? "#2A9D42" :
    type === "warn"    ? "#B07000" :
    type === "neutral" ? "#8E8E8E" : "#46169A";
  statusBanner.style.background =
    type === "ok"      ? "#EAFBEE" :
    type === "warn"    ? "#FFF8E1" :
    type === "neutral" ? "#F4F4F4" : "#F0EDF9";
}

// ── LOAD EXISTING TIMER ON PAGE LOAD ─────────────────────────────────
function loadExisting() {
  const stored = localStorage.getItem("al_exam_target");
  if (!stored) return;
  const data = JSON.parse(stored);
  if (data.target > Date.now()) {
    infoTarget.textContent = new Date(data.target).toLocaleString();
    timerInfo.style.display = "block";
    showStatus("✔ Active timer loaded from storage.", "ok");
  } else {
    showStatus("Previous timer has expired.", "neutral");
  }
}

// ── INIT ──────────────────────────────────────────────────────────────
renderCalendar();
loadExisting();
