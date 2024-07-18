import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Url, Urls } from '../models/url.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  shortenUrl(originalUrl: string): Observable<Url> {
    return this.http.post<Url>(`${this.apiUrl}/shorten`, { originalUrl });
  }

  getAllUrls(): Observable<Urls> {
    return this.http.get<Urls>(`${this.apiUrl}/urls`);
  }

  deleteUrl(id: string): Observable<Url> {
    return this.http.delete<Url>(`${this.apiUrl}/delete/${id}`);
  }
}
