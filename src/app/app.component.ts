import { Component, Inject, Renderer2, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'dsa-web-app';

  isDarkMode = false;
  isLoggedIn = false;
  // isDarkMode = true; // Hard coded dark mode

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectSystemTheme();
      this.updateMode();
    } else {
      this.updateMode();
    }
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.clearToken();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }
    if (localStorage.getItem('darkMode') !== null){
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    }
  }

  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', String(this.isDarkMode));
    }
    this.updateMode();
  }

  updateMode() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
        this.renderer.addClass(document.documentElement, 'dark-mode');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
        this.renderer.removeClass(document.documentElement, 'dark-mode');
      }
    }
  }
}