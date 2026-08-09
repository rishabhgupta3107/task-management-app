import { Component, Input } from '@angular/core';
import { avatarGradient, initialsOf } from './avatar.util';

@Component({
  selector: 'app-avatar',
  template: `
    <span class="avatar" [style.width.px]="size" [style.height.px]="size"
          [style.fontSize.px]="size * 0.4">
      <img *ngIf="imageUrl" [src]="imageUrl" [alt]="name || username" (error)="imageUrl = ''" />
      <span *ngIf="!imageUrl" class="initials" [style.background]="gradient">{{ initials }}</span>
    </span>
  `,
  styles: [
    `
      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        flex: none;
        border: 1px solid var(--border-strong);
      }
      img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .initials {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        letter-spacing: 0.01em;
        font-family: var(--font-sans);
      }
    `,
  ],
})
export class AvatarComponent {
  @Input() username = '';
  @Input() name?: string;
  @Input() imageUrl?: string | null;
  @Input() size = 36;

  get initials(): string {
    return initialsOf(this.name, this.username);
  }

  get gradient(): string {
    return avatarGradient(this.username || this.name || 'helm');
  }
}
