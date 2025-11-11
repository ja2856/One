import React, { useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format } from 'date-fns';
import { TaskType } from '../types';

export const SomedayView: React.FC = () => {
  const { state, addTask, updateTask, deleteTask } = useAppState();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showConvertMenu, setShowConvertMenu] = useState<string | null>(null);

  const somedayTasks = state.tasks.filter(
    task => task.type === 'someday' && !task.isArchived && !task.isCompleted
  );

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      type: 'someday',
      tags: [],
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleConvertTask = (taskId: string, newType: TaskType) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (newType === 'deadline') {
      updateTask(taskId, { type: newType, kanbanColumn: 'todo' });
    } else {
      updateTask(taskId, { type: newType });
    }

    setShowConvertMenu(null);
  };

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Someday/Maybe</h1>
      <p className="text-gray-600 mb-6">
        Tasks you'd like to do in the next month but aren't time-sensitive
      </p>

      {/* Add New Task */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Description (optional)..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
        <button
          onClick={handleAddTask}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {somedayTasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-600 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Added {format(task.createdAt, 'MMM d, yyyy')}
                </span>

                {task.tags.length > 0 && (
                  <div className="flex gap-2">
                    {task.tags.map(tagId => {
                      const tag = getTag(tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowConvertMenu(showConvertMenu === task.id ? null : task.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-300 hover:border-blue-400 flex items-center gap-1"
                >
                  <ArrowRight size={16} />
                  Move to...
                </button>

                {showConvertMenu === task.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleConvertTask(task.id, 'scheduled')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Calendar (Scheduled)
                      </button>
                      <button
                        onClick={() => handleConvertTask(task.id, 'deadline')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Kanban (Deadline)
                      </button>
                      <button
                        onClick={() => handleConvertTask(task.id, 'checklist')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Checklist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {somedayTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks yet. Add tasks you'd like to do someday!
          </div>
        )}
      </div>
    </div>
  );
};
