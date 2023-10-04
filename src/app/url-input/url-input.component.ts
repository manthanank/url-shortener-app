import { Component } from '@angular/core';
import { UrlShortenerService } from '../shared/url-shortener.service';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.scss']
})
export class UrlInputComponent {
  longUrl: string = '';
  shortUrl: string = '';

  constructor(private urlShortenerService: UrlShortenerService) {}

  shortenUrl() {
    this.shortUrl = this.urlShortenerService.shortenUrl(this.longUrl);
  }
}
