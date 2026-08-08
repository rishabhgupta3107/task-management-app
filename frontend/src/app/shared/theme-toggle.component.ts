import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button class="theme-toggle" (click)="theme.toggle()"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
      <span class="track">
        <span class="thumb" [class.light]="theme.theme() === 'light'">
          <mat-icon>{{ theme.theme() === 'dark' ? 'dark_mode' : 'light_mode' }}</mat-icon>
        </span>
      </span>
    </button>
  `,
  styles: [
    `
      .theme-toggle {
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
      }
      .track {
        display: inline-flex;
        align-items: center;
        width: 56px;
        height: 30px;
        padding: 3px;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
        background: var(--bg-elev-2);
        transition: background var(--dur-2) var(--ease);
      }
      .thumb {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(180deg, var(--accent), var(--accent-2));
        color: var(--accent-ink);
        transform: translateX(0);
        transition: transform var(--dur-2) var(--ease);
      }
      .thumb.light {
        transform: translateX(26px);
      }
      .thumb mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}
}
