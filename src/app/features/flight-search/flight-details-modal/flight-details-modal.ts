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

@Output() closed = new EventEmitter<void>();

constructor(public t:TranslationService){

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
      };
    }
  }

  formatTime(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  formatDuration(duration?: string): string {
    if (!duration) return '';
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const h = match?.[1] ? match[1].replace('H','') : '';
    const m = match?.[2] ? match[2].replace('M','') : '';
    return `${h ? h + ' س ' : ''}${m ? m + ' د' : ''}`.trim();
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
