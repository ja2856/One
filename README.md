# One

A unified task and idea management application that helps you capture ideas, organize tasks, and stay productive.

## Features

### 💡 Ideas Capture
- Capture ideas, feedback, notes, and thoughts as they come
- Automatic timestamps for every entry
- Tagging system for easy organization
- Search functionality to find information quickly
- Convert ideas into tasks

### 📅 Calendar View
- Schedule tasks with specific time blocks
- Weekly calendar view
- Set duration for each task
- Track completed vs pending tasks

### 📊 Kanban Board
- Manage deadline-based tasks
- Three columns: To Do, In Progress, Done
- Visual deadline indicators (overdue, due today, upcoming)
- Move tasks between columns easily

### ✅ Checklist
- Quick checklist for small tasks
- Simple checkbox interface
- Separate completed and active tasks
- Perfect for quick to-dos

### ⏰ Someday/Maybe
- Park tasks you'd like to do in the next month
- Not time-sensitive but still important
- Move to other views when ready

### 🗄️ Archive
- Archive distractions and completed items
- Restore archived items if needed
- Keep your active workspace clean

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Build

```bash
npm run build
```

## Technology Stack

- React + TypeScript
- Vite
- Tailwind CSS
- date-fns for date handling
- lucide-react for icons
- Local Storage for data persistence

## Usage

1. **Capture Ideas**: Start in the Ideas view to capture any thoughts or notes
2. **Convert to Tasks**: When an idea becomes actionable, convert it to the appropriate task type
3. **Organize**: Use Calendar for time-blocked tasks, Kanban for deadline tasks, Checklist for quick items
4. **Archive**: Move distractions and completed items to the archive to keep your workspace clean

## Data Storage

All data is stored locally in your browser's localStorage. Your data never leaves your device.