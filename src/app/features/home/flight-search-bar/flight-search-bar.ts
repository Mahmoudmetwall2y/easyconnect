
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';
import { LocationSelector, SelectedLocation } from '../../flight-search/location-selector/location-selector';
import { PassengerSelector } from '../passenger-selector/passenger-selector';

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
  passengersSummary: string = '1 مسافر | السياحية';

  openDropdown = false;
  showDepartureCal = false;
  showReturnCal = false;

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

  onPassengersConfirmed(summary: string) {
    this.passengersSummary = summary;
  }

  searchFlights() {
    console.log('بحث عن الرحلات:', {
      from: this.selectedFrom,
      to: this.selectedTo,
      departure: this.selectedDeparture,
      return: this.selectedReturn,
      passengers: this.passengersSummary,
    });
  }
}

