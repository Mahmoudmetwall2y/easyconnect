import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchBar } from "../home/flight-search-bar/flight-search-bar";

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightSearchBar],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResults {
  flights: any[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['results']) {
      this.flights = nav.extras.state['results'];
      sessionStorage.setItem('flights', JSON.stringify(this.flights));
    } else {
      const saved = sessionStorage.getItem('flights');
      this.flights = saved ? JSON.parse(saved) : [];
    }

    console.log('🟢 نتائج الرحلات:', this.flights);
  }

  formatTime(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'مساءً' : 'صباحاً';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

 formatDuration(duration?: string): string {
  if (!duration) return '';
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = match?.[1] ? match[1].replace('H', '') : '';
  const minutes = match?.[2] ? match[2].replace('M', '') : '';

  if (!hours && !minutes) return '';

  // ✅ English formatting
  return `${hours ? hours + ' hr' : ''}${minutes ? (hours ? ' ' : '') + minutes + ' min' : ''}`.trim();
}


  translateAirline(code?: string): string {
    if (!code) return '';
    const airlines: Record<string, string> = {
      'KU': 'الخطوط الجوية الكويتية',
      'SV': 'الخطوط السعودية',
      'QR': 'الخطوط القطرية',
      'EK': 'طيران الإمارات',
    };
    return airlines[code] || code;
  }
  translateAirport(code?: string): string {
  if (!code) return '';
  const airports: Record<string, string> = {
    'KWI': 'الكويت',
    'DXB': 'دبي',
    'CAI': 'القاهرة',
    'JED': 'جدة',
    'RUH': 'الرياض',
    'DOH': 'الدوحة',
    'BAH': 'المنامة',
    'AMM': 'عمّان',
    'IST': 'إسطنبول',
    'AUH': 'أبوظبي',
    'SHJ': 'الشارقة',
    'LHR': 'لندن',
    'CDG': 'باريس',
  };
  return airports[code.toUpperCase()] || code;
}
onChangeDeparture(flight: any) {
  console.log('✈️ تغيير موعد المغادرة للرحلة:', flight);
  // هنا هتعملي مثلاً: فتح modal أو التنقل لصفحة تعديل المواعيد
  // مثال:
  // this.router.navigate(['/change-departure'], { state: { flight } });
}

}
