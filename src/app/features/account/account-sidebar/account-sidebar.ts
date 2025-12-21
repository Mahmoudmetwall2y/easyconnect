import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type AccountTab = 'profile' | 'bookings' | 'favorites' | 'payments' | 'settings';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-sidebar.html'
})
export class AccountSidebar {
  @Input() active!: AccountTab;
  @Output() tabChange = new EventEmitter<AccountTab>();
  @Output() logout = new EventEmitter<void>();
  @Output() deleteAccount = new EventEmitter<void>();

  select(tab: AccountTab) {
    this.tabChange.emit(tab);
  }
}
