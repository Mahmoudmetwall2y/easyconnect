import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from "../home/flight-search-bar/flight-search-bar";
import { FlightDetailsModal } from '../flight-search/flight-details-modal/flight-details-modal';
import { TranslationService } from '../../shared/data/translation.service';
import { LocationSelector } from '../flight-search/location-selector/location-selector';
import { PassengerSelector } from '../home/passenger-selector/passenger-selector';
import { AirlineSummary, ResultsToolbar } from '../flight-search/results-toolbar/results-toolbar';
import { getAirlineLogo } from '../../shared/data/airline-logos';
import { PriceCalendarModal } from '../flight-search/price-calendar-modal/price-calendar-modal';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightSearchBar, FlightDetailsModal,ResultsToolbar,PriceCalendarModal],
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



  constructor(private router: Router, public t: TranslationService) {
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


    const grouped = this.groupFlights(departures, returns);

    // Group per airline
    this.groupedFlights = this.groupByAirline(grouped);

    // Only valid if round trip
    if (sessionStorage.getItem('selectedTripType') === 'ذهاب وعودة') {
      this.groupedFlights = this.groupedFlights.filter(f => f.returnDepartureAt);
    }

    // ✔ إعداد بيانات التول بار
this.toolbarAirlines = this.groupedFlights.map(f => ({
  code: f.airline,
  name: f.airline,
  logoUrl: getAirlineLogo(f.airline), 
  price: f.price,
  currency: f.currency,
  isSelected: false
}));

    console.log(" Clean grouped flights:", this.groupedFlights);
  }

  ngOnInit() {
  }



  // ---------------------------------------------------------------------
  // 🔵 CLEAN GROUPING OF FLIGHTS (DEPARTURES + RETURNS)
  // ---------------------------------------------------------------------
  private groupFlights(departures: any[], returns: any[]) {
    if (!departures?.length) return [];
    const tripType = sessionStorage.getItem('selectedTripType');

    // -----------------------------------------------------------
    // ⭐ لو الرحلة "ذهاب فقط" → رجّع رحلات الذهاب كما هي
    // -----------------------------------------------------------
    if (tripType === 'ذهاب فقط') {
      return departures.map(d => ({
        airline: d.airline,
       airlineLogo: getAirlineLogo(d.airline),


        origin: d.origin,
        destination: d.destination,

        departureAt: d.departureAt,
        arrivalAt: d.arrivalAt,
        duration: d.duration,
        stops: d.stops,
        currency: d.currency,
        price: d.price,
        includedBags: d.includedBags ?? 0,


        // مفيش عودة
        returnDepartureAt: null,
        returnArrivalAt: null,
        returnDuration: null,
        returnStops: null,

        baseDeparturePrice: d.price,
        baseReturnPrice: 0,
variations: departures
  .filter(xx => xx.airline === d.airline)
  .map(v => ({
    ...v,
    airlineLogo: getAirlineLogo(v.airline)
  })),


        returnVariations: [],

        isDepartureExpanded: false,
        isReturnExpanded: false,

      }));
    }

    const depDay = new Date(sessionStorage.getItem('depDate')!).toDateString();
    const retDay = new Date(sessionStorage.getItem('retDate')!).toDateString();

    const depSameDay = departures.filter(d =>
      new Date(d.departureAt).toDateString() === depDay
    );

    const retSameDay = returns.filter(r =>
      new Date(r.departureAt).toDateString() === retDay
    );

    const results: any[] = [];

    for (const dep of depSameDay) {

      const matchingReturns = retSameDay.filter(r =>
        r.airline === dep.airline &&
        r.origin === dep.destination &&
        r.destination === dep.origin &&
        new Date(r.departureAt) > new Date(dep.arrivalAt)
      );

      if (matchingReturns.length === 0) continue;

      const bestReturn = matchingReturns.sort((a, b) => a.price - b.price)[0];

      results.push({

        // ----------- MAIN DISPLAY DATA -----------
        airline: dep.airline,
        airlineLogo:  getAirlineLogo(dep.airline),

        origin: dep.origin,
        destination: dep.destination,

        departureAt: dep.departureAt,
        arrivalAt: dep.arrivalAt,
        duration: dep.duration,
        stops: dep.stops,
        currency: dep.currency,
        price: dep.price + bestReturn.price,
        baseDeparturePrice: dep.price,
        baseReturnPrice: bestReturn.price,
        departureBags: dep.includedBags ?? 0,
        // ----------- RETURN DISPLAY DATA ---------
        returnDepartureAt: bestReturn.departureAt,
        returnArrivalAt: bestReturn.arrivalAt,
        returnDuration: bestReturn.duration,
        returnStops: bestReturn.stops,
        returnOrigin: bestReturn.origin,
        returnDestination: bestReturn.destination,
        returnBags: bestReturn.includedBags ?? 0,

        // ----------- DEPARTURE VARIATIONS (Only Dep) -----------
        variations: depSameDay
          .filter(xx => xx.airline === dep.airline)
          .map(d => ({
            departureAt: d.departureAt,
            arrivalAt: d.arrivalAt,
            duration: d.duration,
            stops: d.stops,
            origin: d.origin,
            destination: d.destination,
            airline: d.airline,
            airlineLogo: getAirlineLogo(d.airline),
            currency: d.currency,
            price: d.price
          })),

        // ----------- RETURN VARIATIONS (Only Return) -----------
        returnVariations: matchingReturns.map(r => ({
          departureAt: r.departureAt,
          arrivalAt: r.arrivalAt,
          duration: r.duration,
          stops: r.stops,
          origin: r.origin,
          destination: r.destination,
          airline: r.airline,
          airlineLogo:  getAirlineLogo(r.airline),
          currency: r.currency,
          price: r.price
        })),

        isDepartureExpanded: false,
        isReturnExpanded: false
      });

    }

    return results;
  }

  // ---------------------------------------------------------------------
  // 🔵 GROUP BY AIRLINE (CLEAN, NO DUPLICATES)
  // ---------------------------------------------------------------------
  private groupByAirline(flights: any[]) {

    const grouped: any = {};

    for (const f of flights) {

      if (!grouped[f.airline]) {
        grouped[f.airline] = {
          airline: f.airline,
          airlineLogo:  getAirlineLogo(f.airline),
          price: f.price,

          ...f,

          variations: [...f.variations],
          returnVariations: [...f.returnVariations],

          isDepartureExpanded: false,
          isReturnExpanded: false
        };
      }

      // Keep Cheapest
      if (f.price < grouped[f.airline].price) {
        grouped[f.airline].price = f.price;
       const oldLogo = grouped[f.airline].airlineLogo;
Object.assign(grouped[f.airline], f);
grouped[f.airline].airlineLogo = oldLogo; // نحافظ على اللوجو الصح

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

    f.baseDeparturePrice = option.price;

    f.price = f.baseDeparturePrice + f.baseReturnPrice;
  }

  applyNewReturn(f: any, option: any) {
    f.selectedReturn = option;

    f.baseReturnPrice = option.price;

    f.price = f.baseDeparturePrice + f.baseReturnPrice;
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


openFiltersModal() {
  console.log("Open filters modal");
  // هنا لاحقًا هنفتح modal الفلاتر
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




}
