import { Component, inject, signal, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Track } from './services/track';
import { Visit } from './models/visit.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'url-shortener-app';

  meta = inject(Meta);

  private trackService = inject(Track);

  // Visitor count state
  visitorCount = signal<number>(0);
  isVisitorCountLoading = signal<boolean>(false);
  visitorCountError = signal<string | null>(null);

  constructor() {
    this.meta.addTags([
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content:
          'Easily shorten your long URLs with our simple and efficient URL shortener app.',
      },
      {
        name: 'keywords',
        content:
          'URL shortener, link shortener, shorten URL, link management, angular, nodejs. express, mongodb',
      },
      { name: 'author', content: 'Manthan Ankolekar' },
      { name: 'robots', content: 'index, follow' },
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'canonical', href: 'https://shortener-url-app.vercel.app/' },
      { property: 'og:title', content: 'Url Shortener App' },
      {
        property: 'og:description',
        content:
          'Easily shorten your long URLs with our simple and efficient URL shortener app.',
      },
      {
        property: 'og:image',
        content: 'https://shortener-url-app.vercel.app/image.jpg',
      },
      { property: 'og:url', content: 'https://shortener-url-app.vercel.app/' },
    ]);
  }

  ngOnInit(): void {
    this.trackVisit();
  }

  private trackVisit(): void {
    this.isVisitorCountLoading.set(true);
    this.visitorCountError.set(null);

    this.trackService.trackProjectVisit(this.title).subscribe({
      next: (response: Visit) => {
        this.visitorCount.set(response.uniqueVisitors);
        this.isVisitorCountLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Failed to track visit:', err);
        this.visitorCountError.set('Failed to load visitor count');
        this.isVisitorCountLoading.set(false);
      },
    });
  }
}
