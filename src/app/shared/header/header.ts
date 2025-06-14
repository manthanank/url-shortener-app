import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
   private themeService = inject(Theme);
  currentTheme = signal(localStorage.getItem('theme') || 'light');
  showMobileMenu = signal(false);

  constructor() {
    // Listen for theme changes and update the signal
    this.updateTheme();
  }

  private updateTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    this.currentTheme.set(theme);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.updateTheme();
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }
}
