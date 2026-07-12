import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';
import {
  LocationSelector,
  SelectedLocation
} from '../../flight-search/location-selector/location-selector';

import { PassengerSelector } from '../passenger-selector/passenger-selector';
import { Router } from '@angular/router';
import { CurrencyService } from '../../../core/services/currency-service';
import { LoadingScreen } from '../../../shared/loading-screen/loading-screen';

@Component({
  selector: 'app-flight-search-bar',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    FlightCalendar,
    LocationSelector,
    PassengerSelector,
    LoadingScreen
  ],

  templateUrl: './flight-search-bar.html',
  styleUrls: ['./flight-search-bar.css']
})
export class FlightSearchBar implements OnInit {

  @Input() selectedTripType: string = 'ذهاب وعودة';
  @Output() tripTypeChanged = new EventEmitter<string>();

  @Input() directOnly: boolean = false;
  @Input() includeBaggage: boolean = false;

  @Input() initialFrom: SelectedLocation | null = null;
  @Input() initialTo: SelectedLocation | null = null;

  @Input() initialDepDate: string | Date | null = null;
  @Input() initialRetDate: string | Date | null = null;

  @Input() initialAdults: number = 1;
  @Input() initialChildren: number = 0;
  @Input() initialInfants: number = 0;
  @Input() initialTravelClass: string = 'السياحية';

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

  errorFrom = false;
  errorTo = false;
  errorDep = false;
  errorRet = false;

  openDropdown = false;
  showDepartureCal = false;
  showReturnCal = false;
  openPassengerSelector = false;

  currencyIso: string = 'USD';
  loading = false;

  constructor(
    private router: Router,
    private currencyService: CurrencyService
  ) {
    const savedType = sessionStorage.getItem('selectedTripType');

    this.selectedTripType =
      savedType || 'ذهاب وعودة';
  }

  ngOnInit(): void {
    const selectedCurrency =
      this.currencyService.getCurrency();

    if (selectedCurrency) {
      this.currencyIso = selectedCurrency.iso;
    }

    this.currencyService.currency$.subscribe(currency => {
      if (currency) {
        this.currencyIso = currency.iso;
      }
    });

    this.initializeLocations();
    this.initializeDates();
    this.initializePassengers();
  }

  private initializeLocations(): void {
    this.selectedFrom =
      this.initialFrom ?? {
        city: 'القاهرة',
        airportName: 'مطار القاهرة الدولي',
        iataCode: 'CAI',
        countryCode: 'EG'
      };

    this.selectedTo =
      this.initialTo ?? {
        city: 'دبي',
        airportName: 'مطار دبي الدولي',
        iataCode: 'DXB',
        countryCode: 'AE'
      };
  }

  private initializeDates(): void {
    const today = new Date();

    if (this.initialDepDate) {
      this.depDate = new Date(this.initialDepDate);
    } else {
      this.depDate = new Date(today);
      this.depDate.setDate(today.getDate() + 7);
    }

    if (this.initialRetDate) {
      this.retDate = new Date(this.initialRetDate);
    } else {
      this.retDate = new Date(today);
      this.retDate.setDate(today.getDate() + 14);
    }

    this.selectedDeparture =
      this.depDate.toLocaleDateString('ar-EG');

    this.selectedReturn =
      this.retDate.toLocaleDateString('ar-EG');
  }

  private initializePassengers(): void {
    this.adults = this.initialAdults;
    this.children = this.initialChildren;
    this.infants = this.initialInfants;
    this.travelClass = this.initialTravelClass;

    this.updatePassengersSummary();
  }

  private updatePassengersSummary(): void {
    const totalPassengers =
      this.adults +
      this.children +
      this.infants;

    this.passengersSummary =
      `${totalPassengers} مسافر | ${this.travelClass}`;
  }

  selectTripType(type: string): void {
    this.selectedTripType = type;

    sessionStorage.setItem(
      'selectedTripType',
      type
    );

    this.openDropdown = false;
    this.tripTypeChanged.emit(type);

    if (type === 'ذهاب فقط') {
      this.showReturnCal = false;
    }
  }

  openDepartureCal(): void {
    this.showReturnCal = false;
    this.showDepartureCal = true;
  }

  openReturnCal(): void {
    if (this.selectedTripType === 'ذهاب فقط') {
      return;
    }

    this.showDepartureCal = false;
    this.showReturnCal = true;
  }

  onDeparturePicked(date: Date): void {
    this.depDate = date;

    this.selectedDeparture =
      date.toLocaleDateString('ar-EG');

    this.showDepartureCal = false;

    if (this.retDate && this.retDate < date) {
      this.retDate = new Date(date);
      this.retDate.setDate(date.getDate() + 7);

      this.selectedReturn =
        this.retDate.toLocaleDateString('ar-EG');
    }

    if (this.selectedTripType === 'ذهاب وعودة') {
      setTimeout(() => {
        this.showReturnCal = true;
      }, 100);
    }
  }

  onReturnPicked(date: Date): void {
    if (
      this.depDate &&
      date < this.depDate
    ) {
      return;
    }

    this.retDate = date;

    this.selectedReturn =
      date.toLocaleDateString('ar-EG');

    setTimeout(() => {
      this.showReturnCal = false;
    }, 200);
  }

  onPassengersConfirmed(data: any): void {
    this.adults = data.adults;
    this.children = data.children;
    this.infants = data.infants;
    this.travelClass = data.travelClass;

    this.passengersSummary =
      data.summary ||
      `${this.adults + this.children + this.infants} مسافر | ${this.travelClass}`;

    this.openPassengerSelector = false;
  }

  searchFlights(): void {
    sessionStorage.removeItem('flights');
    sessionStorage.removeItem('departures');
    sessionStorage.removeItem('returns');
    sessionStorage.removeItem('selectedFlight');
    sessionStorage.removeItem('confirmedPrice');

    this.resetErrors();

    if (!this.selectedFrom) {
      this.errorFrom = true;
    }

    if (!this.selectedTo) {
      this.errorTo = true;
    }

    if (!this.depDate) {
      this.errorDep = true;
    }

    if (
      this.selectedTripType === 'ذهاب وعودة' &&
      !this.retDate
    ) {
      this.errorRet = true;
    }

    if (
      this.errorFrom ||
      this.errorTo ||
      this.errorDep ||
      this.errorRet
    ) {
      return;
    }

    if (
      this.selectedFrom!.iataCode ===
      this.selectedTo!.iataCode
    ) {
      this.errorFrom = true;
      this.errorTo = true;
      return;
    }

    if (
      this.selectedTripType === 'ذهاب وعودة' &&
      this.retDate! < this.depDate!
    ) {
      this.errorRet = true;
      return;
    }
this.loading = true;

const staticFlights =
  this.buildStaticFlights();

this.saveSearchData(staticFlights);

console.log(
  'STATIC FLIGHTS:',
  staticFlights
);

setTimeout(() => {
  this.loading = false;

  this.router.navigate(['/search'], {
    state: {
      flights: staticFlights
    }
  });
}, 500);
  }

 private buildStaticFlights(): any[] {
  const departureDate = this.formatDate(this.depDate);
  const returnDate = this.formatDate(this.retDate);

  const isRoundTrip =
    this.selectedTripType === 'ذهاب وعودة';

  const origin =
    this.selectedFrom!.iataCode;

  const destination =
    this.selectedTo!.iataCode;

  const currency =
    this.currencyIso || 'USD';

  /*
   * خيارات شركة مصر للطيران
   */
  const msDepartureOptions = [
    {
      offerId: 'static-ms-dep-1',
      provider: 'static',

      airline: 'MS',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'MS985',

      origin,
      destination,

      departureAt:
        `${departureDate}T08:00:00`,

      arrivalAt:
        `${departureDate}T11:00:00`,

      duration: 'PT3H',
      stops: 0,

      price: 320,
      currency,

      checkedBaggageQuantity: 1,
      departureBags: 1,

      segments: []
    },

    {
      offerId: 'static-ms-dep-2',
      provider: 'static',

      airline: 'MS',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'MS987',

      origin,
      destination,

      departureAt:
        `${departureDate}T12:00:00`,

      arrivalAt:
        `${departureDate}T15:00:00`,

      duration: 'PT3H',
      stops: 0,

      price: 350,
      currency,

      checkedBaggageQuantity: 1,
      departureBags: 1,

      segments: []
    },

    {
      offerId: 'static-ms-dep-3',
      provider: 'static',

      airline: 'MS',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'MS989',

      origin,
      destination,

      departureAt:
        `${departureDate}T17:30:00`,

      arrivalAt:
        `${departureDate}T20:30:00`,

      duration: 'PT3H',
      stops: 0,

      price: 375,
      currency,

      checkedBaggageQuantity: 2,
      departureBags: 2,

      segments: []
    }
  ];

  const msReturnOptions = isRoundTrip
    ? [
        {
          offerId: 'static-ms-ret-1',
          provider: 'static',

          airline: 'MS',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'MS986',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T10:00:00`,

          arrivalAt:
            `${returnDate}T13:00:00`,

          duration: 'PT3H',
          stops: 0,

          price: 320,
          currency,

          checkedBaggageQuantity: 1,
          returnBags: 1,

          segments: []
        },

        {
          offerId: 'static-ms-ret-2',
          provider: 'static',

          airline: 'MS',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'MS988',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T16:00:00`,

          arrivalAt:
            `${returnDate}T19:00:00`,

          duration: 'PT3H',
          stops: 0,

          price: 345,
          currency,

          checkedBaggageQuantity: 1,
          returnBags: 1,

          segments: []
        }
      ]
    : [];

  /*
   * خيارات طيران الجزيرة
   */
  const j9DepartureOptions = [
    {
      offerId: 'static-j9-dep-1',
      provider: 'static',

      airline: 'J9',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'J9120',

      origin,
      destination,

      departureAt:
        `${departureDate}T09:30:00`,

      arrivalAt:
        `${departureDate}T13:30:00`,

      duration: 'PT4H',
      stops: this.directOnly ? 0 : 1,

      price: 275,
      currency,

      checkedBaggageQuantity:
        this.includeBaggage ? 1 : 0,

      departureBags:
        this.includeBaggage ? 1 : 0,

      segments: []
    },

    {
      offerId: 'static-j9-dep-2',
      provider: 'static',

      airline: 'J9',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'J9122',

      origin,
      destination,

      departureAt:
        `${departureDate}T14:30:00`,

      arrivalAt:
        `${departureDate}T18:30:00`,

      duration: 'PT4H',
      stops: this.directOnly ? 0 : 1,

      price: 295,
      currency,

      checkedBaggageQuantity:
        this.includeBaggage ? 1 : 0,

      departureBags:
        this.includeBaggage ? 1 : 0,

      segments: []
    }
  ];

  const j9ReturnOptions = isRoundTrip
    ? [
        {
          offerId: 'static-j9-ret-1',
          provider: 'static',

          airline: 'J9',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'J9121',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T11:00:00`,

          arrivalAt:
            `${returnDate}T15:00:00`,

          duration: 'PT4H',
          stops: this.directOnly ? 0 : 1,

          price: 275,
          currency,

          checkedBaggageQuantity:
            this.includeBaggage ? 1 : 0,

          returnBags:
            this.includeBaggage ? 1 : 0,

          segments: []
        },

        {
          offerId: 'static-j9-ret-2',
          provider: 'static',

          airline: 'J9',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'J9123',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T19:00:00`,

          arrivalAt:
            `${returnDate}T23:00:00`,

          duration: 'PT4H',
          stops: this.directOnly ? 0 : 1,

          price: 310,
          currency,

          checkedBaggageQuantity:
            this.includeBaggage ? 1 : 0,

          returnBags:
            this.includeBaggage ? 1 : 0,

          segments: []
        }
      ]
    : [];

  /*
   * خيارات فلاي دبي
   */
  const fzDepartureOptions = [
    {
      offerId: 'static-fz-dep-1',
      provider: 'static',

      airline: 'FZ',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'FZ204',

      origin,
      destination,

      departureAt:
        `${departureDate}T17:00:00`,

      arrivalAt:
        `${departureDate}T20:00:00`,

      duration: 'PT3H',
      stops: 0,

      price: 390,
      currency,

      checkedBaggageQuantity: 2,
      departureBags: 2,

      segments: []
    },

    {
      offerId: 'static-fz-dep-2',
      provider: 'static',

      airline: 'FZ',
      airlineLogo: 'assets/d2.jpg',
      flightNumber: 'FZ206',

      origin,
      destination,

      departureAt:
        `${departureDate}T21:00:00`,

      arrivalAt:
        `${departureDate}T23:59:00`,

      duration: 'PT2H59M',
      stops: 0,

      price: 420,
      currency,

      checkedBaggageQuantity: 2,
      departureBags: 2,

      segments: []
    }
  ];

  const fzReturnOptions = isRoundTrip
    ? [
        {
          offerId: 'static-fz-ret-1',
          provider: 'static',

          airline: 'FZ',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'FZ205',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T18:00:00`,

          arrivalAt:
            `${returnDate}T21:00:00`,

          duration: 'PT3H',
          stops: 0,

          price: 390,
          currency,

          checkedBaggageQuantity: 2,
          returnBags: 2,

          segments: []
        },

        {
          offerId: 'static-fz-ret-2',
          provider: 'static',

          airline: 'FZ',
          airlineLogo: 'assets/d2.jpg',
          flightNumber: 'FZ207',

          origin: destination,
          destination: origin,

          departureAt:
            `${returnDate}T22:00:00`,

          arrivalAt:
            `${returnDate}T23:59:00`,

          duration: 'PT1H59M',
          stops: 0,

          price: 430,
          currency,

          checkedBaggageQuantity: 2,
          returnBags: 2,

          segments: []
        }
      ]
    : [];

  const createFlightCard = (
    airline: string,
    recommendationTag: string,
    departureOptions: any[],
    returnOptions: any[]
  ) => {
    const selectedDeparture =
      departureOptions[0];

    const selectedReturn =
      isRoundTrip
        ? returnOptions[0]
        : null;

    return {
      offerId:
        selectedDeparture.offerId,

      provider: 'static',
      bookingMode: 'singleOffer',

      airline,
      airlineLogo:
        selectedDeparture.airlineLogo,

      flightNumber:
        selectedDeparture.flightNumber,

      recommendationTag,

      origin,
      destination,

      departureAt:
        selectedDeparture.departureAt,

      arrivalAt:
        selectedDeparture.arrivalAt,

      duration:
        selectedDeparture.duration,

      stops:
        selectedDeparture.stops,

      price:
        selectedDeparture.price,

      currency,

      baseDeparturePrice:
        selectedDeparture.price,

      baseReturnPrice:
        selectedReturn?.price ?? 0,

      departureBags:
        selectedDeparture.departureBags ?? 0,

      returnBags:
        selectedReturn?.returnBags ?? 0,

      checkedBaggageQuantity:
        selectedDeparture.checkedBaggageQuantity ?? 0,

      isRoundTrip,

      selectedDeparture,
      selectedReturn,

      returnDepartureAt:
        selectedReturn?.departureAt ?? null,

      returnArrivalAt:
        selectedReturn?.arrivalAt ?? null,

      returnDuration:
        selectedReturn?.duration ?? null,

      returnStops:
        selectedReturn?.stops ?? 0,

      returnOrigin:
        selectedReturn?.origin ?? null,

      returnDestination:
        selectedReturn?.destination ?? null,

      variations:
        departureOptions,

      returnVariations:
        returnOptions,

      departureOptions:
        departureOptions,

      returnOptions:
        returnOptions,

      isDepartureExpanded: false,
      isReturnExpanded: false,

      segments: []
    };
  };

  return [
    createFlightCard(
      'MS',
      'Best Direct',
      msDepartureOptions,
      msReturnOptions
    ),

    createFlightCard(
      'J9',
      'Cheapest',
      j9DepartureOptions,
      j9ReturnOptions
    ),

    createFlightCard(
      'FZ',
      'Recommended Direct',
      fzDepartureOptions,
      fzReturnOptions
    )
  ];
}

  private saveSearchData(
  staticFlights: any[]
): void {
  sessionStorage.setItem(
    'flights',
    JSON.stringify(staticFlights)
  );

  sessionStorage.setItem(
    'selectedFrom',
    JSON.stringify(this.selectedFrom)
  );

  sessionStorage.setItem(
    'selectedTo',
    JSON.stringify(this.selectedTo)
  );

  sessionStorage.setItem(
    'depDate',
    this.formatDate(this.depDate)
  );

  if (
    this.selectedTripType === 'ذهاب وعودة' &&
    this.retDate
  ) {
    sessionStorage.setItem(
      'retDate',
      this.formatDate(this.retDate)
    );
  } else {
    sessionStorage.removeItem('retDate');
  }

  sessionStorage.setItem(
    'selectedTripType',
    this.selectedTripType
  );

  sessionStorage.setItem(
    'adults',
    this.adults.toString()
  );

  sessionStorage.setItem(
    'children',
    this.children.toString()
  );

  sessionStorage.setItem(
    'infants',
    this.infants.toString()
  );

  sessionStorage.setItem(
    'travelClass',
    this.travelClass
  );

  sessionStorage.setItem(
    'includeBaggage',
    this.includeBaggage ? '1' : '0'
  );

  sessionStorage.setItem(
    'directOnly',
    this.directOnly ? '1' : '0'
  );
}

  private resetErrors(): void {
    this.errorFrom = false;
    this.errorTo = false;
    this.errorDep = false;
    this.errorRet = false;
  }

  private formatDate(
    date: Date | null
  ): string {
    if (!date) {
      return '';
    }

    const formattedDate = new Date(date);

    const month =
      (formattedDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');

    const day =
      formattedDate
        .getDate()
        .toString()
        .padStart(2, '0');

    const year =
      formattedDate.getFullYear();

    return `${year}-${month}-${day}`;
  }
}