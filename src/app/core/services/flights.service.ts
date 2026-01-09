import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './auth.service';
import {PricingResponseDto} from '../../core/models/pricing-response.model'


export interface PopularAirport {
  city: string;
  airportName: string;
  iataCode: string;
  country: string;
  flagUrl: string;
}


export interface LocationResult {
  iataCode: string;
  name: string;
  countryCode: string;
  subType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightsService {

  private baseUrl = `${environment.apiBaseUrl}/Flights`;

  //  هنا هنخزن كل المطارات
  public allAirports: Record<string, any> = {};

  constructor(private http: HttpClient) {}

  searchFlights(req: any): Observable<{ data: { departures: any[], returns: any[] } }> {
    return this.http.post<{ data: { departures: any[], returns: any[] } }>(
      `${this.baseUrl}/search`,
      req
    );
  }

  //  تخزين أفضل 50 مطار
  getPopularAirports(): Observable<{ data: PopularAirport[] }> {
    return this.http.get<{ data: PopularAirport[] }>(`${this.baseUrl}/popular`)
      .pipe(
        tap(res => {
          res.data.forEach(ap => {
            this.allAirports[ap.iataCode] = ap;
          });
        })
      );
  }

  //  تخزين نتائج البحث
  searchLocations(keyword: string): Observable<{ data: LocationResult[] }> {
    return this.http.get<{ data: LocationResult[] }>(
      `${this.baseUrl}/locations?keyword=${keyword}`
    ).pipe(
      tap(res => {
        res.data.forEach(ap => {
          this.allAirports[ap.iataCode] = ap;
        });
      })
    );
  }

  getDeals(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/deals`);
  }
  getAirportsByCountry(countryCode: string) {
  return this.http.get<{ data: any[] }>(
    `${this.baseUrl}/airports?country=${countryCode}`
  ).pipe(
    tap(res => {
      res.data.forEach(ap => {
        this.allAirports[ap.iataCode] = ap;
      });
    })
  );
}
getAirportInfo(iata: string) {
  return this.http.get<{ data: any }>(`${this.baseUrl}/airport-info?iata=${iata}`);
}
loadAirportsByKeyword(keyword: string) {
  return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/locations?keyword=${keyword}`);
}
confirmPrice(payload: {
  departureOfferId: string;
  returnOfferId?: string | null;
  isRoundTrip: boolean;
}) {
  return this.http.post<ApiResponse<PricingResponseDto>>(
    `${this.baseUrl}/price-confirm`,
    payload
  );
}










}
