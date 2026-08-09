import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../services/user.service';
import { ConfirmService } from '../services/confirm.service';
import { UserProfile } from '../models/user-profile';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent implements OnInit {
  profile = signal<UserProfile | null>(null);
  navOpen = signal(false);

  readonly nav = [
    { path: '/app/focus', icon: 'bolt', label: 'Focus' },
    { path: '/app/board', icon: 'grid_view', label: 'Board' },
    { path: '/app/analytics', icon: 'insights', label: 'Analytics' },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (p) => this.profile.set(p),
      error: () => this.profile.set(null),
    });
  }

  newTask(): void {
    this.router.navigate(['/app/board'], { queryParams: { new: '1' } });
  }

  openPalette(): void {
    // The global command palette listens for ⌘K on document keydown.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  }

  logout(): void {
    this.confirmService.confirm('Sign out of HELM?', 'Sign out').subscribe((ok) => {
      if (ok) {
        this.userService.clear();
        this.authService.logout();
      }
    });
  }
}
