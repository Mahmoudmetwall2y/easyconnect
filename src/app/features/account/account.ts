import { Component, signal } from '@angular/core';
import { AccountSidebar } from './account-sidebar/account-sidebar';
import { AccountProfile } from './account-profile/account-profile';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AccountSettings } from './account-settings/account-settings';
type AccountTab = 'profile' | 'bookings' | 'favorites' | 'payments' | 'settings';
type ConfirmAction = 'logout' | 'delete' | null;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

@Component({
  selector: 'app-account',
  standalone:true,
  imports: [AccountSidebar,AccountProfile,CommonModule,AccountSettings],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  activeTab = signal<AccountTab>('profile');
  confirmAction = signal<ConfirmAction>(null);
  showPrivacy = signal(false);
  showTerms = signal(false);
  showAbout = signal(false);

  constructor(private router:Router,private account:AuthService){

  }

  getGMTOffset(): string {
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes / 60);
  const sign = offsetMinutes <= 0 ? '+' : '-';

  return `GMT${sign}${offsetHours}`;
}
  setTab(tab: AccountTab) {
    this.activeTab.set(tab);
  }
  openPrivacy() {
  this.showPrivacy.set(true);
}

closePrivacy() {
  this.showPrivacy.set(false);
}
openAbout() {
  this.showAbout.set(true);
}

closeAbout() {
  this.showAbout.set(false);
}
openTerms() {
  this.showTerms.set(true);
}

closeTerms() {
  this.showTerms.set(false);
}





openLogoutConfirm() {
  this.confirmAction.set('logout');
}

openDeleteConfirm() {
  this.confirmAction.set('delete');
}

confirm() {
  const action = this.confirmAction();

  if (action === 'logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  if (action === 'delete') {
    this.account.deleteUser().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/auth/register']);
    });
  }

  this.confirmAction.set(null);
}

cancel() {
  this.confirmAction.set(null);
}



}
