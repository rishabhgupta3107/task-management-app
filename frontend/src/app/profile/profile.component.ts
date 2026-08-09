import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserProfile, orgRoleLabel } from '../models/user-profile';

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
  roleLabel = orgRoleLabel;

  readonly timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:30', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00',
    'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45',
    'UTC+06:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00',
    'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+12:00', 'UTC+12:45',
    'UTC+13:00', 'UTC+14:00',
  ];

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

  /** Timezone list, including the user's current value if it isn't already a standard offset. */
  get timezoneOptions(): string[] {
    const current = this.profile?.timezone;
    if (current && !this.timezones.includes(current)) {
      return [current, ...this.timezones];
    }
    return this.timezones;
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
