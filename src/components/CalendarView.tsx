import React, { useState } from 'react';
import { Plus, Check, X, Clock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format, startOfWeek, addDays, isSameDay, startOfDay } from 'date-fns';

export const CalendarView: React.FC = () => {
  const { state, addTask, toggleTaskComplete, deleteTask } = useAppState();
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('09:00');
  const [newTaskDuration, setNewTaskDuration] = useState(60);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const scheduledTasks = state.tasks.filter(
    task => task.type === 'scheduled' && task.scheduledDate && !task.isArchived
  );

  const getTasksForDay = (date: Date) => {
    return scheduledTasks.filter(task =>
      task.scheduledDate && isSameDay(startOfDay(task.scheduledDate), startOfDay(date))
    ).sort((a, b) => {
      const timeA = a.scheduledTime || '00:00';
      const timeB = b.scheduledTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !selectedDate) return;

    addTask({
      title: newTaskTitle,
      description: '',
      type: 'scheduled',
      tags: [],
      scheduledDate: selectedDate,
      scheduledTime: newTaskTime,
      duration: newTaskDuration,
    });

    setNewTaskTitle('');
    setShowAddTask(false);
    setSelectedDate(null);
  };

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendar - Scheduled Tasks</h1>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {weekDays.map(day => {
          const tasks = getTasksForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`bg-white rounded-lg shadow-md p-4 min-h-[300px] ${
                isToday ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="mb-3">
                <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
                <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </div>
              </div>

              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-2 rounded-lg text-sm ${
                      task.isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`flex-shrink-0 mt-0.5 ${
                          task.isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                      <div className="flex-1">
                        <div className={task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}>
                          {task.title}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock size={12} />
                          {task.scheduledTime} ({task.duration}min)
                        </div>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {task.tags.map(tagId => {
                              const tag = getTag(tagId);
                              return tag ? (
                                <span
                                  key={tagId}
                                  className="px-1 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setSelectedDate(day);
                    setShowAddTask(true);
                  }}
                  className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-dashed border-blue-300"
                >
                  <Plus size={16} className="inline" /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddTask && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add Task for {format(selectedDate, 'MMM d, yyyy')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    step={15}
                    min={15}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setSelectedDate(null);
                  setNewTaskTitle('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
