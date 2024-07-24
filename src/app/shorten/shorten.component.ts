import { Component, OnInit } from '@angular/core';
import { UrlService } from '../services/url.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Url } from '../models/url.model';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.scss',
})
export class ShortenComponent implements OnInit {
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
  isLoading = false;
  isloading = false;
  error: string = '';
  errorMsg: string = '';
  urlForm: FormGroup = new FormGroup({});
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private urlService: UrlService) {}

  ngOnInit() {
    this.urlForm = new FormGroup({
      originalUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('^(http|https)://.*$'),
      ]),
    });
    this.getAllUrls();
  }

  shortenUrl() {
    if (this.urlForm.valid) {
      this.urlService.shortenUrl(this.urlForm.value.originalUrl).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response) => {
          // console.log('Shortened URL: ', response);
          this.shortUrl = response.shortUrl;
          this.getAllUrls();
        },
        error: (error) => {
          console.error('Error shortening URL: ', error);
          this.errorMsg = error?.error?.message || 'An error occurred!';
        },
      });
    }
  }

  getAllUrls() {
    this.isloading = true;
    this.urlService.getAllUrls().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response) => {
        // console.log('All URLs: ', response);
        this.urls = response;
        this.isloading = false;
      },
      error: (error) => {
        console.error('Error getting all URLs: ', error);
        this.isloading = false;
        this.error = error?.error?.message || 'An error occurred!';
      },
    });
  }

  showDetails(id: string) {
    this.showDetailsModal = true;
    this.getDetails(id);
  }

  getDetails(id: string) {
    this.isLoading = true;
    this.urlService.getDetails(id).subscribe({
      next: (response) => {
        // console.log('URL Details: ', response);
        this.selectedUrl = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting URL details: ', error);
        this.error = error?.error?.message || 'An error occurred!';
      },
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
    this.urlService.deleteUrl(id).subscribe({
      next: (response) => {
        // console.log('Deleted URL: ', response);
        this.getAllUrls();
      },
      error: (error) => {
        console.error('Error deleting URL: ', error);
        this.error = error?.error?.message || 'An error occurred!';
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
