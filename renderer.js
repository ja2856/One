const { ipcRenderer } = require('electron');

// Timer state
let timeLeft = 25 * 60; // seconds
let timerInterval = null;
let isRunning = false;
let currentMode = 'work'; // 'work', 'short-break', 'long-break'
let sessionCount = 0; // Track completed work sessions
let currentSession = 1;

// DOM elements
const timeDisplay = document.getElementById('time');
const sessionInfo = document.getElementById('session-info');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const workDurationInput = document.getElementById('workDuration');
const shortBreakDurationInput = document.getElementById('shortBreakDuration');
const longBreakDurationInput = document.getElementById('longBreakDuration');
const autoStartBreaksCheckbox = document.getElementById('autoStartBreaks');
const autoStartPomodorosCheckbox = document.getElementById('autoStartPomodoros');

// Settings
let settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  autoStartPomodoros: false
};

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('pomodoroSettings');
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
    workDurationInput.value = settings.workDuration;
    shortBreakDurationInput.value = settings.shortBreakDuration;
    longBreakDurationInput.value = settings.longBreakDuration;
    autoStartBreaksCheckbox.checked = settings.autoStartBreaks;
    autoStartPomodorosCheckbox.checked = settings.autoStartPomodoros;
  }
}

// Save settings to localStorage
function saveSettings() {
  settings.workDuration = parseInt(workDurationInput.value);
  settings.shortBreakDuration = parseInt(shortBreakDurationInput.value);
  settings.longBreakDuration = parseInt(longBreakDurationInput.value);
  settings.autoStartBreaks = autoStartBreaksCheckbox.checked;
  settings.autoStartPomodoros = autoStartPomodorosCheckbox.checked;
  localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
}

// Format time display
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
  sessionInfo.textContent = `Session ${currentSession} of 4`;
}

// Update body class for visual state
function updateBodyClass() {
  document.body.classList.remove('running', 'break');
  if (isRunning) {
    document.body.classList.add('running');
  }
  if (currentMode !== 'work') {
    document.body.classList.add('break');
  }
}

// Play notification sound
function playSound() {
  // Create a simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Show notification
function showNotification(title, body) {
  ipcRenderer.send('show-notification', { title, body });
  playSound();
}

// Start timer
function startTimer() {
  if (isRunning) {
    // Pause
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';
    timeDisplay.classList.remove('pulsing');
    updateBodyClass();
    return;
  }

  isRunning = true;
  startBtn.textContent = 'Pause';
  timeDisplay.classList.add('pulsing');
  updateBodyClass();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
      timeDisplay.classList.remove('pulsing');
      onTimerComplete();
    }
  }, 1000);
}

// Timer complete handler
function onTimerComplete() {
  if (currentMode === 'work') {
    sessionCount++;
    currentSession++;

    if (sessionCount % 4 === 0) {
      // Long break after 4 work sessions
      showNotification('Work Complete!', 'Time for a long break!');
      if (settings.autoStartBreaks) {
        setMode('long-break');
        setTimeout(() => startTimer(), 1000);
      } else {
        setMode('long-break');
      }
      currentSession = 1; // Reset session counter
    } else {
      // Short break
      showNotification('Work Complete!', 'Time for a short break!');
      if (settings.autoStartBreaks) {
        setMode('short-break');
        setTimeout(() => startTimer(), 1000);
      } else {
        setMode('short-break');
      }
    }
  } else {
    // Break complete
    showNotification('Break Complete!', 'Time to get back to work!');
    if (settings.autoStartPomodoros) {
      setMode('work');
      setTimeout(() => startTimer(), 1000);
    } else {
      setMode('work');
    }
  }

  updateBodyClass();
}

// Set mode
function setMode(mode) {
  currentMode = mode;

  // Update button states
  modeBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    }
  });

  // Set time based on mode
  switch (mode) {
    case 'work':
      timeLeft = settings.workDuration * 60;
      break;
    case 'short-break':
      timeLeft = settings.shortBreakDuration * 60;
      break;
    case 'long-break':
      timeLeft = settings.longBreakDuration * 60;
      break;
  }

  updateDisplay();
  updateBodyClass();
}

// Reset timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.textContent = 'Start';
  timeDisplay.classList.remove('pulsing');
  setMode(currentMode);
}

// Event listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!isRunning) {
      setMode(btn.dataset.mode);
    }
  });
});

// Settings inputs
[workDurationInput, shortBreakDurationInput, longBreakDurationInput,
 autoStartBreaksCheckbox, autoStartPomodorosCheckbox].forEach(input => {
  input.addEventListener('change', () => {
    saveSettings();
    if (!isRunning) {
      setMode(currentMode); // Refresh time display with new settings
    }
  });
});

// Initialize
loadSettings();
updateDisplay();
updateBodyClass();
