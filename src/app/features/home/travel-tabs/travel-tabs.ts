import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlightsForm } from '../flights-form/flights-form';
import { HotelsForm } from '../hotels-form/hotels-form';

@Component({
  selector: 'app-travel-tabs',
  imports: [CommonModule,FlightsForm,HotelsForm],
  templateUrl: './travel-tabs.html',
  styleUrl: './travel-tabs.css'
})
export class TravelTabs {
activeTab: 'flights' | 'hotels' = 'flights';
}
