import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ThemeService } from '../services/theme.service';

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: string;
  keywords: string;
  run: () => void;
  when?: () => boolean;
}

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPaletteComponent {
  open = signal(false);
  query = signal('');
  activeIndex = signal(0);

  private readonly commands: Command[] = [
    {
      id: 'new',
      label: 'Create new task',
      hint: 'C',
      icon: 'add_circle',
      keywords: 'new create add task',
      run: () => this.go(['/app/board'], { new: '1' }),
      when: () => this.auth.isLoggedIn(),
    },
    {
      id: 'focus',
      label: 'Go to Focus',
      hint: 'G F',
      icon: 'bolt',
      keywords: 'focus today next urgent what to do',
      run: () => this.go(['/app/focus']),
      when: () => this.auth.isLoggedIn(),
    },
    {
      id: 'board',
      label: 'Go to Board',
      hint: 'G B',
      icon: 'grid_view',
      keywords: 'board tasks kanban list',
      run: () => this.go(['/app/board']),
      when: () => this.auth.isLoggedIn(),
    },
    {
      id: 'analytics',
      label: 'Go to Analytics',
      hint: 'G A',
      icon: 'insights',
      keywords: 'analytics charts metrics stats insights',
      run: () => this.go(['/app/analytics']),
      when: () => this.auth.isLoggedIn(),
    },
    {
      id: 'profile',
      label: 'Go to Profile',
      hint: 'G P',
      icon: 'person',
      keywords: 'profile account me settings avatar',
      run: () => this.go(['/app/profile']),
      when: () => this.auth.isLoggedIn(),
    },
    {
      id: 'theme',
      label: 'Toggle light / dark theme',
      hint: 'T',
      icon: 'contrast',
      keywords: 'theme dark light mode toggle appearance',
      run: () => this.theme.toggle(),
    },
    {
      id: 'landing',
      label: 'Go to landing page',
      hint: '',
      icon: 'rocket_launch',
      keywords: 'landing welcome home marketing',
      run: () => this.go(['/welcome']),
    },
    {
      id: 'logout',
      label: 'Sign out',
      hint: '',
      icon: 'logout',
      keywords: 'sign out logout exit leave',
      run: () => this.auth.logout(),
      when: () => this.auth.isLoggedIn(),
    },
  ];

  constructor(private router: Router, private theme: ThemeService, private auth: AuthService) {}

  get results(): Command[] {
    const q = this.query().trim().toLowerCase();
    return this.commands
      .filter((c) => (c.when ? c.when() : true))
      .filter((c) => !q || c.label.toLowerCase().includes(q) || c.keywords.includes(q));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const isToggle = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (isToggle) {
      event.preventDefault();
      this.toggle();
      return;
    }
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.runActive();
    }
  }

  toggle(): void {
    this.open() ? this.close() : this.openPalette();
  }

  openPalette(): void {
    this.query.set('');
    this.activeIndex.set(0);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  select(cmd: Command): void {
    this.close();
    cmd.run();
  }

  private move(delta: number): void {
    const len = this.results.length;
    if (!len) {
      return;
    }
    this.activeIndex.set((this.activeIndex() + delta + len) % len);
  }

  private runActive(): void {
    const cmd = this.results[this.activeIndex()];
    if (cmd) {
      this.select(cmd);
    }
  }

  private go(path: string[], queryParams?: Record<string, string>): void {
    this.router.navigate(path, queryParams ? { queryParams } : {});
  }
}
