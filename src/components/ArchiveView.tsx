import React, { useState } from 'react';
import { Archive, Calendar, X } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format } from 'date-fns';

type ArchiveFilter = 'all' | 'ideas' | 'tasks';

export const ArchiveView: React.FC = () => {
  const { state, deleteIdea, deleteTask, updateIdea, updateTask } = useAppState();
  const [filter, setFilter] = useState<ArchiveFilter>('all');

  const archivedIdeas = state.ideas.filter(idea => idea.isArchived);
  const archivedTasks = state.tasks.filter(task => task.isArchived);

  const restoreIdea = (id: string) => {
    updateIdea(id, { isArchived: false });
  };

  const restoreTask = (id: string) => {
    updateTask(id, { isArchived: false });
  };

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  const showIdeas = filter === 'all' || filter === 'ideas';
  const showTasks = filter === 'all' || filter === 'tasks';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Archive className="text-gray-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Archive</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All ({archivedIdeas.length + archivedTasks.length})
        </button>
        <button
          onClick={() => setFilter('ideas')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'ideas'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Ideas ({archivedIdeas.length})
        </button>
        <button
          onClick={() => setFilter('tasks')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'tasks'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tasks ({archivedTasks.length})
        </button>
      </div>

      {/* Archived Ideas */}
      {showIdeas && archivedIdeas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Archived Ideas</h2>
          <div className="space-y-3">
            {archivedIdeas.map(idea => (
              <div key={idea.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-700 flex-1">{idea.content}</p>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => restoreIdea(idea.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-300"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={16} />
                    {format(idea.createdAt, 'MMM d, yyyy')}
                  </div>

                  {idea.tags.length > 0 && (
                    <div className="flex gap-2">
                      {idea.tags.map(tagId => {
                        const tag = getTag(tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-2 py-1 rounded text-xs font-medium text-white opacity-70"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archived Tasks */}
      {showTasks && archivedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Archived Tasks</h2>
          <div className="space-y-3">
            {archivedTasks.map(task => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-300"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                    {task.type}
                  </span>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={16} />
                    {format(task.createdAt, 'MMM d, yyyy')}
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex gap-2">
                      {task.tags.map(tagId => {
                        const tag = getTag(tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-2 py-1 rounded text-xs font-medium text-white opacity-70"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {archivedIdeas.length === 0 && archivedTasks.length === 0 && (
        <div className="text-center py-12">
          <Archive className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No archived items yet</p>
        </div>
      )}
    </div>
  );
};
