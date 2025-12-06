import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAirlineLogo } from '../../../shared/data/airline-logos';
import { PriceCalendarModal } from '../price-calendar-modal/price-calendar-modal';

export interface AirlineSummary {
  code: string;          
  name: string;          
  logoUrl?: string;      
  price: number;        
  currency: string;      
  isSelected?: boolean; 
}
@Component({
  selector: 'app-results-toolbar',
  imports: [CommonModule,FormsModule,PriceCalendarModal],
  templateUrl: './results-toolbar.html',
  styleUrl: './results-toolbar.css'
})
export class ResultsToolbar {

   @ViewChild('strip') strip!: ElementRef;
    //  1) خيارات الفرز في الدروب داون
 @Input() sortOptions: string[] = [
    'الموصى به',
    'الأقل سعرًا',
    'الأقصر زمنًا',
    'مغادره (اقرب وقت)',
    'مغادره (ابعد وقت)',
    'العوده (الابكر)',
    'العوده (الاخير)',
  ];
   @Input() selectedSort: string = 'الموصى به';

     //  2) بيانات شركات الطيران للكروت اللي في النص
  @Input() airlines: AirlineSummary[] = [];
    //  3) Events للبارنت (SearchResults)
  @Output() sortChanged = new EventEmitter<string>();
  @Output() airlineSelected = new EventEmitter<AirlineSummary>();
  @Output() openFilters = new EventEmitter<void>();
  @Output() openCalendar = new EventEmitter<void>();

   scrollIndex = 0;

   dropdownOpen = false;

openSort = false;

toggleDropdown() {
  this.openSort = !this.openSort;
}

onSortChange(value: string) {
  this.selectedSort = value;
  this.openSort = false;
  this.sortChanged.emit(value);
}

selectOption(opt: string) {
  this.selectedSort = opt;
  this.sortChanged.emit(opt);
  this.dropdownOpen = false;
}

  
 
onAirlineClick(a: AirlineSummary) {
  a.logoUrl = getAirlineLogo(a.code);
  this.airlines.forEach(x => x.isSelected = x === a);
  this.airlineSelected.emit(a);
}
  onOpenFilters() {
    this.openFilters.emit();
  }

  onOpenCalendar() {
    this.openCalendar.emit();
  }

  scrollLeft() {
    this.strip.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.strip.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  
}
