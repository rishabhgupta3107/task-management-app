import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  editing = false;
  saving = false;
  message = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      fullName: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.email]],
      dob: [null],
      title: ['', [Validators.maxLength(100)]],
      bio: ['', [Validators.maxLength(500)]],
      timezone: ['', [Validators.maxLength(64)]],
      avatarUrl: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (p) => {
        this.profile = p;
        this.patch(p);
      },
    });
  }

  get liveAvatar(): string | undefined {
    return this.editing ? this.form.value.avatarUrl : this.profile?.avatarUrl;
  }

  get memberSince(): string {
    if (!this.profile?.createdAt) return '—';
    return new Date(this.profile.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  }

  startEdit(): void {
    if (this.profile) this.patch(this.profile);
    this.editing = true;
    this.message = '';
  }

  cancel(): void {
    this.editing = false;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const v = this.form.value;
    this.userService
      .updateMe({
        fullName: v.fullName || undefined,
        email: v.email || undefined,
        dob: v.dob ? this.toIso(v.dob) : undefined,
        title: v.title || undefined,
        bio: v.bio || undefined,
        timezone: v.timezone || undefined,
        avatarUrl: v.avatarUrl || undefined,
      })
      .subscribe({
        next: (p) => {
          this.profile = p;
          this.saving = false;
          this.editing = false;
          this.message = 'Profile updated.';
        },
        error: () => {
          this.saving = false;
          this.message = 'Could not save. Please try again.';
        },
      });
  }

  private patch(p: UserProfile): void {
    this.form.patchValue({
      fullName: p.fullName ?? '',
      email: p.email ?? '',
      dob: p.dob ? new Date(p.dob) : null,
      title: p.title ?? '',
      bio: p.bio ?? '',
      timezone: p.timezone ?? '',
      avatarUrl: p.avatarUrl ?? '',
    });
  }

  private toIso(date: Date | string): string {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
