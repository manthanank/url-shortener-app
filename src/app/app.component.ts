import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'url-shortener-app';

  meta = inject(Meta);

  constructor() {
    this.meta.addTags([
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Easily shorten your long URLs with our simple and efficient URL shortener app.' },
      { name: 'keywords', content: 'URL shortener, link shortener, shorten URL, link management, angular, nodejs. express, mongodb' },
      { name: 'author', content: 'Manthan Ankolekar' },
      { name: 'robots', content: 'index, follow' },
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'canonical', href: 'https://shortener-url-app.vercel.app/' },
      { property: 'og:title', content: 'Url Shortener App' },
      { property: 'og:description', content: 'Easily shorten your long URLs with our simple and efficient URL shortener app.' },
      { property: 'og:image', content: 'https://shortener-url-app.vercel.app/image.jpg' },
      { property: 'og:url', content: 'https://shortener-url-app.vercel.app/' }
    ]);
  }
}
