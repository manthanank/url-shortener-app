import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
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
