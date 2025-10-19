import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
isLoggedIn = false;
  userName = 'Ahmed';
  openCurrency = false;
  openUser = false;

  toggleLang() {
    // اربطها بالترجمة عندك (ngx-translate مثلاً)
  }
  setCurrency(c: 'KWD'|'USD'|'EUR') {
    // خزّن العملة المختارة
  }
  logout() {
    this.isLoggedIn = false;
  }

 
}



