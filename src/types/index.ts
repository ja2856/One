export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Idea {
  id: string;
  content: string;
  createdAt: Date;
  tags: string[]; // tag IDs
  isArchived: boolean;
}

export type TaskType = 'scheduled' | 'deadline' | 'checklist' | 'someday' | 'distraction';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  createdAt: Date;
  tags: string[]; // tag IDs
  isCompleted: boolean;
  isArchived: boolean;

  // For scheduled tasks
  scheduledDate?: Date;
  scheduledTime?: string; // HH:MM format
  duration?: number; // minutes

  // For deadline tasks
  deadline?: Date;
  kanbanColumn?: 'todo' | 'in-progress' | 'done';

  // Source idea if converted from idea
  sourceIdeaId?: string;
}

export interface AppState {
  ideas: Idea[];
  tasks: Task[];
  tags: Tag[];
}

export type ViewMode = 'ideas' | 'calendar' | 'kanban' | 'checklist' | 'someday' | 'archive';
