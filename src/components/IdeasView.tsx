import React, { useState } from 'react';
import { Plus, Search, X, Calendar, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format } from 'date-fns';
import { TaskType } from '../types';

export const IdeasView: React.FC = () => {
  const { state, addIdea, deleteIdea, archiveIdea, convertIdeaToTask } = useAppState();
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [newIdeaTags, setNewIdeaTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConvertMenu, setShowConvertMenu] = useState<string | null>(null);

  const handleAddIdea = () => {
    if (!newIdeaContent.trim()) return;

    const tags = newIdeaTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addIdea(newIdeaContent, tags);
    setNewIdeaContent('');
    setNewIdeaTags('');
  };

  const handleConvertToTask = (ideaId: string, taskType: TaskType) => {
    convertIdeaToTask(ideaId, taskType);
    setShowConvertMenu(null);
  };

  const filteredIdeas = state.ideas.filter(idea => {
    if (idea.isArchived) return false;
    if (!searchQuery) return true;
    return idea.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getTag = (tagId: string) => state.tags.find(t => t.id === tagId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ideas & Notes</h1>

      {/* Add New Idea */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <textarea
          value={newIdeaContent}
          onChange={(e) => setNewIdeaContent(e.target.value)}
          placeholder="Capture your idea, thought, or note..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <div className="mt-3 flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newIdeaTags}
              onChange={(e) => setNewIdeaTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddIdea}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Idea
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.map(idea => (
          <div key={idea.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-800 flex-1">{idea.content}</p>
              <button
                onClick={() => deleteIdea(idea.id)}
                className="text-gray-400 hover:text-red-600 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={16} />
                  {format(idea.createdAt, 'MMM d, yyyy h:mm a')}
                </div>

                {idea.tags.length > 0 && (
                  <div className="flex gap-2">
                    {idea.tags.map(tagId => {
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

              <div className="flex gap-2">
                <button
                  onClick={() => archiveIdea(idea.id)}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:border-gray-400"
                >
                  Archive
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowConvertMenu(showConvertMenu === idea.id ? null : idea.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-300 hover:border-blue-400 flex items-center gap-1"
                  >
                    <ArrowRight size={16} />
                    Convert to Task
                  </button>

                  {showConvertMenu === idea.id && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                      <div className="p-2">
                        <button
                          onClick={() => handleConvertToTask(idea.id, 'scheduled')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          Scheduled Task (Calendar)
                        </button>
                        <button
                          onClick={() => handleConvertToTask(idea.id, 'deadline')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          Deadline Task (Kanban)
                        </button>
                        <button
                          onClick={() => handleConvertToTask(idea.id, 'checklist')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          Checklist Item
                        </button>
                        <button
                          onClick={() => handleConvertToTask(idea.id, 'someday')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          Someday/Maybe
                        </button>
                        <button
                          onClick={() => archiveIdea(idea.id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
                        >
                          Mark as Distraction
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No ideas match your search' : 'No ideas yet. Start capturing your thoughts above!'}
          </div>
        )}
      </div>
    </div>
  );
};
