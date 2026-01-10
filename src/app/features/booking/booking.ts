import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslationService } from '../../shared/data/translation.service';
import { PassengerForm } from './passenger-form/passenger-form';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, PassengerForm],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {

  // =====================
  // Core Data
  // =====================
  flight: any = null;
  confirmedPrice: any = null;

  travelClass: string = 'السياحية';
  tripType: string = 'ذهاب وعودة';

  // =====================
  // Passengers
  // =====================
  passengers: any[] = [];

  constructor(private router: Router,public t:TranslationService) {}

  // =====================
  // Init
  // =====================
  ngOnInit(): void {

    const flightStr = sessionStorage.getItem('selectedFlight');
    const priceStr  = sessionStorage.getItem('confirmedPrice');

    if (!flightStr || !priceStr) {
      Swal.fire({
        icon: 'warning',
        title: 'الجلسة انتهت',
        text: 'برجاء إعادة البحث عن رحلة'
      });
      this.router.navigate(['/search']);
      return;
    }

    this.flight = JSON.parse(flightStr);
    this.confirmedPrice = JSON.parse(priceStr);

    this.travelClass =
      sessionStorage.getItem('travelClass') || 'السياحية';

    this.tripType =
      sessionStorage.getItem('selectedTripType') || 'ذهاب وعودة';

    // Default Passenger
    this.passengers = [
      {
        type: 'adult',
        gender: 'male',
        firstName: '',
        lastName: '',
        birthDate: ''
      }
    ];
  }

  // =====================
  // Helpers (UI)
  // =====================

  onLogoError(event: any) {
    event.target.src = '/assets/d2.jpg';
  }


  // =====================
  // Price Helpers
  // =====================

  get currency(): string {
    return this.confirmedPrice?.currency || 'KWD';
  }

get outboundFare(): number {
  return this.confirmedPrice?.departure?.total ?? 0;
}

get returnFare(): number {
  return this.confirmedPrice?.return?.total ?? 0;
}

get taxes(): number {
  return this.confirmedPrice?.taxes ?? 0;
}

get totalPrice(): number {
  if (this.isRoundTrip) {
    return this.outboundFare + this.returnFare + this.taxes;
  }
  return this.outboundFare + this.taxes;
}



  get extras(): any[] {
    return this.confirmedPrice?.extras || [];
  }

  // =====================
  // Baggage Helpers
  // =====================

  get cabinBags(): number {
    return this.confirmedPrice?.baggage?.cabin ?? 0;
  }

  get personalBags(): number {
    return this.confirmedPrice?.baggage?.personal ?? 0;
  }

  get checkedBags(): number {
    return this.confirmedPrice?.baggage?.checked ?? 0;
  }
  get isRoundTrip(): boolean {
  return this.confirmedPrice?.isRoundTrip ?? false;
}



goToPassengers() {
  this.router.navigate(['/passengers']);
}


  // =====================
  // Trip Helpers
  // =====================

get hasReturn(): boolean {
  return this.tripType === 'ذهاب وعودة';
}


get routeTitle(): string {
  if (!this.flight) return '';
  return `الرحلة من ${this.flight.origin} إلى ${this.flight.destination} ${this.tripType}`;
}

onPassengersChange(updatedPassengers: any[]) {
  this.passengers = updatedPassengers;
}

}
