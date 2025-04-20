import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpStatusCode, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // You can change 'username' to 'email' if your backend uses email
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialization logic here if needed
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login Response:', response); // Log the entire response object
          console.log('Response Status:', response.status); // Log the status code
          if (response.status >= 200 && response.status < 300) {
            // Attempt to parse as JSON, if fails treat as text
            try {
              JSON.parse(response.body);
              console.log('Login successful (JSON response)', response.body);
              this.router.navigate(['/']); // Redirect on successful login
            } catch (error) {
              console.log('Login successful (Text response)', response.body);
              this.router.navigate(['/']); // Redirect on successful login
            }
          } else {
            console.log('Login failed with status:', response.status);
            this.errorMessage = 'Login failed.'; // Generic error for non-2xx responses
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.error && error.error.text) {
            console.log('Login successful (Text response)', error.error.text);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Invalid username or password.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please enter your username and password.';
    }
  }
}
