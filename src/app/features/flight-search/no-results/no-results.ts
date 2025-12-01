import { Component } from '@angular/core';
import { FlightSearchBar } from '../../home/flight-search-bar/flight-search-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-results',
  imports: [FlightSearchBar,CommonModule],
  templateUrl: './no-results.html',
  styleUrl: './no-results.css'
})
export class NoResults {
 editSearch() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
