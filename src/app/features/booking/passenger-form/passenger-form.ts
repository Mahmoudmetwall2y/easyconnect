import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger-form.html'
})
export class PassengerForm {

  passengers = [
    {
      type: 'adult',
      gender: 'male',
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: ''
    }
  ];

 // constructor(private router: Router) {}

  ngOnInit(): void {}

  addPassenger() {
    this.passengers.push({
      type: 'adult',
      gender: 'male',
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: ''
    });
  }

  continueToPayment() {
    sessionStorage.setItem('passengers', JSON.stringify(this.passengers));
    //this.router.navigate(['/booking/payment']);
  }
}
