import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-profile.html'
})
export class AccountProfile {
  fullName = '';
  phone = '';
  email = '';

  loading = false;

  constructor(private account: AuthService) {}

  ngOnInit() {
    this.account.getuser().subscribe(res => {
      if (res.succeeded && res.data) {
        this.fullName = res.data.fullName ?? '';
        this.phone = res.data.phone;
        this.email = res.data.email ?? '';
      }
    });
  }

  save() {
    this.loading = true;

    this.account.updateUser({
      fullName: this.fullName,
      phone: this.phone
    }).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }
}

