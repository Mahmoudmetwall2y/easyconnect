import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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


  constructor(private http: HttpClient) {}

 searchFlights(req: any): Observable<{ data: { departures: any[], returns: any[] } }> {
  return this.http.post<{ data: { departures: any[], returns: any[] } }>(
    `${this.baseUrl}/search`,
    req
  );
}


  getPopularAirports(): Observable<{ data: PopularAirport[] }> {
    return this.http.get<{ data: PopularAirport[] }>(`${this.baseUrl}/popular`);
  }

  searchLocations(keyword: string): Observable<{ data: LocationResult[] }> {
    return this.http.get<{ data: LocationResult[] }>(
      `${this.baseUrl}/locations?keyword=${keyword}`
    );
}
getDeals(): Observable<{ data: any[] }> {
  return this.http.get<{ data: any[] }>(`${this.baseUrl}/deals`);
}

}
