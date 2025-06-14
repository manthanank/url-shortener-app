import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateShortenedUrlRequest, ApiResponse, ShortenedUrlsResponse, ShortenedUrlAnalytics, SystemStats, ShortenedUrl } from '../models/url.model';

@Injectable({
  providedIn: 'root',
})
export class Url {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  shortenUrl(request: CreateShortenedUrlRequest): Observable<ShortenedUrl> {
    return this.http
      .post<ApiResponse<ShortenedUrl>>(`${this.apiUrl}/shorten`, request)
      .pipe(map((response) => response.data));
  }

  getAllUrls(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    includeExpired: boolean = false,
    search?: string
  ): Observable<ShortenedUrlsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('includeExpired', includeExpired.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<ApiResponse<ShortenedUrlsResponse>>(`${this.apiUrl}/urls`, { params })
      .pipe(map((response) => response.data));
  }

  getDetails(shortUrl: string): Observable<ShortenedUrl> {
    return this.http
      .get<ApiResponse<ShortenedUrl>>(`${this.apiUrl}/details/${shortUrl}`)
      .pipe(map((response) => response.data));
  }

  getAnalytics(shortUrl: string): Observable<ShortenedUrlAnalytics> {
    return this.http
      .get<ApiResponse<ShortenedUrlAnalytics>>(`${this.apiUrl}/analytics/${shortUrl}`)
      .pipe(map((response) => response.data));
  }

  deleteUrl(shortUrl: string): Observable<{ shortUrl: string }> {
    return this.http
      .delete<ApiResponse<{ shortUrl: string }>>(
        `${this.apiUrl}/delete/${shortUrl}`
      )
      .pipe(map((response) => response.data));
  }

  // Admin endpoints
  getSystemStats(): Observable<SystemStats> {
    return this.http
      .get<ApiResponse<SystemStats>>(
        `${this.apiUrl.replace('/api', '/admin')}/stats`
      )
      .pipe(map((response) => response.data));
  }

  triggerCleanup(): Observable<{ cleanedCount: number }> {
    return this.http
      .post<ApiResponse<{ cleanedCount: number }>>(
        `${this.apiUrl.replace('/api', '/admin')}/cleanup`,
        {}
      )
      .pipe(map((response) => response.data));
  }

  getSystemHealth(): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl.replace('/api', '/admin')}/health`)
      .pipe(map((response) => response.data));
  }

  // Basic health check
  healthCheck(): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl.replace('/api', '')}/health`)
      .pipe(map((response) => response.data));
  }
}
