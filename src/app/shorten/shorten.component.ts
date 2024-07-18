import { Component, OnInit } from '@angular/core';
import { UrlService } from '../services/url.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { Url } from '../models/url.model';

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.scss',
})
export class ShortenComponent implements OnInit {
  originalUrl: string = '';
  shortUrl: string = '';
  redirectUrl = environment.apiUrl + '/';
  copyMessage: string = '';
  urls: Url[] = [];
  showDeleteModal = false;
  urlToDelete = '';

  constructor(private urlService: UrlService) {}

  ngOnInit() {
    this.getAllUrls();
  }

  shortenUrl() {
    this.urlService.shortenUrl(this.originalUrl).subscribe((response) => {
      this.shortUrl = response.shortUrl;
      // console.log('Shortened URL: ', this.shortUrl);
      this.getAllUrls();
    });
  }

  getAllUrls() {
    this.urlService.getAllUrls().subscribe((response) => {
      // console.log('All URLs: ', response);
      this.urls = response;
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

  prepareDelete(url: string) {
    this.urlToDelete = url;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    // Perform the deletion logic here using this.urlToDelete
    console.log(`Deleting URL: ${this.urlToDelete}`);
    // Close the modal
    this.showDeleteModal = false;
    // Delete the URL
    this.deleteUrl(this.urlToDelete);
  }

  deleteUrl(id: string) {
    this.urlService.deleteUrl(id).subscribe((response) => {
      // console.log('Deleted URL: ', response);
      this.getAllUrls();
    });
  }
}
