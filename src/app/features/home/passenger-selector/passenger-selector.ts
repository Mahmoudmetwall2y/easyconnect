import { Component, EventEmitter, Output ,Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passenger-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-selector.html',
  styleUrls: ['./passenger-selector.css']
})
export class PassengerSelector implements OnInit {

  
 @Output() confirmed = new EventEmitter<{
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  summary: string;
}>();

@Input() initialAdults: number = 1;
@Input() initialChildren: number = 0;
@Input() initialInfants: number = 0;
@Input() initialClass: string = 'السياحية';
@Input() initialSummary: string = '';

  adults = 1;
  children = 0;
  infants = 0;
  selectedClass = 'السياحية';
  showDropdown = false;
  displayValue = '';

  classes = ['السياحية', 'السياحية المتميزة', 'درجة رجال الأعمال', 'الدرجة الأولى'];

ngOnInit() {
  this.adults = this.initialAdults;
  this.children = this.initialChildren;
  this.infants = this.initialInfants;
  this.selectedClass = this.initialClass;
  this.displayValue = this.initialSummary;
}

  toggle() {
    this.showDropdown = !this.showDropdown;
  }

  increment(type: 'adults' | 'children' | 'infants') {
    this[type]++;
  }

  decrement(type: 'adults' | 'children' | 'infants') {
    if (this[type] > 0) this[type]--;
  }

confirm() {
  const total = this.adults + this.children + this.infants;
 this.displayValue = `${total} مسافر | ${this.selectedClass}`;
 const summary = `${total} مسافر | ${this.selectedClass}`;
  this.showDropdown = false;

  this.confirmed.emit({
    adults: this.adults,
    children: this.children,
    infants: this.infants,
    travelClass: this.selectedClass,
    summary
  });
}

}
