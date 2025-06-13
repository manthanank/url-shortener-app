import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { UrlService } from '../services/url.service';
import { UrlAnalytics, SystemStats } from '../models/url.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analytics',
  imports: [DatePipe, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  systemStats = signal<SystemStats | null>(null);
  urlAnalytics = signal<UrlAnalytics | null>(null);
  shortUrlInput = signal('');
  isLoading = signal(false);
  isStatsLoading = signal(false);
  error = signal('');
  statsError = signal('');

  private unsubscribe$: Subject<void> = new Subject<void>();
  urlService = inject(UrlService);

  ngOnInit() {
    this.loadSystemStats();
  }

  loadSystemStats() {
    this.isStatsLoading.set(true);
    this.urlService
      .getSystemStats()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (stats) => {
          this.systemStats.set(stats);
          this.isStatsLoading.set(false);
          this.statsError.set('');
        },
        error: (error) => {
          console.error('Error loading system stats:', error);
          this.isStatsLoading.set(false);
          this.statsError.set(
            error?.error?.message || 'Failed to load system statistics'
          );
        },
      });
  }

  getUrlAnalytics() {
    const shortUrl = this.shortUrlInput().trim();
    if (!shortUrl) {
      this.error.set('Please enter a short URL');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.urlService
      .getAnalytics(shortUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (analytics) => {
          this.urlAnalytics.set(analytics);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading URL analytics:', error);
          this.isLoading.set(false);
          this.error.set(error?.error?.message || 'Failed to load analytics');
          this.urlAnalytics.set(null);
        },
      });
  }

  clearAnalytics() {
    this.urlAnalytics.set(null);
    this.shortUrlInput.set('');
    this.error.set('');
  }

  refreshStats() {
    this.loadSystemStats();
  }

  getDaysUntilExpiration(analytics: UrlAnalytics): number | null {
    if (!analytics.expirationDate) return null;
    const expirationDate = new Date(analytics.expirationDate);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
