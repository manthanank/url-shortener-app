import { Component, inject, OnInit, signal } from '@angular/core';
import { UrlService } from '../services/url.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Url } from '../models/url.model';
import { environment } from '../../environments/environment';
import { DatePipe, NgClass } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgClass],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.scss',
})
export class ShortenComponent implements OnInit {
    shortUrl = signal('');
    redirectUrl = environment.apiUrl + '/';
    copyMessage = signal('');
    copyListMessage = signal('');
    urls = signal<Url[]>([]);
    showDeleteModal = signal(false);
    showDetailsModal = signal(false);
    urlToDelete = signal('');
    copyIndex = signal(-1);
    selectedUrl = signal<Url>({} as Url);
    isLoading = signal(false);
    isloading = signal(false);
    error = signal('');
    errorMsg = signal('');
    urlForm: FormGroup = new FormGroup({});
    private unsubscribe$: Subject<void> = new Subject<void>();
  
    urlService = inject(UrlService);
  
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
            this.shortUrl.set(response.shortUrl);
            this.getAllUrls();
          },
          error: (error) => {
            console.error('Error shortening URL: ', error);
            this.errorMsg.set(error?.error?.message || 'An error occurred!');
          },
        });
      }
    }
  
    refreshData() {
      this.getAllUrls();
    }
  
    getAllUrls() {
      this.isloading.set(true);
      this.urlService.getAllUrls().pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response) => {
          this.urls.set(response);
          this.isloading.set(false);
        },
        error: (error) => {
          console.error('Error getting all URLs: ', error);
          this.isloading.set(false);
          this.error.set(error?.error?.message || 'An error occurred!');
        },
      });
    }
  
    showDetails(id: string) {
      this.showDetailsModal.set(true);
      this.getDetails(id);
    }
  
    getDetails(id: string) {
      this.isLoading.set(true);
      this.urlService.getDetails(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response) => {
          this.selectedUrl.set(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error getting URL details: ', error);
          this.isLoading.set(false);
          this.error.set(error?.error?.message || 'An error occurred!');
        },
      });
    }
  
    copyUrl(url: string) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log('URL copied to clipboard!');
          this.copyMessage.set('Copied!');
          setTimeout(() => {
            this.copyMessage.set('');
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
          this.copyMessage.set('Failed to copy URL');
        });
    }
  
    copyListUrl(url: string, index: number) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log('URL copied to clipboard!');
          this.copyListMessage.set('Copied!');
          this.copyIndex.set(index);
          setTimeout(() => {
            this.copyListMessage.set('');
            this.copyIndex.set(-1);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
          this.copyListMessage.set('Failed to copy URL');
        });
    }
  
    prepareDelete(url: string) {
      this.urlToDelete.set(url);
      this.showDeleteModal.set(true);
    }
  
    confirmDelete() {
      this.showDeleteModal.set(false);
      this.deleteUrl(this.urlToDelete());
    }
  
    deleteUrl(id: string) {
      this.urlService.deleteUrl(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response) => {
          this.getAllUrls();
        },
        error: (error) => {
          console.error('Error deleting URL: ', error);
          this.error.set(error?.error?.message || 'An error occurred!');
        },
      });
    }
  
    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
