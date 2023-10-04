import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlShortenerService {

  constructor() { }

  shortenUrl(longUrl: string): string {
    // In a real app, send a request to your backend to shorten the URL.
    // For this example, generate a random short URL.
    const randomId = Math.random().toString(36).substring(7);
    return `http://example.com/${randomId}`;
  }
}
