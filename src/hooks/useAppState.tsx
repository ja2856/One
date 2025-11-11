import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Idea, Task, Tag, TaskType } from '../types';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';
import { getTagColor } from '../utils/helpers';

interface AppContextType {
  state: AppState;
  addIdea: (content: string, tagNames: string[]) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  archiveIdea: (id: string) => void;
  convertIdeaToTask: (ideaId: string, taskType: TaskType) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'isArchived'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  archiveTask: (id: string) => void;
  getOrCreateTag: (name: string) => string;
  searchIdeas: (query: string, tagIds?: string[]) => Idea[];
  searchTasks: (query: string, tagIds?: string[]) => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadFromStorage();
    return loaded || { ideas: [], tasks: [], tags: [] };
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const getOrCreateTag = (name: string): string => {
    const existing = state.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;

    const newTag: Tag = {
      id: generateId(),
      name,
      color: getTagColor(state.tags.length),
    };

    setState(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
    return newTag.id;
  };

  const addIdea = (content: string, tagNames: string[]) => {
    const tagIds = tagNames.map(name => getOrCreateTag(name));
    const newIdea: Idea = {
      id: generateId(),
      content,
      createdAt: new Date(),
      tags: tagIds,
      isArchived: false,
    };
    setState(prev => ({ ...prev, ideas: [newIdea, ...prev.ideas] }));
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setState(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === id ? { ...idea, ...updates } : idea
      ),
    }));
  };

  const deleteIdea = (id: string) => {
    setState(prev => ({
      ...prev,
      ideas: prev.ideas.filter(idea => idea.id !== id),
    }));
  };

  const archiveIdea = (id: string) => {
    updateIdea(id, { isArchived: true });
  };

  const convertIdeaToTask = (ideaId: string, taskType: TaskType) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const newTask: Task = {
      id: generateId(),
      title: idea.content.slice(0, 100),
      description: idea.content,
      type: taskType,
      createdAt: new Date(),
      tags: idea.tags,
      isCompleted: false,
      isArchived: false,
      sourceIdeaId: ideaId,
      kanbanColumn: taskType === 'deadline' ? 'todo' : undefined,
    };

    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'isArchived'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      isCompleted: false,
      isArchived: false,
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
    }));
  };

  const toggleTaskComplete = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      ),
    }));
  };

  const archiveTask = (id: string) => {
    updateTask(id, { isArchived: true });
  };

  const searchIdeas = (query: string, tagIds?: string[]): Idea[] => {
    const lowerQuery = query.toLowerCase();
    return state.ideas.filter(idea => {
      const matchesQuery = !query || idea.content.toLowerCase().includes(lowerQuery);
      const matchesTags = !tagIds || tagIds.length === 0 ||
        tagIds.some(tagId => idea.tags.includes(tagId));
      return matchesQuery && matchesTags && !idea.isArchived;
    });
  };

  const searchTasks = (query: string, tagIds?: string[]): Task[] => {
    const lowerQuery = query.toLowerCase();
    return state.tasks.filter(task => {
      const matchesQuery = !query ||
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery);
      const matchesTags = !tagIds || tagIds.length === 0 ||
        tagIds.some(tagId => task.tags.includes(tagId));
      return matchesQuery && matchesTags && !task.isArchived;
    });
  };

  const value: AppContextType = {
    state,
    addIdea,
    updateIdea,
    deleteIdea,
    archiveIdea,
    convertIdeaToTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    archiveTask,
    getOrCreateTag,
    searchIdeas,
    searchTasks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
