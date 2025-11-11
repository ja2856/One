import React, { useState } from 'react';
import { Lightbulb, Calendar, Columns, CheckSquare, Clock, Archive } from 'lucide-react';
import { AppProvider } from './hooks/useAppState';
import { IdeasView } from './components/IdeasView';
import { CalendarView } from './components/CalendarView';
import { KanbanView } from './components/KanbanView';
import { ChecklistView } from './components/ChecklistView';
import { SomedayView } from './components/SomedayView';
import { ArchiveView } from './components/ArchiveView';
import { ViewMode } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('ideas');

  const navItems: Array<{ id: ViewMode; label: string; icon: React.ReactNode }> = [
    { id: 'ideas', label: 'Ideas', icon: <Lightbulb size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'kanban', label: 'Kanban', icon: <Columns size={20} /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare size={20} /> },
    { id: 'someday', label: 'Someday', icon: <Clock size={20} /> },
    { id: 'archive', label: 'Archive', icon: <Archive size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">One</h1>
            <p className="text-sm text-gray-600">Your unified task & idea manager</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {currentView === 'ideas' && <IdeasView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'kanban' && <KanbanView />}
        {currentView === 'checklist' && <ChecklistView />}
        {currentView === 'someday' && <SomedayView />}
        {currentView === 'archive' && <ArchiveView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
