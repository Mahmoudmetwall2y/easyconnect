
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';
import { LocationSelector, SelectedLocation } from '../../flight-search/location-selector/location-selector';
import { PassengerSelector } from '../passenger-selector/passenger-selector';
import { FlightsService } from '../../../core/services/flights.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, FlightCalendar, LocationSelector, PassengerSelector],
  templateUrl: './flight-search-bar.html',
  styleUrls: ['./flight-search-bar.css']
})
export class FlightSearchBar {
  @Input() selectedTripType: string = 'ذهاب وعودة';
  @Output() tripTypeChanged = new EventEmitter<string>();

  selectedFrom: SelectedLocation | null = null;
  selectedTo: SelectedLocation | null = null;

  depDate: Date | null = null;
  retDate: Date | null = null;
  selectedDeparture: string | null = null;
  selectedReturn: string | null = null;
 passengersSummary: string = '';
adults = 1;
children = 0;
infants = 0;
travelClass = 'السياحية';


  openDropdown = false;
  showDepartureCal = false;
  showReturnCal = false;
openPassengerSelector = false;

constructor(private flightService:FlightsService,private router:Router){

}
  selectTripType(type: string) {
    this.selectedTripType = type;
    this.openDropdown = false;
    this.tripTypeChanged.emit(type);
  }

  openDepartureCal() {
    this.showReturnCal = false;
    this.showDepartureCal = true;
  }

  openReturnCal() {
    this.showDepartureCal = false;
    this.showReturnCal = true;
  }

  onDeparturePicked(date: Date) {
    this.depDate = date;
    this.selectedDeparture = date.toLocaleDateString('ar-EG');
    setTimeout(() => {
      this.showDepartureCal = false;
      setTimeout(() => (this.showReturnCal = true), 100);
    }, 0);
  }

  onReturnPicked(date: Date) {
    this.retDate = date;
    this.selectedReturn = date.toLocaleDateString('ar-EG');
    setTimeout(() => (this.showReturnCal = false), 2000);
  }

onPassengersConfirmed(data: any) {
  this.passengersSummary = data.summary;
  this.adults = data.adults;
  this.children = data.children;
  this.infants = data.infants;
  this.travelClass = data.travelClass;
  this.openPassengerSelector = false;
}



 searchFlights() {
 const req = {
    origin: this.selectedFrom?.iataCode,
    destination: this.selectedTo?.iataCode,
    departure: this.formatDate(this.depDate),
    returnDate: this.selectedTripType === 'ذهاب فقط' ? null : this.formatDate(this.retDate),
    adults: this.adults,
    children: this.children,
    infants: this.infants,
    travelClass: this.travelClass,
  };

  console.log('🔍 بحث عن الرحلات:', req);

 this.flightService.searchFlights(req).subscribe({
    next: (res) => {
      console.log('✅ النتائج:', res);

       // نجمع الرحلات المتكررة حسب رقم الرحلة والوجهة
      const groupedFlights = this.groupFlights(res.data);

      // نحفظ النتائج ونفتح صفحة النتائج
      this.router.navigate(['/search'], { state: { results: groupedFlights } });
    },
    error: (err) => {
      console.error('❌ خطأ في البحث:', err);
      alert('حدث خطأ أثناء البحث عن الرحلات.');
    },
  });
}
private formatDate(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`; // ✅ النتيجة: 2025-11-03
}
private groupFlights(flights: any[]) {
  const grouped: { [key: string]: any } = {};

  flights.forEach((flight) => {
    // مفتاح فريد حسب الرحلة
    const key = `${flight.airlineCode}-${flight.flightNumber}-${flight.origin}-${flight.destination}`;

    if (!grouped[key]) {
      grouped[key] = {
        ...flight,
        availableDates: [flight.departureTime], // نخزن المواعيد المتاحة
      };
    } else {
      // نضيف فقط التاريخ لو مش مكرر
      if (!grouped[key].availableDates.includes(flight.departureTime)) {
        grouped[key].availableDates.push(flight.departureTime);
      }
    }
  });

  // نحول الكائن لمصفوفة
  return Object.values(grouped);
}

}

