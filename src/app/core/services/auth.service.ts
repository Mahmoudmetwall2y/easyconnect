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

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
}


export interface RegisterDto {
  fullName?: string | null;
  email?: string | null;
 phone?: string | null;      // بصيغة E.164 (+2010...)
  password: string;
}
export interface LoginDto {
 phone: string | null;      
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

register(dto: RegisterDto): Observable<ApiResponse<LoginResponseDto>>
   {
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.baseUrl}/register`,
      dto
    );
  }
  login(dto: LoginDto): Observable<ApiResponse<LoginResponseDto>> {
  return this.http.post<ApiResponse<LoginResponseDto>>(
    `${this.baseUrl}/login`,
    dto
  );
}

  getuser() {
    return this.http.get<ApiResponse<UserResponseDto>>(
      `${this.baseUrl}/getuser`
    );
  }

  updateUser(dto: { fullName: string; phone: string;email?:string }) {
    return this.http.put<ApiResponse<UserResponseDto>>(
      `${this.baseUrl}/update`,
      dto
    );
  }

  deleteUser() {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/delete`
    );
  }

}



