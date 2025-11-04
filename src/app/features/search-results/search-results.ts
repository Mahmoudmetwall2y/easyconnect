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
    // ✅ لو المستخدم جاي من صفحة البحث مباشرة
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['results']) {
      this.flights = nav.extras.state['results'];
      sessionStorage.setItem('flights', JSON.stringify(this.flights));
    } else {
      // ✅ لو الصفحة اتعملها refresh
      const saved = sessionStorage.getItem('flights');
      this.flights = saved ? JSON.parse(saved) : [];
    }

    console.log('🟢 نتائج الرحلات:', this.flights);
  }
}
