import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';
import { FlightsService, LocationResult, PopularAirport } from '../../../core/services/flights.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { COUNTRY_CODES } from '../../../shared/data/country-codes';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule, FlightCalendar, FormsModule],
  templateUrl: './home-header.html',
  styleUrls: ['./home-header.css']
})
export class HomeHeader implements OnInit {
  activeTab: 'flights' | 'hotels' = 'flights';
  openDropdown = false;
  selectedTripType = 'ذهاب وعودة';
  showPassengersDropdown = false;

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

  // ✅ من
  selectedFrom: any = null;
  fromText = '';
  fromOptions: (PopularAirport | LocationResult)[] = [];
  showFromDropdown = false;
  warningFrom = '';
  private searchFrom$ = new Subject<string>();

  // ✅ إلى
  selectedTo: any = null;
  toText = '';
  toOptions: (PopularAirport | LocationResult)[] = [];
  showToDropdown = false;
  warningTo = '';
  private searchTo$ = new Subject<string>();

  constructor(private flights: FlightsService) {}

  ngOnInit() {
    // 🔹 البحث في "من"
    this.searchFrom$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(keyword =>
          keyword.length < 2
            ? this.flights.getPopularAirports()
            : this.flights.searchLocations(keyword)
        )
      )
      .subscribe(res => (this.fromOptions = res.data));

    // 🔹 البحث في "إلى"
    this.searchTo$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(keyword =>
          keyword.length < 2
            ? this.flights.getPopularAirports()
            : this.flights.searchLocations(keyword)
        )
      )
      .subscribe(res => (this.toOptions = res.data));
  }

  // ✅ فتح / غلق القوائم
  toggleDropdown(type: 'from' | 'to') {
    if (type === 'from') {
      this.showFromDropdown = !this.showFromDropdown;
      this.showToDropdown = false;
      if (this.showFromDropdown && this.fromOptions.length === 0)
        this.flights.getPopularAirports().subscribe(res => (this.fromOptions = res.data));
    } else {
      this.showToDropdown = !this.showToDropdown;
      this.showFromDropdown = false;
      if (this.showToDropdown && this.toOptions.length === 0)
        this.flights.getPopularAirports().subscribe(res => (this.toOptions = res.data));
    }
  }

  // ✅ البحث في القائمتين
  onSearch(type: 'from' | 'to', value: string) {
    const isArabic = /[\u0600-\u06FF]/.test(value);
    if (isArabic) {
      if (type === 'from') {
        this.warningFrom = '⚠️ الرجاء كتابة اسم المدينة باللغة الإنجليزية (مثال: Cairo, Dubai)';
        this.fromOptions = [];
      } else {
        this.warningTo = '⚠️ الرجاء كتابة اسم المدينة باللغة الإنجليزية (مثال: Cairo, Dubai)';
        this.toOptions = [];
      }
      return;
    } else {
      this.warningFrom = '';
      this.warningTo = '';
    }

    if (type === 'from') this.searchFrom$.next(value);
    else this.searchTo$.next(value);
  }

  // ✅ اختيار من / إلى
  selectOption(type: 'from' | 'to', item: PopularAirport | LocationResult) {
    const city = 'city' in item ? item.city : item.name;
    const airportName = 'airportName' in item ? item.airportName : `مطار ${item.name}`;
    const iata = item.iataCode;

    if (type === 'from') {
      this.selectedFrom = { city, airportName, iataCode: iata };
      this.showFromDropdown = false;
      this.fromText = '';
    } else {
      this.selectedTo = { city, airportName, iataCode: iata };
      this.showToDropdown = false;
      this.toText = '';
    }
  }

  // ✅ أيقونات وأعلام
  getFlag(item: any): string {
    let code = '';
    if ('countryCode' in item && item.countryCode) {
      code = item.countryCode.toUpperCase();
    } else if ('country' in item && item.country) {
      const arabicName = item.country.trim();
      const map: Record<string, string> = {
        'الكويت': 'KW', 'مصر': 'EG', 'الإمارات': 'AE', 'السعودية': 'SA',
        'قطر': 'QA', 'الأردن': 'JO', 'لبنان': 'LB', 'المغرب': 'MA',
        'تونس': 'TN', 'الجزائر': 'DZ', 'البحرين': 'BH', 'عُمان': 'OM'
      };
      code = map[arabicName] || '';
    }
    const match = COUNTRY_CODES.find(c => c.iso === code);
    return match ? match.flag : '/assets/flags/world.png';
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
