import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

import { FlightCalendar } from '../../../shared/components/flight-calendar/flight-calendar';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule,FlightCalendar],
  templateUrl: './home-header.html',
  styleUrls: ['./home-header.css']
})
export class HomeHeader  {
  activeTab: 'flights' | 'hotels' = 'flights';
  openDropdown = false;
  selectedTripType = 'ذهاب وعودة';
  showPassengersDropdown = false;
adults = 1;
children = 0;
infants = 0;
selectedClass = 'السياحية';
classes = ['السياحية', 'السياحية المتميزة', 'درجة رجال الأعمال', 'الدرجة الأولى'];
// داخل HomeHeader
showDepartureCal = false;
showReturnCal = false;

depDate: Date | null = null;
retDate: Date | null = null;

selectedDeparture: string | null = null;
selectedReturn: string | null = null;

openDepartureCal() {
  this.showReturnCal = false;
  this.showDepartureCal = true;
}

openReturnCal() {
  this.showDepartureCal = false;
  this.showReturnCal = true;
}

// 🛫 يختار يوم واحد للمغادرة
// 🛫 يختار يوم واحد للمغادرة
onDeparturePicked(date: Date) {
  this.depDate = date;
  this.selectedDeparture = this.format(date);

  // ✅ استخدم setTimeout(…, 0) عشان Angular يحدث القيم قبل القفل
  setTimeout(() => {
    this.showDepartureCal = false;

    // ✅ بعد ما يقفل الأول، يفتح الثاني تلقائي بعد 0.3 ثانية
    setTimeout(() => {
      this.showReturnCal = true;
    }, 100);
  }, 0);
}


// 🛬 يختار يوم واحد للعودة
onReturnPicked(date: Date) {
  this.retDate = date;
  this.selectedReturn = this.format(date);

  // ✅ يقفل كاليندر العودة بعد الاختيار
  this.showReturnCal = false;
}

private format(d: Date) {
  return d.toLocaleDateString('ar-EG'); // غيّري الفورمات لو محتاجة
}


  
 


  selectTripType(type: string) {
    this.selectedTripType = type;
    this.openDropdown = false;
  }




  togglePassengersDropdown() {
  this.showPassengersDropdown = !this.showPassengersDropdown;
}

  // ✅ استبدال Math.max() بدالة داخل الكلاس
  decrement(type: 'adults' | 'children' | 'infants') {
    if (this[type] > 0) this[type]--;
  }

  increment(type: 'adults' | 'children' | 'infants') {
    this[type]++;
  }

  confirmPassengers() {
    this.showPassengersDropdown = false;
    const total = this.adults + this.children + this.infants;
    const display = `${total} مسافر | ${this.selectedClass}`;
    alert(display); // لاحقًا هنستبدلها بتحديث النص في الزر
  }
}
