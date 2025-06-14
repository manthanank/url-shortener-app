import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CreateShortenedUrlRequest, ShortenedUrl, ShortenedUrlsResponse } from '../models/url.model';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Url } from '../services/url';

@Component({
  selector: 'app-shorten',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './shorten.html',
  styleUrl: './shorten.css',
})
export class Shorten implements OnInit, OnDestroy {
  shortUrl = signal('');
  // Base URL for redirects (without /api)
  redirectUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/'
      : 'https://url-shortener-app-nrnh.vercel.app/';
  copyMessage = signal('');
  copyListMessage = signal('');
  urls = signal<ShortenedUrl[]>([]);
  pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  showDeleteModal = signal(false);
  showDetailsModal = signal(false);
  urlToDelete = signal('');
  copyIndex = signal(-1);
  selectedUrl = signal<ShortenedUrl>({} as ShortenedUrl);
  isLoading = signal(false);
  isListLoading = signal(false);
  error = signal('');
  errorMsg = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  searchTerm = signal('');
  includeExpired = signal(false);

  urlForm: FormGroup = new FormGroup({});
  private unsubscribe$: Subject<void> = new Subject<void>();

  urlService = inject(Url);

  ngOnInit() {
    this.urlForm = new FormGroup({
      originalUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('^(http|https)://.*$'),
      ]),
      customShortUrl: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9]*$'),
      ]),
    });
    this.getAllUrls();
  }
  shortenUrl() {
    if (this.urlForm.valid) {
      const request: CreateShortenedUrlRequest = {
        originalUrl: this.urlForm.value.originalUrl,
        ...(this.urlForm.value.customShortUrl && { customShortUrl: this.urlForm.value.customShortUrl })
      };

      console.log('Submitting request:', request); // Debug log

      this.urlService
        .shortenUrl(request)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response) => {
            console.log('Response received:', response); // Debug log
            // Store just the short code, not the full URL
            this.shortUrl.set(response.shortUrl);
            this.urlForm.reset();
            this.errorMsg.set('');
            this.getAllUrls();
          },
          error: (error) => {
            console.error('Error shortening URL: ', error);
            this.errorMsg.set(error?.error?.message || 'An error occurred!');
          },
        });
    } else {
      console.log('Form is invalid:', this.urlForm.errors); // Debug log
    }
  }

  refreshData() {
    this.getAllUrls();
  }

  getAllUrls() {
    this.isListLoading.set(true);
    this.urlService
      .getAllUrls(
        this.currentPage(),
        this.pageSize(),
        this.sortBy(),
        this.sortOrder(),
        this.includeExpired(),
        this.searchTerm() || undefined
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ShortenedUrlsResponse) => {
          this.urls.set(response.urls);
          this.pagination.set(response.pagination);
          this.isListLoading.set(false);
          this.error.set('');
        },
        error: (error) => {
          console.error('Error getting all URLs: ', error);
          this.isListLoading.set(false);
          this.error.set(error?.error?.message || 'An error occurred!');
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.getAllUrls();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.getAllUrls();
  }

  onSortChange(sortBy: string, sortOrder: 'asc' | 'desc') {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
    this.currentPage.set(1);
    this.getAllUrls();
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.getAllUrls();
  }

  toggleIncludeExpired() {
    this.includeExpired.set(!this.includeExpired());
    this.currentPage.set(1);
    this.getAllUrls();
  }

  showDetails(shortUrl: string) {
    this.showDetailsModal.set(true);
    this.getDetails(shortUrl);
  }

  getDetails(shortUrl: string) {
    this.isLoading.set(true);
    this.urlService
      .getDetails(shortUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
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
      .writeText(`${this.redirectUrl}${url}`)
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
      .writeText(`${this.redirectUrl}${url}`)
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

  prepareDelete(shortUrl: string) {
    this.urlToDelete.set(shortUrl);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    this.showDeleteModal.set(false);
    this.deleteUrl(this.urlToDelete());
  }

  deleteUrl(shortUrl: string) {
    this.urlService
      .deleteUrl(shortUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.getAllUrls();
          this.error.set('');
        },
        error: (error) => {
          console.error('Error deleting URL: ', error);
          this.error.set(error?.error?.message || 'An error occurred!');
        },
      });
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedUrl.set({} as ShortenedUrl);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.urlToDelete.set('');
  }

  getFullShortUrl(shortUrl: string): string {
    return `${this.redirectUrl}${shortUrl}`;
  }

  isUrlExpired(url: ShortenedUrl): boolean {
    return (
      url.isExpired ||
      (url.expirationDate ? new Date(url.expirationDate) < new Date() : false)
    );
  }

  getDaysUntilExpiration(url: ShortenedUrl): number | null {
    if (!url.expirationDate) return null;
    const expirationDate = new Date(url.expirationDate);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  onSortOrderChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onSortChange(this.sortBy(), target.value as 'asc' | 'desc');
  }

  onSortByChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onSortChange(target.value, this.sortOrder());
  }

  onPageSizeSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onPageSizeChange(+target.value);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onSearchChange(target.value);
  }

  Math = Math; // Make Math available in template

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
