import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

export const ChecklistView: React.FC = () => {
  const { state, addTask, toggleTaskComplete, deleteTask } = useAppState();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const checklistTasks = state.tasks.filter(
    task => task.type === 'checklist' && !task.isArchived
  );

  const activeTasks = checklistTasks.filter(task => !task.isCompleted);
  const completedTasks = checklistTasks.filter(task => task.isCompleted);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      description: '',
      type: 'checklist',
      tags: [],
    });

    setNewTaskTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quick Checklist</h1>

      {/* Add New Task */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a quick task..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          To Do <span className="text-sm text-gray-500">({activeTasks.length})</span>
        </h2>

        <div className="space-y-2">
          {activeTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group"
            >
              <button
                onClick={() => toggleTaskComplete(task.id)}
                className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50"
              />
              <span className="flex-1 text-gray-800">{task.title}</span>

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

              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {activeTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active tasks. Add one above!
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Completed <span className="text-sm text-gray-500">({completedTasks.length})</span>
          </h2>

          <div className="space-y-2">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group"
              >
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="flex-shrink-0 w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white hover:bg-green-600"
                >
                  <Check size={16} />
                </button>
                <span className="flex-1 text-gray-500 line-through">{task.title}</span>

                {task.tags.length > 0 && (
                  <div className="flex gap-2">
                    {task.tags.map(tagId => {
                      const tag = getTag(tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-2 py-1 rounded text-xs font-medium text-white opacity-60"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
