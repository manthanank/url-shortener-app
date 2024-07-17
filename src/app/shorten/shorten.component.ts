import { Component } from '@angular/core';
import { UrlService } from '../services/url.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.scss',
})
export class ShortenComponent {
  originalUrl: string = '';
  shortUrl: string = '';
  redirectUrl = environment.apiUrl + '/';
  copyMessage: string = '';

  constructor(private urlService: UrlService) {}

  shortenUrl() {
    this.urlService.shortenUrl(this.originalUrl).subscribe((response) => {
      this.shortUrl = response.shortUrl;
    });
  }

  copyUrl(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Optional: Display a message or perform an action after successful copy
        console.log('URL copied to clipboard!');
        this.copyMessage = 'Copied!';
        setTimeout(() => {
          this.copyMessage = '';
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
        this.copyMessage = 'Failed to copy URL';
      });
  }
}
