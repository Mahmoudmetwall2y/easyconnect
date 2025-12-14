import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface StopOption {
  value: number;      // 0 مباشر, 1 توقف, 2+ ...
  label: string;      // النص العربي
  count: number;      // عدد الرحلات
  price: number;      // أقل سعر
  currency: string;   // العملة
}

export interface FiltersState {
stops: number[];                  
  airlines: string[];                    
  departTime: [number, number];           
  arrivalTime: [number, number];         
  departureAirports: string[];            
  arrivalAirports: string[];  
  baggage: ('with' | 'without')[];  
            
}
export interface AirportFilterItem {
  code: string;
  name: string;
  price: number;
  currency: string;
}
@Component({
  selector: 'app-filters-sidebar',
   imports: [CommonModule, FormsModule],
  templateUrl: './filters-sidebar.html',
  styleUrl: './filters-sidebar.css'
})
export class FiltersSidebar {

  @Input() state!: FiltersState;

@Input() airlinesList: { 
  code: string, 
  name: string, 
  price: number, 
  currency: string,
  logo?: string 
}[] = [];


@Input() departureAirportsList: {
  code: string;
  name: string;
  price: number;
  currency: string;
}[] = [];

@Input() arrivalAirportsList: {
  code: string;
  name: string;
  price: number;
  currency: string;
}[] = [];



  @Output() closed = new EventEmitter<void>();
  @Output() apply = new EventEmitter<FiltersState>();

  localState!: FiltersState;

  @Input() stopOptions: StopOption[] = [];    


minBaggagePrice: number = 0;
minNoBaggagePrice: number = 0;
currency: string = 'KWD';



  ngOnInit() {
    this.localState = JSON.parse(JSON.stringify(this.state));
  }
onLogoError(event: any) {
  event.target.src = 'assets/d2.jpg';
}
  close() {
    this.closed.emit();
  }

  clear() {
    this.localState = {
      stops: [],
      airlines: [],
      departTime: [0, 24],
      arrivalTime: [0, 24],
      departureAirports: [],
      arrivalAirports: [],
      baggage:[],
    };
  }

 toggleAirline(code: string) {
  const list = this.localState.airlines;

  if (list.includes(code)) {
    this.localState.airlines = list.filter(a => a !== code);
  } else {
    this.localState.airlines = [...list, code];
  }
}


  toggleDepAirport(ap: string) {
    const exists = this.localState.departureAirports.includes(ap);
    if (exists) {
      this.localState.departureAirports = this.localState.departureAirports.filter(a => a !== ap);
    } else {
      this.localState.departureAirports.push(ap);
    }
  }

  toggleArrAirport(ap: string) {
    const exists = this.localState.arrivalAirports.includes(ap);
    if (exists) {
      this.localState.arrivalAirports = this.localState.arrivalAirports.filter(a => a !== ap);
    } else {
      this.localState.arrivalAirports.push(ap);
    }
  }

  applyFilters() {
    this.apply.emit(this.localState);
  }

toggleStop(value: number) {
  const arr = this.localState.stops;

  if (arr.includes(value)) {
    this.localState.stops = arr.filter(v => v !== value);
  } else {
    this.localState.stops = [...arr, value];
  }
}

toggleBaggage(type: 'with' | 'without') {
  const arr = this.localState.baggage;

  if (arr.includes(type)) {
    this.localState.baggage = arr.filter(x => x !== type);
  } else {
    this.localState.baggage = [...arr, type];
  }
}
setBaggagePrices(flights: any[]) {
  const withBags = flights.filter(f => f.departureBags > 0);
  const withoutBags = flights.filter(f => f.departureBags === 0);

  // أقل سعر لرحلات شاملة الأمتعة
  this.minBaggagePrice = withBags.length
    ? Math.min(...withBags.map(f => f.price))
    : 0;

  // أقل سعر لرحلات بدون أمتعة
  this.minNoBaggagePrice = withoutBags.length
    ? Math.min(...withoutBags.map(f => f.price))
    : 0;

  this.currency = flights.length ? flights[0].currency : 'KWD';
}



}
