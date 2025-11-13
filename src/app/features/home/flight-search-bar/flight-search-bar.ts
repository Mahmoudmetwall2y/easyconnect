
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class FlightSearchBar implements OnInit {
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
@Input() initialFrom: any = null;
@Input() initialTo: any = null;

@Input() initialDepDate: string | null = null;
@Input() initialRetDate: string | null = null;

@Input() initialAdults: number = 1;
@Input() initialChildren: number = 0;
@Input() initialInfants: number = 0;
@Input() initialTravelClass: string = 'السياحية';

  openDropdown = false;
  showDepartureCal = false;
  showReturnCal = false;
openPassengerSelector = false;

constructor(private flightService: FlightsService, private router: Router) {
    // ✅ عند أول تحميل: لو مفيش حاجة متخزنة، نخليها "ذهاب وعودة"
    const savedType = sessionStorage.getItem('selectedTripType');
    this.selectedTripType = savedType ? savedType : 'ذهاب وعودة';
  }
ngOnInit(): void {

  // إصلاح الـ tripType
  if (!this.selectedTripType || this.selectedTripType.trim() === '') {
    this.selectedTripType = 'ذهاب وعودة';
  }
  if (this.initialFrom) this.selectedFrom = this.initialFrom;
  if (this.initialTo) this.selectedTo = this.initialTo;

  if (this.initialDepDate) {
    this.depDate = new Date(this.initialDepDate);
    this.selectedDeparture = this.depDate.toLocaleDateString('ar-EG');
  }

  if (this.initialRetDate) {
    this.retDate = new Date(this.initialRetDate);
    this.selectedReturn = this.retDate.toLocaleDateString('ar-EG');
  }

  this.adults = this.initialAdults;
  this.children = this.initialChildren;
  this.infants = this.initialInfants;
  this.travelClass = this.initialTravelClass;

  // passengersSummary!!
  this.passengersSummary = `${this.adults + this.children + this.infants} مسافر | ${this.travelClass}`;
}
  
 selectTripType(type: string) {
  this.selectedTripType = type;
  sessionStorage.setItem('selectedTripType', type); // ✅ نحفظها
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
    departureDate: this.formatDate(this.depDate),
    returnDate: this.selectedTripType === 'ذهاب فقط' ? null : this.formatDate(this.retDate),
    adults: this.adults,
    children: this.children,
    infants: this.infants,
    travelClass: this.travelClass,
    currency: 'USD'
  };

  console.log('🔍 بحث عن الرحلات:', req);

this.flightService.searchFlights(req).subscribe({
  next: (res) => {
    // ✅ خُدهم من res.data
    const departures = res?.data?.departures ?? [];
    const returns    = res?.data?.returns ?? [];

    // ✅ خزّن دايمًا Array مش undefined
    sessionStorage.setItem('departures', JSON.stringify(departures));
    sessionStorage.setItem('returns', JSON.stringify(returns));
    sessionStorage.setItem('selectedFrom', JSON.stringify(this.selectedFrom ?? null));
    sessionStorage.setItem('selectedTo', JSON.stringify(this.selectedTo ?? null));
    sessionStorage.setItem('depDate', this.formatDate(this.depDate));
sessionStorage.setItem('retDate', this.formatDate(this.retDate));

sessionStorage.setItem('adults', this.adults.toString());
sessionStorage.setItem('children', this.children.toString());
sessionStorage.setItem('infants', this.infants.toString());
sessionStorage.setItem('travelClass', this.travelClass);


    this.router.navigate(['/search'], { state: { departures, returns } });
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









}

