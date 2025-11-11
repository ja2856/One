import React, { useState } from 'react';
import { Plus, X, Calendar, AlertCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '../types';

type KanbanColumn = 'todo' | 'in-progress' | 'done';

export const KanbanView: React.FC = () => {
  const { state, addTask, updateTask, deleteTask } = useAppState();
  const [showAddTask, setShowAddTask] = useState<KanbanColumn | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const deadlineTasks = state.tasks.filter(
    task => task.type === 'deadline' && !task.isArchived
  );

  const getTasksByColumn = (column: KanbanColumn): Task[] => {
    return deadlineTasks.filter(task => task.kanbanColumn === column);
  };

  const handleAddTask = (column: KanbanColumn) => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      type: 'deadline',
      tags: [],
      deadline: newTaskDeadline ? new Date(newTaskDeadline) : undefined,
      kanbanColumn: column,
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDeadline('');
    setShowAddTask(null);
  };

  const moveTask = (taskId: string, newColumn: KanbanColumn) => {
    updateTask(taskId, { kanbanColumn: newColumn });
  };

  const getDeadlineStatus = (deadline?: Date) => {
    if (!deadline) return null;
    if (isPast(deadline) && !isToday(deadline)) {
      return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
    }
    if (isToday(deadline)) {
      return { text: 'Due Today', color: 'text-orange-600 bg-orange-50' };
    }
    return { text: format(deadline, 'MMM d'), color: 'text-gray-600 bg-gray-50' };
  };

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  const renderColumn = (column: KanbanColumn, title: string) => {
    const tasks = getTasksByColumn(column);

    return (
      <div className="flex-1 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title} <span className="text-sm text-gray-500">({tasks.length})</span>
          </h2>
          <button
            onClick={() => setShowAddTask(column)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map(task => {
            const deadlineStatus = getDeadlineStatus(task.deadline);

            return (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800 flex-1">{task.title}</h3>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                )}

                {deadlineStatus && (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mb-3 ${deadlineStatus.color}`}>
                    {isPast(task.deadline!) && !isToday(task.deadline!) && (
                      <AlertCircle size={12} />
                    )}
                    <Calendar size={12} />
                    {deadlineStatus.text}
                  </div>
                )}

                {task.tags.length > 0 && (
                  <div className="flex gap-2 mb-3">
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

                <div className="flex gap-2">
                  {column !== 'todo' && (
                    <button
                      onClick={() => moveTask(task.id, column === 'in-progress' ? 'todo' : 'in-progress')}
                      className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-gray-300"
                    >
                      ← {column === 'in-progress' ? 'To Do' : 'In Progress'}
                    </button>
                  )}
                  {column !== 'done' && (
                    <button
                      onClick={() => moveTask(task.id, column === 'todo' ? 'in-progress' : 'done')}
                      className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded border border-blue-300"
                    >
                      {column === 'todo' ? 'Start' : 'Complete'} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {showAddTask === column && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)..."
                className="w-full p-2 border border-gray-300 rounded mb-2 resize-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddTask(column)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddTask(null);
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                    setNewTaskDeadline('');
                  }}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kanban - Deadline Tasks</h1>

      <div className="flex gap-6">
        {renderColumn('todo', 'To Do')}
        {renderColumn('in-progress', 'In Progress')}
        {renderColumn('done', 'Done')}
      </div>
    </div>
  );
};
