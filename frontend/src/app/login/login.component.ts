import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(
      () => {
        this.router.navigate(['/tasks']);
      },
      error => {
        if(error.status === 401) {
          this.errorMessage = 'Ex ka number yaad rehta hai tumhe, lekin tumhara password nahi';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    );
  }
}
