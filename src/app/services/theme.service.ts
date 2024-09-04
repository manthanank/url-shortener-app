import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeClass = 'dark';
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    this.setTheme(theme);
  }

  public toggleTheme() {
    const currentTheme = localStorage.getItem('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      this.renderer.addClass(document.documentElement, this.darkThemeClass);
      this.renderer.setStyle(document.body, 'background-color', 'rgb(31 41 55)'); // dark background color
    } else {
      this.renderer.removeClass(document.documentElement, this.darkThemeClass);
      this.renderer.setStyle(document.body, 'background-color', 'rgb(255 255 255)'); // light background color
    }
  }
}
