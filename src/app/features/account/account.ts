import { Component, signal } from '@angular/core';
import { AccountSidebar } from './account-sidebar/account-sidebar';
import { AccountProfile } from './account-profile/account-profile';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
type AccountTab = 'profile' | 'bookings' | 'favorites' | 'payments' | 'settings';

@Component({
  selector: 'app-account',
  standalone:true,
  imports: [AccountSidebar,AccountProfile,CommonModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  activeTab = signal<AccountTab>('profile');

  constructor(private router:Router,private account:AuthService){

  }

  setTab(tab: AccountTab) {
    this.activeTab.set(tab);
  }
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/auth/login']);
}


deleteAccount() {
  if (!confirm('هل أنت متأكد من حذف الحساب؟')) return;

  this.account.deleteUser().subscribe(() => {
    localStorage.clear();
    this.router.navigate(['/auth/register']);
  });
}


}
