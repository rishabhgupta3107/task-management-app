import { Task, TaskPriority } from '../task';

export type UrgencyBucket = 'OVERDUE' | 'TODAY' | 'SOON' | 'UPCOMING' | 'NONE';

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { HIGH: 40, MEDIUM: 22, LOW: 10 };

/** Whole days from today to the due date (negative = overdue). */
export function daysUntilDue(task: Task): number | null {
  if (!task.dueDate) {
    return null;
  }
  const due = new Date(task.dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/**
 * A 0–100 urgency score combining how close the deadline is with the task's priority. DONE tasks always score 0. This is the "what should I do next" brain.
 */
export function urgencyScore(task: Task): number {
  if (task.status === 'DONE') {
    return 0;
  }
  const days = daysUntilDue(task);
  let deadline = 20; // no due date → mild baseline
  if (days !== null) {
    if (days < 0) {
      deadline = 60 + Math.min(Math.abs(days) * 4, 40); // overdue: 60–100
    } else if (days === 0) {
      deadline = 58;
    } else {
      deadline = Math.max(6, 50 - days * 6); // sooner = higher
    }
  }
  const score = deadline + PRIORITY_WEIGHT[task.priority];
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function urgencyBucket(task: Task): UrgencyBucket {
  if (task.status === 'DONE') {
    return 'NONE';
  }
  const days = daysUntilDue(task);
  if (days === null) {
    return 'UPCOMING';
  }
  if (days < 0) {
    return 'OVERDUE';
  }
  if (days === 0) {
    return 'TODAY';
  }
  if (days <= 3) {
    return 'SOON';
  }
  return 'UPCOMING';
}

export function dueLabel(task: Task): string {
  const days = daysUntilDue(task);
  if (days === null) {
    return 'No due date';
  }
  if (days < 0) {
    return `${Math.abs(days)}d overdue`;
  }
  if (days === 0) {
    return 'Due today';
  }
  if (days === 1) {
    return 'Due tomorrow';
  }
  return `Due in ${days}d`;
}
