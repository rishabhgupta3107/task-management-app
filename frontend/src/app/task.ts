export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  // The backend serializes dates as ISO 'yyyy-MM-dd' strings.
  dueDate?: string;
}

/** Mirrors Spring Data's Page<T> JSON shape (only the fields we use). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
