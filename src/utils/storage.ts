import { AppState } from '../types';

const STORAGE_KEY = 'one-app-state';

export const saveToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): AppState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Convert date strings back to Date objects
    return {
      ideas: parsed.ideas.map((idea: any) => ({
        ...idea,
        createdAt: new Date(idea.createdAt),
      })),
      tasks: parsed.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        scheduledDate: task.scheduledDate ? new Date(task.scheduledDate) : undefined,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
      })),
      tags: parsed.tags,
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
