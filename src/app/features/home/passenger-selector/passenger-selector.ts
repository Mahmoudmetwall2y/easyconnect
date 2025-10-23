
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passenger-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-selector.html',
  styleUrls: ['./passenger-selector.css']
})
export class PassengerSelector {
  @Output() confirmed = new EventEmitter<string>();

  adults = 1;
  children = 0;
  infants = 0;
  selectedClass = 'السياحية';
  showDropdown = false;

  classes = ['السياحية', 'السياحية المتميزة', 'درجة رجال الأعمال', 'الدرجة الأولى'];

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
    this.showDropdown = false;
    const total = this.adults + this.children + this.infants;
    const display = `${total} مسافر | ${this.selectedClass}`;
    this.confirmed.emit(display);
  }
}
