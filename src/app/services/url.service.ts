import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Url,
  ApiResponse,
  UrlsResponse,
  UrlAnalytics,
  SystemStats,
  CreateUrlRequest
} from '../models/url.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  shortenUrl(request: CreateUrlRequest): Observable<Url> {
    return this.http.post<ApiResponse<Url>>(`${this.apiUrl}/shorten`, request)
      .pipe(map(response => response.data));
  }

  getAllUrls(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    includeExpired: boolean = false,
    search?: string
  ): Observable<UrlsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('includeExpired', includeExpired.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<UrlsResponse>>(`${this.apiUrl}/urls`, { params })
      .pipe(map(response => response.data));
  }

  getDetails(shortUrl: string): Observable<Url> {
    return this.http.get<ApiResponse<Url>>(`${this.apiUrl}/details/${shortUrl}`)
      .pipe(map(response => response.data));
  }

  getAnalytics(shortUrl: string): Observable<UrlAnalytics> {
    return this.http.get<ApiResponse<UrlAnalytics>>(`${this.apiUrl}/analytics/${shortUrl}`)
      .pipe(map(response => response.data));
  }

  deleteUrl(shortUrl: string): Observable<{ shortUrl: string }> {
    return this.http.delete<ApiResponse<{ shortUrl: string }>>(`${this.apiUrl}/delete/${shortUrl}`)
      .pipe(map(response => response.data));
  }

  // Admin endpoints
  getSystemStats(): Observable<SystemStats> {
    return this.http.get<ApiResponse<SystemStats>>(`${this.apiUrl.replace('/api', '/admin')}/stats`)
      .pipe(map(response => response.data));
  }

  triggerCleanup(): Observable<{ cleanedCount: number }> {
    return this.http.post<ApiResponse<{ cleanedCount: number }>>(`${this.apiUrl.replace('/api', '/admin')}/cleanup`, {})
      .pipe(map(response => response.data));
  }

  getSystemHealth(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl.replace('/api', '/admin')}/health`)
      .pipe(map(response => response.data));
  }

  // Basic health check
  healthCheck(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl.replace('/api', '')}/health`)
      .pipe(map(response => response.data));
  }
}
