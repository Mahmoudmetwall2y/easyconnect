// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  succeeded: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface RegisterDto {
  fullName?: string | null;
  email?: string | null;
 phone?: string | null;      // بصيغة E.164 (+2010...)
  password: string;
}

export interface UserResponseDto {
  id: number;
  fullName?: string | null;
  email?: string | null;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/Users`;

  register(dto: RegisterDto): Observable<ApiResponse<UserResponseDto>> {
    return this.http.post<ApiResponse<UserResponseDto>>(
      `${this.baseUrl}/register`,
      dto
    );
  }
}



