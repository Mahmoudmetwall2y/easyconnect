import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-travel-tabs',
  imports: [CommonModule],
  templateUrl: './travel-tabs.html',
  styleUrl: './travel-tabs.css'
})
export class TravelTabs {
activeTab: 'flights' | 'hotels' = 'flights';
}
