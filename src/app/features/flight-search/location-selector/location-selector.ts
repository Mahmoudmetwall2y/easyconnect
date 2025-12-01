
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FlightsService, LocationResult, PopularAirport } from '../../../core/services/flights.service';
import { COUNTRY_CODES } from '../../../shared/data/country-codes';


export type AnyLoc = PopularAirport | LocationResult;

export interface SelectedLocation {
  city: string;
  airportName: string;
  iataCode: string;
  countryCode?: string; // متاحة لو من Amadeus
}

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-selector.html',
  styleUrls: ['./location-selector.css']
})
export class LocationSelector implements OnInit, OnDestroy {



  /** 'from' | 'to' لتغيير الايقونة والنص */
  @Input() type: 'from' | 'to' = 'from';
  /** Placeholder افتراضي */
  @Input() placeholder = 'مدينة أو مطار';
  /** قيمة مختارة لعرضها بشكل read-only بعد الاختيار */
  @Input() value: SelectedLocation | null = null;
@Input() initialValue: SelectedLocation | null = null;

  /** عند اختيار مدينة/مطار */
  @Output() locationSelected = new EventEmitter<SelectedLocation>();

  // UI state
  text = '';
  warning = '';
  showDropdown = false;
  options: AnyLoc[] = [];

  // search stream
  private search$ = new Subject<string>();
  private sub?: Subscription;

  constructor(private flights: FlightsService) {}

  ngOnInit(): void {

     if (this.initialValue) {
    this.value = this.initialValue;
  }

    // stream البحث
    this.sub = this.search$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap(keyword => {
          const isArabic = /[\u0600-\u06FF]/.test(keyword || '');
          if (isArabic) {
            this.warning = '⚠️ اكتب اسم المدينة بالإنجليزية (مثال: Cairo, Dubai)';
            this.options = [];
            return this.flights.getPopularAirports(); // fallback عرض المشهور
          }
          this.warning = '';
          return (keyword?.length ?? 0) < 2
            ? this.flights.getPopularAirports()
            : this.flights.searchLocations(keyword);
        })
      )
      .subscribe(res => {
        this.options = res.data || [];
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // فتح/غلق الدروب داون
toggle() {
  if (this.value) {
    this.value = null;
    this.text = '';
  }

  this.showDropdown = true;

  if (this.options.length === 0) {
    this.flights.getPopularAirports().subscribe(r => this.options = r.data);
  }
}


openDropdown(event?: MouseEvent | FocusEvent) {
  event?.stopPropagation?.();
  this.showDropdown = true;

  if (this.options.length === 0) {
    this.flights.getPopularAirports().subscribe(r => (this.options = r.data));
  }
}




  // على الكتابة
  onInput(val: string) {
    this.text = val;
    this.search$.next(val);
  }

  // اختيار عنصر
  choose(item: AnyLoc) {
    const city = 'city' in item ? item.city : item.name;
    const airportName = 'airportName' in item ? item.airportName : `مطار ${item.name}`;
    const iataCode = item.iataCode;
    const countryCode = 'countryCode' in item ? item.countryCode : undefined;

    const sel: SelectedLocation = { city, airportName, iataCode, countryCode };
    this.value = sel;
    this.showDropdown = false;
    this.text = '';
    this.locationSelected.emit(sel);
  }

  // Helpers لعرض الأعلام والأسماء
  getFlag(item: AnyLoc): string {
    let code = '';
    if ('countryCode' in item && item.countryCode) {
      code = item.countryCode.toUpperCase();
    } else if ('country' in item && item.country) {
      const map: Record<string, string> = {
        'الكويت':'KW','مصر':'EG','الإمارات':'AE','السعودية':'SA','قطر':'QA',
        'الأردن':'JO','لبنان':'LB','المغرب':'MA','تونس':'TN','الجزائر':'DZ',
        'البحرين':'BH','عُمان':'OM'
      };
      code = map[item.country.trim()] || '';
    }
    const match = COUNTRY_CODES.find(c => c.iso === code);
    if (match) return match.flag;
    if (code) return `/assets/flags/${code.toLowerCase()}.png`;
    return '/assets/flags/world.png';
  }

  getCityName(item: AnyLoc)   { return ('city' in item) ? item.city : item.name; }
 getAirportName(item: AnyLoc): string {
  if ('airportName' in item && item.airportName) {
    return item.airportName;
  }

  if ('name' in item && item.name) {
    return `مطار ${(item as LocationResult).name}`;
  }

  return '';
}

}

