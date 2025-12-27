import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/Leads`;

  quickRegister(dto: { email?: string | null; phone?: string | null }) {
    return this.http.post(`${this.baseUrl}/quick-register`, dto);
  }
}
