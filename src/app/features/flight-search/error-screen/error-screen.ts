import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from '../../home/flight-search-bar/flight-search-bar';

@Component({
  selector: 'app-error-screen',
  imports: [FlightSearchBar],
  templateUrl: './error-screen.html',
  styleUrl: './error-screen.css'
})
export class ErrorScreen {

  constructor(private router: Router) {}

  retry() {
  const params = {
    origin: sessionStorage.getItem('selectedFrom') ? JSON.parse(sessionStorage.getItem('selectedFrom')!)?.iataCode : null,
    destination: sessionStorage.getItem('selectedTo') ? JSON.parse(sessionStorage.getItem('selectedTo')!)?.iataCode : null,
    departureDate: sessionStorage.getItem('depDate'),
    returnDate: sessionStorage.getItem('retDate'),
    adults: Number(sessionStorage.getItem('adults') || 1),
    children: Number(sessionStorage.getItem('children') || 0),
    infants: Number(sessionStorage.getItem('infants') || 0),
    travelClass: sessionStorage.getItem('travelClass'),
    includeBaggage: sessionStorage.getItem('includeBaggage') === '1'
  };

  this.router.navigate(['/search'], { state: params });
}


  goHome() {
    this.router.navigate(['/']);
  }
}
