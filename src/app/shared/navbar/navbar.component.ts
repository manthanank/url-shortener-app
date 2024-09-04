import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentTheme: string = localStorage.getItem('theme') || 'light';

  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = localStorage.getItem('theme') || 'light';
  }
}
