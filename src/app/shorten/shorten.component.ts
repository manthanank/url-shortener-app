import { Component, OnInit } from '@angular/core';
import { UrlService } from '../services/url.service';
import { FormsModule } from '@angular/forms';
import { Url } from '../models/url.model';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.scss',
})
export class ShortenComponent implements OnInit {
  originalUrl: string = '';
  shortUrl: string = '';
  redirectUrl = environment.apiUrl + '/';
  copyMessage: string = '';
  copyListMessage: string = '';
  urls: Url[] = [];
  showDeleteModal = false;
  showDetailsModal = false;
  urlToDelete = '';
  copyIndex: number = -1;
  selectedUrl: Url = {} as Url;

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

  showDetails(id: string) {
    this.showDetailsModal = true;
    this.getDetails(id);
  }

  getDetails(id: string) {
    this.urlService.getDetails(id).subscribe((response) => {
      // console.log('URL Details: ', response);
      this.selectedUrl = response;
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

  copyListUrl(url: string, index: number) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Optional: Display a message or perform an action after successful copy
        console.log('URL copied to clipboard!');
        this.copyListMessage = 'Copied!';
        this.copyIndex = index;
        setTimeout(() => {
          this.copyListMessage = '';
          this.copyIndex = -1;
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
        this.copyListMessage = 'Failed to copy URL';
      });
  }

  prepareDelete(url: string) {
    this.urlToDelete = url;
    this.showDeleteModal = true;
  }

  confirmDelete() {
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
