import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest, ContactResponse } from '../models/contact,model';

@Injectable({
  providedIn: 'root',
})
export class Contacts {
  private apiUrl = 'https://backend-app-manthanank.vercel.app/api/contacts';
  private http = inject(HttpClient);

  sendMessage(contactData: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, contactData);
  }
}
