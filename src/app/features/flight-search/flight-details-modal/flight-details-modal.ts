import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslationService } from '../../../shared/data/translation.service';

@Component({
  selector: 'app-flight-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details-modal.html',
  styleUrl: './flight-details-modal.css'
})
export class FlightDetailsModal {
@Input() flight: any = null;
@Input() segment: 'dep' | 'ret' = 'dep'; 
@Input() travelClass: string = 'السياحية';
  @Input() adults: number = 1; 
@Output() closed = new EventEmitter<void>();

constructor(public t:TranslationService){

}
get seatLabel() {
  if (this.adults > 1)
    return `${this.adults} مقاعد`;

  return `مقعد 1`;
}

  close() {
    this.closed.emit();
  }

    get data() {
    if (!this.flight) return null;

    if (this.segment === 'dep') {
      // لو المستخدم اختار variation
      const d = this.flight.selectedDeparture || this.flight;
      return {
        title: `الرحلة من ${d.origin} إلى ${d.destination}`,
        origin: d.origin,
        destination: d.destination,
        departureAt: d.departureAt,
        arrivalAt: d.arrivalAt,
        duration: d.duration,
        stops: d.stops,
        airline: d.airline,
        airlineLogo: d.airlineLogo,
         includedBags: d.departureBags ?? 0,
          departureTerminal: d.departureTerminal,
  arrivalTerminal: d.arrivalTerminal,
    flightNumber: d.flightNumber || '—',
      aircraft: d.aircraft || '—',
      };
    } else {
      const r = this.flight.selectedReturn || {
        origin: this.flight.returnOrigin,
        destination: this.flight.returnDestination,
        departureAt: this.flight.returnDepartureAt,
        arrivalAt: this.flight.returnArrivalAt,
        duration: this.flight.returnDuration,
        stops: this.flight.returnStops,
        airline: this.flight.airline,
        airlineLogo: this.flight.airlineLogo,
        includedBags: this.flight.returnBags ?? 0,
          departureTerminal: this.flight.departureTerminal,
  arrivalTerminal: this.flight.arrivalTerminal,
    flightNumber: this.flight.flightNumber || '—',
      aircraft: this.flight.aircraft || '—',

      };
      return {
        title: `العودة من ${r.origin} إلى ${r.destination}`,
        origin: r.origin,
        destination: r.destination,
        departureAt: r.departureAt,
        arrivalAt: r.arrivalAt,
        duration: r.duration,
        stops: r.stops,
        airline: r.airline,
        airlineLogo: r.airlineLogo,
         includedBags: r.returnBags ?? 0,
           departureTerminal: r.departureTerminal,
  arrivalTerminal: r.arrivalTerminal,
  
      flightNumber: r.flightNumber || '—',
      aircraft: r.aircraft || '—',
      };
    }
  }


  formatFullDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

}
