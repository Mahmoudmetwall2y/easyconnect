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

  months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  weekDays = ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  nextMonth = (this.currentMonth + 1) % 12;
  nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;

  currentMonthDays: any[] = [];
  nextMonthDays: any[] = [];

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
      days.push({ day: date.getDate(), fullDate: new Date(date), icon: null });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  // ✅ كل ضغطة تبعت يوم واحد فقط
  selectDate(date: Date) {
    this.datePicked.emit(date);
  }

  getDayClass(day: any) {
    const d = day.fullDate;
    let className = 'day-normal day-hover';
    day.icon = null;

    if (this.initialDeparture && d.getTime() === this.initialDeparture.getTime()) {
      className = 'day-start';
      day.icon = 'fa-solid fa-plane-departure';
    } else if (this.initialReturn && d.getTime() === this.initialReturn.getTime()) {
      className = 'day-end';
      day.icon = 'fa-solid fa-plane-arrival';
    } else if (this.initialDeparture && this.initialReturn && d > this.initialDeparture && d < this.initialReturn) {
      className = 'day-range';
    }

    return className;
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
}
