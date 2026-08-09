import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TeamService } from '../services/team.service';
import { ManagerOption } from '../models/user-profile';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  submitting = false;
  managers: ManagerOption[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private teamService: TeamService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      dob: [null],
      managerUsername: [null],
    });
  }

  ngOnInit(): void {
    this.teamService.managers().subscribe({
      next: (m) => (this.managers = m),
      error: () => (this.managers = []),
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    const v = this.registerForm.value;

    this.authService
      .register({
        username: v.username,
        password: v.password,
        fullName: v.fullName || undefined,
        email: v.email || undefined,
        dob: v.dob ? this.toIso(v.dob) : undefined,
        managerUsername: v.managerUsername || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => {
          this.submitting = false;
          this.errorMessage =
            error.status === 409
              ? 'That username is already taken.'
              : 'Registration failed. Please try again.';
        },
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
