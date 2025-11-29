import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-calendar.html',
  styleUrl: './flight-calendar.css'
})
export class FlightCalendar implements OnInit {
  @Input() initialDeparture?: Date | null;
  @Input() initialReturn?: Date | null;
  @Output() datePicked = new EventEmitter<Date>(); // ✅ خليها دي بس
  @Input() tripType: string = 'ذهاب وعودة';


  months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  weekDays = ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  nextMonth = (this.currentMonth + 1) % 12;
  nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;

  currentMonthDays: any[] = [];
  nextMonthDays: any[] = [];
  selectedDate: Date | null = null;


  ngOnInit() {
    this.renderMonths();
  }

  renderMonths() {
    this.currentMonthDays = this.generateDays(this.currentYear, this.currentMonth);
    this.nextMonthDays = this.generateDays(this.nextYear, this.nextMonth);
  }
generateDays(year: number, month: number) {
  const days: any[] = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const full = new Date(date);

    days.push({
      day: full.getDate(),
      fullDate: full,
      icon: null,

      isDeparture: this.isDeparture(full),
      isReturn: this.isReturn(full),
      inRange: this.isInRange(full)
    });

    date.setDate(date.getDate() + 1);
  }
  return days;
}

  // ✅ كل ضغطة تبعت يوم واحد فقط

getDayClass(day: any) {
  return {
    'day-departure': day.isDeparture,
    'day-return': day.isReturn,

    // مهم جدًا: لو departure أو return → ما تنفّذش in-range
    'day-in-range': !day.isDeparture && !day.isReturn && day.inRange,

    'day-selected': day.isSelected,
'day-normal': !day.isDeparture && !day.isReturn && !day.inRange
  };
}



  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.nextMonth = (this.currentMonth + 1) % 12;
    this.nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.renderMonths();
  }

  nextMonthFunc() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.nextMonth = (this.currentMonth + 1) % 12;
    this.nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.renderMonths();
  }
selectDate(date: Date) {

    // ⭐ لو الرحلة ذهاب فقط → اختار يوم واحد فقط
  if (this.tripType === 'ذهاب فقط') {
    this.initialDeparture = date;
    this.initialReturn = null;
    this.datePicked.emit(date);
    this.renderMonths();
    return;
  }
  // لو مفيش مغادرة → خليه departure
  if (!this.initialDeparture) {
    this.initialDeparture = date;
    this.datePicked.emit(date);
  }

  // لو في مغادرة ومفيش عودة → خليه return
  else if (!this.initialReturn) {
    this.initialReturn = date;
    this.datePicked.emit(date);
  }

  // لو الاتنين موجودين → يختار من الأول
  else {
    this.initialDeparture = date;
    this.initialReturn = null;
    this.datePicked.emit(date);
  }

  // 🚀 أهم حاجة: إعادة رسم الكاليندر
  setTimeout(() => this.renderMonths());
}


isDeparture(date: Date) {
  return this.initialDeparture &&
    new Date(date).toDateString() === new Date(this.initialDeparture).toDateString();
}

isReturn(date: Date) {
  return this.initialReturn &&
    new Date(date).toDateString() === new Date(this.initialReturn).toDateString();
}

isInRange(date: Date) {
  if (!this.initialDeparture || !this.initialReturn) return false;

  const d = new Date(date);
  const dep = new Date(this.initialDeparture);
  const ret = new Date(this.initialReturn);

  return d > dep && d < ret;
}

}
