import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  confirmLogout(): void {
    // AuthService.logout() clears the token and redirects to /login.
    this.authService.logout();
  }

  cancelLogout(): void {
    this.router.navigate(['/tasks']);
  }
}
