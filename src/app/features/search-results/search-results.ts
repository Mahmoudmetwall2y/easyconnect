import { CommonModule } from '@angular/common';
import { Component, input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from "../home/flight-search-bar/flight-search-bar";
import { FlightDetailsModal } from '../flight-search/flight-details-modal/flight-details-modal';
import { TranslationService } from '../../shared/data/translation.service';
import { LocationSelector } from '../flight-search/location-selector/location-selector';
import { PassengerSelector } from '../home/passenger-selector/passenger-selector';
import { AirlineSummary, ResultsToolbar } from '../flight-search/results-toolbar/results-toolbar';
import { getAirlineLogo } from '../../shared/data/airline-logos';
import { PriceCalendarModal } from '../flight-search/price-calendar-modal/price-calendar-modal';
import { FiltersSidebar, FiltersState, StopOption } from '../flight-search/filters-sidebar/filters-sidebar';
import { FlightsService } from '../../core/services/flights.service';
import Swal from 'sweetalert2';
import { ApiResponse,PricingResponseDto } from '../../core/models/pricing-response.model';
import { CurrencyService } from '../../core/services/currency-service';


interface AirportFilterItem {
  code: string;
  name: string;
  price: number;
  currency: string;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightSearchBar, FlightDetailsModal,ResultsToolbar,PriceCalendarModal,FiltersSidebar],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
})
export class SearchResults implements OnInit {

  flights: any[] = [];
  originalFlights: any[] = [];
  selectedFrom: any = null;
  selectedTo: any = null;
  includeBaggage: boolean = false;
  selectedDepartureDate: string | Date | null = null;
  selectedReturnDate: string | Date | null = null;

  adults: number = 1;
  children: number = 0;
  infants: number = 0;
  travelClass: string = 'السياحية';
  tripType: string = 'ذهاب وعودة';


  groupedFlights: any[] = [];
  detailsOpen = false;
  detailsFlight: any = null;
  detailsSegment: 'dep' | 'ret' = 'dep';


  toolbarAirlines: AirlineSummary[] = [];
  toolbarSort: string = 'الموصى به';

calendarOpen = false;
calendarDays: any[] = [];

departDays: any[] = [];
returnDays: any[] = [];
 stopOptions: StopOption[] = [];
@ViewChild(FiltersSidebar) sidebar!: FiltersSidebar;

filtersOpen = false;
filtersState: FiltersState = {
  stops: [],
  airlines: [],
  departTime: [0, 24],
  arrivalTime: [0, 24],
  departureAirports: [],
  arrivalAirports: [],
  baggage:[]
};
departureAirportsList: {
  code: string;
  name: string;
  price: number;
  currency: string;
}[] = [];

arrivalAirportsList: {
  code: string;
  name: string;
  price: number;
  currency: string;
}[] = [];


  constructor(private router: Router, public t: TranslationService, private flightservice:FlightsService,  private currencyService: CurrencyService ) {
    this.tripType = sessionStorage.getItem('selectedTripType') || 'ذهاب وعودة';

    const nav = this.router.getCurrentNavigation();

    const departures =
      nav?.extras?.state?.['departures'] ||
      JSON.parse(sessionStorage.getItem('departures') || '[]');

    const returns =
      nav?.extras?.state?.['returns'] ||
      JSON.parse(sessionStorage.getItem('returns') || '[]');
     

    this.selectedFrom = JSON.parse(sessionStorage.getItem('selectedFrom') || 'null');
    this.selectedTo = JSON.parse(sessionStorage.getItem('selectedTo') || 'null');

    this.selectedDepartureDate = new Date(sessionStorage.getItem('depDate')!);
    this.selectedReturnDate = this.tripType === 'ذهاب فقط'
      ? null
      : new Date(sessionStorage.getItem('retDate')!);

    this.adults = Number(sessionStorage.getItem('adults') || 1);
    this.children = Number(sessionStorage.getItem('children') || 0);
    this.infants = Number(sessionStorage.getItem('infants') || 0);
    this.travelClass = sessionStorage.getItem('travelClass') || 'السياحية';
    this.includeBaggage = sessionStorage.getItem('includeBaggage') === '1';

console.log("DEPARTURES", departures);
console.log("RETURNS", returns);

    const grouped = this.groupFlights(departures, returns);

    // Group per airline
    this.groupedFlights = this.groupByAirline(grouped);
    this.originalFlights = [...this.groupedFlights];

this.buildAirportFilters();
    // Only valid if round trip
    if (sessionStorage.getItem('selectedTripType') === 'ذهاب وعودة') {
      this.groupedFlights = this.groupedFlights.filter(f => f.returnDepartureAt);
    }

    //  إعداد بيانات التول بار
this.toolbarAirlines = this.groupedFlights.map(f => ({
  code: f.airline,
  name: this.t.translateAirline(f.airline),
  logo: getAirlineLogo(f.airline),
  price: f.price,
  currency: f.currency
}));

this.buildStopOptions();


    console.log(" Clean grlogoUrlouped flights:", this.groupedFlights);
  }

  ngOnInit() {
  }




  // ---------------------------------------------------------------------
  //  CLEAN GROUPING OF FLIGHTS (DEPARTURES + RETURNS)
  // ---------------------------------------------------------------------
private groupFlights(departures: any[], returns: any[]) {
  if (!departures?.length) return [];

  const tripType = sessionStorage.getItem('selectedTripType') || 'ذهاب وعودة';

if (tripType === 'ذهاب فقط') {
  return departures.map(d => {

     const offerId = d.offerId ?? d.OfferId;

    return {
      ...d,
       offerId,
      airlineLogo: getAirlineLogo(d.airline),
      returnDepartureAt: null,
      returnArrivalAt: null,
      baseDeparturePrice: d.price,
      baseReturnPrice: 0,
      returnVariations: [],
      variations: departures
        .filter(x => x.airline === d.airline)
        .map(v => ({ ...v, airlineLogo: getAirlineLogo(v.airline) })),
      isDepartureExpanded: false,
      isReturnExpanded: false,
    };
  });
}



  if (!returns || returns.length === 0) return [];

  const depDate = new Date(sessionStorage.getItem('depDate')!).toDateString();
  const retDate = new Date(sessionStorage.getItem('retDate')!).toDateString();

  const depSameDay = departures.filter(
    d => new Date(d.departureAt).toDateString() === depDate
  );

  const retSameDay = returns.filter(
    r => new Date(r.departureAt).toDateString() === retDate
  );

  const results: any[] = [];

  for (const dep of depSameDay) {
    const matchingReturns = retSameDay.filter(
      ret =>
        ret.origin === dep.destination &&   // reverse direction
        ret.destination === dep.origin &&   // reverse direction
        ret.airline === dep.airline         // same airline
    );

    if (matchingReturns.length === 0) continue; // اختفى لو مفيش رجوع

    const bestReturn = matchingReturns[0]; // أول واحد (أو أرخص لو عايزة)
    
    results.push({
      offerId: dep.offerId,
      airline: dep.airline,
      airlineLogo: getAirlineLogo(dep.airline),
 selectedReturn: bestReturn,
   selectedDeparture: dep,
      origin: dep.origin,
      destination: dep.destination,

      departureAt: dep.departureAt,
      arrivalAt: dep.arrivalAt,
      duration: dep.duration,
      stops: dep.stops,
      currency: dep.currency,
price: dep.price ,

      baseDeparturePrice: dep.price,
      baseReturnPrice: bestReturn.price,
      
 // displayPrice: dep.price,

      returnDepartureAt: bestReturn.departureAt,
      returnArrivalAt: bestReturn.arrivalAt,
      returnDuration: bestReturn.duration,
      returnStops: bestReturn.stops,
      returnOrigin: bestReturn.origin,
      returnDestination: bestReturn.destination,

      variations: depSameDay
        .filter(x => x.airline === dep.airline)
        .map(x => ({ ...x, airlineLogo: getAirlineLogo(x.airline) })),

      returnVariations: matchingReturns.map(r => ({
        ...r, airlineLogo: getAirlineLogo(r.airline)
      })),

      isDepartureExpanded: false,
      isReturnExpanded: false
    });
  }
  console.log("res88",results)

  return results;
}


  // ---------------------------------------------------------------------
  //  GROUP BY AIRLINE (CLEAN, NO DUPLICATES)
  // ---------------------------------------------------------------------
 private groupByAirline(flights: any[]) {
  const grouped: any = {};

  for (const f of flights) {

    if (!grouped[f.airline]) {
      grouped[f.airline] = {
        ...f,
        airline: f.airline,
        airlineLogo: getAirlineLogo(f.airline),

        offerId: f.offerId,

        variations: [...(f.variations || [])],
        returnVariations: [...(f.returnVariations || [])],

        isDepartureExpanded: false,
        isReturnExpanded: false
      };
      continue;
    }

    // Keep Cheapest
    if (f.price < grouped[f.airline].price) {
      const savedOfferId = grouped[f.airline].offerId;
      const savedLogo = grouped[f.airline].airlineLogo;

      Object.assign(grouped[f.airline], f);

      grouped[f.airline].offerId = savedOfferId;
      grouped[f.airline].airlineLogo = savedLogo;
    }
  }

  return Object.values(grouped);
}


  // ---------------------------------------------------------------------
  // UI ACTIONS
  // ---------------------------------------------------------------------

  onChangeDeparture(selected: any) {
    this.groupedFlights.forEach(f => {
      if (f !== selected) f.isDepartureExpanded = false;
    });

    selected.isDepartureExpanded = !selected.isDepartureExpanded;
    selected.isReturnExpanded = false;
  }


  onChangeReturn(selected: any) {
    this.groupedFlights.forEach(f => {
      if (f !== selected) f.isReturnExpanded = false;
    });

    selected.isReturnExpanded = !selected.isReturnExpanded;
    selected.isDepartureExpanded = false;
  }




applyNewDeparture(f: any, option: any) {
  f.selectedDeparture = option;

  f.departureAt = option.departureAt;
  f.arrivalAt   = option.arrivalAt;
  f.duration    = option.duration;
  f.stops       = option.stops;
  f.origin      = option.origin;
  f.destination = option.destination;

  f.baseDeparturePrice = option.price;
  f.price = option.price;

  f.offerId = option.offerId;
}


applyNewReturn(f: any, option: any) {
  f.selectedReturn = option;

  f.returnDepartureAt = option.departureAt;
  f.returnArrivalAt   = option.arrivalAt;
  f.returnDuration    = option.duration;
  f.returnStops       = option.stops;

  f.baseReturnPrice = option.price;
}




  openDetails(f: any, seg: 'dep' | 'ret') {
    this.detailsFlight = f;
    this.detailsSegment = seg;
    this.detailsOpen = true;
    console.log("huhu")
  }

  closeDetails() {
    this.detailsOpen = false;
    this.detailsFlight = null;
  }
  // ---------------------------------------------------------------------
//  TOOLBAR EVENTS
// ---------------------------------------------------------------------

onSortChanged(sort: string) {
  this.toolbarSort = sort;

  switch (sort) {

    case 'الموصى به':
      this.groupedFlights.sort((a, b) => {
        const scoreA = a.price + (parseInt(a.duration.replace(/\D/g, '')) || 0);
        const scoreB = b.price + (parseInt(b.duration.replace(/\D/g, '')) || 0);
        return scoreA - scoreB;
      });
      break;

    case 'الأقل سعرًا':
      this.groupedFlights.sort((a, b) => a.price - b.price);
      break;

    case 'الأقصر زمنًا':
      this.groupedFlights.sort((a, b) => {
        const dA = parseInt(a.duration.replace(/\D/g, '')) || 0;
        const dB = parseInt(b.duration.replace(/\D/g, '')) || 0;
        return dA - dB;
      });
      break;

    case 'مغادره (اقرب وقت)':
      this.groupedFlights.sort((a, b) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
      );
      break;

    case 'مغادره (ابعد وقت)':
      this.groupedFlights.sort((a, b) =>
        new Date(b.departureAt).getTime() - new Date(a.departureAt).getTime()
      );
      break;

    case 'العوده (الابكر)':
      this.groupedFlights.sort((a, b) =>
        new Date(a.returnDepartureAt).getTime() - new Date(b.returnDepartureAt).getTime()
      );
      break;

    case 'العوده (الاخير)':
      this.groupedFlights.sort((a, b) =>
        new Date(b.returnDepartureAt).getTime() - new Date(a.returnDepartureAt).getTime()
      );
      break;
  }

  this.groupedFlights = [...this.groupedFlights];
}




onToolbarAirlineSelected(airline: any) {
  console.log("Airline selected:", airline);

  // لو عايزة تعملي Scroll لرحلات الشركة
  const idx = this.groupedFlights.findIndex(f => f.airline === airline.code);
  if (idx >= 0) {
    const el = document.getElementById("flight-" + idx);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}




onCalendarDateSelected(day: any) {
  this.selectedDepartureDate = day.date;
  this.calendarOpen = false;
}

onReturnCalendarDateSelected(day: any) {
  this.selectedReturnDate = day.date;
  this.calendarOpen = false;
}
openCalendarModal() {
  this.calendarOpen = true;

  this.departDays = this.generateWeekDays(
    this.selectedDepartureDate,
    'dep'
  );

  this.returnDays = this.generateWeekDays(
    this.selectedReturnDate,
    'ret'
  );
}


generateWeekDays(date: string | Date | null, type: 'dep' | 'ret') {
  if (!date) return [];

  const base = new Date(date);

  // نجهّز مصفوفة الأسبوع
  const days = Array.from({ length: 7 }).map((_, i) => {
    const dt = new Date(base.getTime() + i * 86400000);
    return {
      date: dt,
      price: null
    };
  });

  // نملأ الأسعار من groupedFlights
  for (const f of this.groupedFlights) {

    // سعر اليوم حسب نوع الرحلة
    const day =
      type === 'dep'
        ? f.departureAt.split('T')[0]
        : f.returnDepartureAt.split('T')[0];

    const price =
      type === 'dep'
        ? f.baseDeparturePrice
        : f.baseReturnPrice;

    for (const d of days) {
      const dStr = d.date.toISOString().split('T')[0];
      if (dStr === day) {
        if (d.price === null || price < d.price) {
          d.price = price; // أرخص سعر في اليوم
        }
      }
    }
  }

  return days;
}

onCalendarCellSelected(ev: { depart: any; ret: any }) {
  this.selectedDepartureDate = ev.depart.date;
  this.selectedReturnDate    = ev.ret.date;
  this.calendarOpen = false;
}

onOpenFiltersFromToolbar() {
  this.filtersOpen = true;

setTimeout(() => {
  if (this.sidebar) {
    this.sidebar.setBaggagePrices(this.groupedFlights);
  }
});

}


applyFiltersToFlights() {
  // نبدأ دائمًا من النسخة الأصلية وليس من groupedFlights
  let filtered = [...this.originalFlights];

  const f = this.filtersState;

  // فلترة محطات التوقف
  if (f.stops.length > 0) {
    filtered = filtered.filter(x => f.stops.includes(x.stops));
  }

  // فلترة شركات الطيران
  if (f.airlines.length > 0) {
    filtered = filtered.filter(x => f.airlines.includes(x.airline));
  }
if (f.baggage?.length) {
  filtered = filtered.filter(flight => {

    const hasBags = flight.departureBags > 0 || flight.returnBags > 0;

    if (f.baggage.includes('with') && hasBags) return true;
    if (f.baggage.includes('without') && !hasBags) return true;

    return false;
  });
}

  // فلترة وقت المغادرة
  filtered = filtered.filter(x => {
    const hour = new Date(x.departureAt).getHours();
    return hour >= f.departTime[0] && hour <= f.departTime[1];
  });

  // فلترة وقت الوصول
  filtered = filtered.filter(x => {
    const hour = new Date(x.arrivalAt).getHours();
    return hour >= f.arrivalTime[0] && hour <= f.arrivalTime[1];
  });

  // فلترة المطارات
  if (f.departureAirports.length > 0) {
    filtered = filtered.filter(x => f.departureAirports.includes(x.origin));
  }

  if (f.arrivalAirports.length > 0) {
    filtered = filtered.filter(x => f.arrivalAirports.includes(x.destination));
  }

  this.groupedFlights = [...filtered];
}


onApplyFilters(newState: FiltersState) {
  this.filtersState = newState;
  this.filtersOpen = false;

  // Apply filters
  this.applyFiltersToFlights();

  // لو بعد الفلترة لم يبق أي رحلة → نذهب لصفحة No Results
  if (this.groupedFlights.length === 0) {
    this.router.navigate(['/no-results'], {
      queryParams: {
        from: this.selectedFrom?.iataCode,
        to: this.selectedTo?.iataCode,
        dep: this.selectedDepartureDate,
        ret: this.selectedReturnDate
      }
    });
  }
}

private buildStopOptions() {
  if (!this.originalFlights.length) {
    this.stopOptions = [];
    return;
  }

  const currency = this.originalFlights[0].currency || 'KWD';

  const buckets = [
    { value: 0, label: 'مباشر' },
    { value: 1, label: 'توقف واحد' },
    { value: 2, label: ' توقف +2 ' }
  ];

  this.stopOptions = buckets.map(b => {
    const flights = this.originalFlights.filter(f => {
      if (b.value === 2) return f.stops >= 2;
      return f.stops === b.value;
    });

    const count = flights.length;

    const minPrice = count
      ? Math.min(...flights.map(f => f.price))
      : 0;

    return {
      value: b.value,
      label: b.label,
      count,
      price: minPrice,
      currency
    };
  });
}
async buildAirportFilters() {

  const fromCode = this.selectedFrom?.iataCode;
  const toCode   = this.selectedTo?.iataCode;

  console.log("Airport From =", fromCode);
  console.log("Airport To   =", toCode);

  if (!fromCode || !toCode) return;

  // نجيب الاسم بالعربي من TranslationService
  const fromName = this.t.translateAirport(fromCode) || fromCode;
  const toName   = this.t.translateAirport(toCode) || toCode;

  const currency = this.originalFlights[0]?.currency ?? 'SAR';

  // مطار المغادرة الوحيد
  this.departureAirportsList = [{
    code: fromCode,
    name: fromName,
    price: Math.min(
      ...(this.originalFlights
        .filter(f => f.origin === fromCode)
        .map(f => f.price)),
      Infinity
    ),
    currency
  }];

  // مطار الوصول الوحيد
  this.arrivalAirportsList = [{
    code: toCode,
    name: toName,
    price: Math.min(
      ...(this.originalFlights
        .filter(f => f.destination === toCode)
        .map(f => f.price)),
      Infinity
    ),
    currency
  }];

  console.log("From Airport =", this.departureAirportsList);
  console.log("To Airport   =", this.arrivalAirportsList);
}
onLogoError(event: any) {
  event.target.src = 'assets/d2.jpg';
}
onBookNow(flight: any) {
  const currency = this.currencyService.getCurrency()?.iso || 'USD';

  if (this.tripType === 'ذهاب وعودة') {
    if (!flight.selectedDeparture || !flight.selectedReturn) {
      Swal.fire({
        icon: 'warning',
        title: 'الرحلة غير مكتملة',
        text: 'برجاء اختيار رحلة الذهاب والعودة قبل المتابعة'
      });
      return;
    }
  }

  const payload = {
    departureOfferId: flight.selectedDeparture.offerId,
    returnOfferId: this.tripType === 'ذهاب وعودة'
      ? flight.selectedReturn.offerId
      : null,
    isRoundTrip: this.tripType === 'ذهاب وعودة',
   currency: currency 
  };

  console.log('payload', payload);

  Swal.fire({
    title: 'جارٍ تأكيد السعر...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  this.flightservice.confirmPrice(payload).subscribe({
  next: (res: ApiResponse<PricingResponseDto>) => {

      console.log("resss",res)
      Swal.close();

      sessionStorage.setItem(
        'confirmedPrice',
        JSON.stringify(res.data)
      );

      sessionStorage.setItem(
        'selectedFlight',
        JSON.stringify(flight)
      );

      Swal.fire({
        icon: 'success',
        title: 'تم تأكيد السعر',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/booking']);
      });
    },

    error: () => {
      Swal.close();
      Swal.fire({
        icon: 'warning',
        title: 'السعر تغيّر',
        text: 'الرحلة لم تعد متاحة بنفس السعر، برجاء إعادة البحث'
      });
    }
  });
}

















}