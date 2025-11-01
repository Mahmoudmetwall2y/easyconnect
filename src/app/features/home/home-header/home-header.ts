import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';
import { FlightsService, LocationResult, PopularAirport } from '../../../core/services/flights.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { COUNTRY_CODES } from '../../../shared/data/country-codes';
import { LocationSelector, SelectedLocation } from "../../flight-search/location-selector/location-selector";
import { HeaderBanner } from "../header-banner/header-banner";

import { FlightSearchBar } from "../flight-search-bar/flight-search-bar";
import { RegisterOptions } from "../../account/register-options/register-options";
import { ExploreWorld } from "../explore-world/explore-world";

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule,ExploreWorld, FormsModule, HeaderBanner, FlightSearchBar, RegisterOptions],
  templateUrl: './home-header.html',
  styleUrls: ['./home-header.css']
})
export class HomeHeader  {
  activeTab: 'flights' | 'hotels' = 'flights';
  openDropdown = false;
  selectedTripType = 'ذهاب وعودة';
  showPassengersDropdown = false;
passengersSummary: string = '1 مسافر | السياحية';

  adults = 1;
  children = 0;
  infants = 0;
  selectedClass = 'السياحية';
  classes = ['السياحية', 'السياحية المتميزة', 'درجة رجال الأعمال', 'الدرجة الأولى'];

  // ✅ التواريخ
  showDepartureCal = false;
  showReturnCal = false;
  depDate: Date | null = null;
  retDate: Date | null = null;
  selectedDeparture: string | null = null;
  selectedReturn: string | null = null;

 // ✅ من / إلى
  selectedFrom: SelectedLocation | null = null;
  selectedTo: SelectedLocation | null = null;


  constructor(private flights: FlightsService) {}
onPassengersConfirmed(summary: string) {
  this.passengersSummary = summary;
  console.log('تم تأكيد الركاب:', summary);
}

 
  // ✅ أيقونات وأعلام
 getFlag(item: any): string {
  let code = '';

  // 🔹 لو جاية من Amadeus (countryCode)
  if ('countryCode' in item && item.countryCode) {
    code = item.countryCode.toUpperCase();
  }
  // 🔹 لو جاية من الداتا العربية (PopularAirports)
  else if ('country' in item && item.country) {
    const arabicName = item.country.trim();
    const map: Record<string, string> = {
      'الكويت': 'KW',
      'مصر': 'EG',
      'الإمارات': 'AE',
      'السعودية': 'SA',
      'قطر': 'QA',
      'الأردن': 'JO',
      'لبنان': 'LB',
      'المغرب': 'MA',
      'تونس': 'TN',
      'الجزائر': 'DZ',
      'البحرين': 'BH',
      'عُمان': 'OM'
    };
    code = map[arabicName] || '';
  }

  // 🔹 نحاول نطابق مع الـ COUNTRY_CODES
  const match = COUNTRY_CODES.find(c => c.iso === code);
  if (match) return match.flag;

  // 🔹 fallback: لو عندك ملفات أعلام جاهزة بنفس ISO code
  if (code) return `/assets/flags/${code.toLowerCase()}.png`;

  // 🔹 لو مش لاقي أي حاجة
  return '/assets/flags/world.png';
}


  getCityName(item: any): string {
    return 'city' in item ? item.city : item.name;
  }

  getAirportName(item: any): string {
    if ('airportName' in item && item.airportName) return item.airportName;
    if ('name' in item && item.name) return `مطار ${item.name}`;
    return '';
  }

  // ✅ التواريخ
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
    this.selectedDeparture = this.format(date);
    setTimeout(() => {
      this.showDepartureCal = false;
      setTimeout(() => (this.showReturnCal = true), 100);
    }, 0);
  }

  onReturnPicked(date: Date) {
    this.retDate = date;
    this.selectedReturn = this.format(date);
    setTimeout(() => (this.showReturnCal = false), 3000);
  }

  private format(d: Date) {
    return d.toLocaleDateString('ar-EG');
  }

  // ✅ نوع الرحلة
  selectTripType(type: string) {
    this.selectedTripType = type;
    this.openDropdown = false;
  }

  // ✅ الركاب
  togglePassengersDropdown() {
    this.showPassengersDropdown = !this.showPassengersDropdown;
  }

  decrement(type: 'adults' | 'children' | 'infants') {
    if (this[type] > 0) this[type]--;
  }

  increment(type: 'adults' | 'children' | 'infants') {
    this[type]++;
  }

  confirmPassengers() {
    this.showPassengersDropdown = false;
    const total = this.adults + this.children + this.infants;
    const display = `${total} مسافر | ${this.selectedClass}`;
    alert(display);
  }
}
