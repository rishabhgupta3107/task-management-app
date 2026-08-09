import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../task';
import { dueLabel, urgencyBucket, urgencyScore } from '../services/urgency';

interface Group {
  key: string;
  label: string;
  tone: string;
  tasks: Task[];
}

@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.css'],
})
export class FocusComponent implements OnInit {
  loading = true;
  hero: Task | null = null;
  groups: Group[] = [];
  completedToday = 0;
  private all: Task[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskService.getTasks(0, 200).subscribe({
      next: (page) => {
        this.all = page.content;
        this.compute();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  score = urgencyScore;
  due = dueLabel;

  private compute(): void {
    const active = this.all.filter((t) => t.status !== 'DONE');
    const sorted = [...active].sort((a, b) => urgencyScore(b) - urgencyScore(a));
    this.hero = sorted[0] ?? null;

    const byBucket = (bucket: string) =>
      sorted.filter((t) => urgencyBucket(t) === bucket);

    this.groups = [
      { key: 'OVERDUE', label: 'Overdue', tone: 'high', tasks: byBucket('OVERDUE') },
      { key: 'TODAY', label: 'Due today', tone: 'medium', tasks: byBucket('TODAY') },
      { key: 'SOON', label: 'At risk · next 3 days', tone: 'medium', tasks: byBucket('SOON') },
      { key: 'UPCOMING', label: 'Upcoming', tone: 'low', tasks: byBucket('UPCOMING') },
    ].filter((g) => g.tasks.length > 0);

    this.completedToday = this.all.filter((t) => t.status === 'DONE').length;
  }

  open(task: Task): void {
    this.router.navigate(['/app/tasks', task.id]);
  }

  complete(task: Task, event?: Event): void {
    event?.stopPropagation();
    if (task.id === undefined || task.status === 'DONE') {
      return;
    }
    this.taskService.updateTask(task.id, { ...task, status: 'DONE' }).subscribe(() => {
      this.all = this.all.map((t) => (t.id === task.id ? { ...t, status: 'DONE' } : t));
      this.compute();
    });
  }

  get activeCount(): number {
    return this.all.filter((t) => t.status !== 'DONE').length;
  }
}
