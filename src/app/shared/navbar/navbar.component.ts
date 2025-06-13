import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  currentTheme = signal(localStorage.getItem('theme') || 'light');
  showMobileMenu = signal(false);

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme.set(localStorage.getItem('theme') || 'light');
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }
}
