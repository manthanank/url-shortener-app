import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactListResponse, ContactRequest, ContactResponse, ContactStatsResponse } from '../models/contact.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Contacts {
  private apiUrl = `${environment.apiUrl}/contacts`;
  private http = inject(HttpClient);

  sendMessage(contactData: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, contactData);
  }

  // Admin functions
  getAllContacts(page = 1, limit = 10, status?: string, search?: string): Observable<ContactListResponse> {
    let params: any = { page: page.toString(), limit: limit.toString() };
    if (status) params.status = status;
    if (search) params.search = search;

    return this.http.get<ContactListResponse>(this.apiUrl, { params });
  }

  getContactById(id: string): Observable<{ success: boolean; data: { contact: Contact } }> {
    return this.http.get<{ success: boolean; data: { contact: Contact } }>(`${this.apiUrl}/${id}`);
  }

  updateContactStatus(id: string, status: string, adminNotes?: string): Observable<{ success: boolean; data: { message: string; contact: Contact } }> {
    return this.http.patch<{ success: boolean; data: { message: string; contact: Contact } }>(`${this.apiUrl}/${id}`, { status, adminNotes });
  }

  deleteContact(id: string): Observable<{ success: boolean; data: { message: string } }> {
    return this.http.delete<{ success: boolean; data: { message: string } }>(`${this.apiUrl}/${id}`);
  }

  getContactStats(): Observable<ContactStatsResponse> {
    return this.http.get<ContactStatsResponse>(`${this.apiUrl}/stats`);
  }
}
