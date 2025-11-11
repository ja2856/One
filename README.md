# Pomodoro Timer

A beautiful and functional Pomodoro timer desktop app for Mac, built with Electron.

## Features

- **Classic Pomodoro Technique**: 25-minute work sessions followed by 5-minute breaks
- **Long Breaks**: Automatic long break (15 minutes) after 4 completed work sessions
- **Native Notifications**: Get Mac notifications when timers complete
- **Audio Alerts**: Hear a gentle beep when each session ends
- **Customizable Durations**: Adjust work, short break, and long break durations
- **Auto-start Options**: Automatically start breaks or work sessions
- **Beautiful UI**: Modern gradient design with smooth animations
- **Session Tracking**: Keep track of your completed work sessions

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd One
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the app:
   ```bash
   npm start
   ```

## Usage

### Basic Controls

- **Start/Pause**: Click the "Start" button to begin the timer or pause it
- **Reset**: Click "Reset" to reset the current timer to its initial duration
- **Mode Selection**: Click "Work", "Short Break", or "Long Break" buttons to switch modes (only when timer is not running)

### Settings

Customize your Pomodoro timer in the settings panel:

- **Work Duration**: Default 25 minutes - adjust to your preference (1-60 minutes)
- **Short Break**: Default 5 minutes - adjust to your preference (1-30 minutes)
- **Long Break**: Default 15 minutes - adjust to your preference (1-60 minutes)
- **Auto-start breaks**: Automatically start break timers when work sessions complete
- **Auto-start pomodoros**: Automatically start work sessions when breaks complete

### The Pomodoro Technique

1. Start a 25-minute work session
2. Work until the timer rings
3. Take a 5-minute break
4. Repeat steps 1-3
5. After 4 work sessions, take a longer 15-minute break

## Building for Distribution

To create a distributable Mac app:

1. Install electron-builder:
   ```bash
   npm install --save-dev electron-builder
   ```

2. Add to package.json:
   ```json
   "build": {
     "appId": "com.pomodoro.timer",
     "mac": {
       "category": "public.app-category.productivity"
     }
   },
   "scripts": {
     "dist": "electron-builder"
   }
   ```

3. Build:
   ```bash
   npm run dist
   ```

## Keyboard Shortcuts

- Space: Start/Pause timer (when window is focused)
- R: Reset timer (when window is focused)

## Technology Stack

- Electron - Desktop app framework
- HTML/CSS - User interface
- JavaScript - Application logic
- Web Audio API - Sound notifications

## License

MIT