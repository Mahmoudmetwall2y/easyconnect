import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, signal } from '@angular/core';
import { COUNTRY_CODES, CountryCode } from '../../data/country-codes';
import { CurrencyService } from '../../../core/services/currency-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  openCurrency = false;
  user = signal<any | null>(null);


  currencies: CountryCode[] = COUNTRY_CODES;
    constructor(private currencyService: CurrencyService,private router:Router) {
  const saved = localStorage.getItem('currency');
  if (saved) this.selectedCurrency = JSON.parse(saved);
}


    ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser));
    }
  }

  isLoggedIn = computed(() => !!this.user());

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/auth/login']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }



  currencyArabic: Record<string, string> = {
    EG: 'جنيه مصري',
    SA: 'ريال سعودي',
    AE: 'درهم إماراتي',
    QA: 'ريال قطري',
    KW: 'دينار كويتي',
    OM: 'ريال عماني',
    BH: 'دينار بحريني',
    US: 'دولار أمريكي',
    JO: 'دينار أردني',
    LB: 'ليرة لبنانية',
    MA: 'درهم مغربي',
    TN: 'دينار تونسي',
    DZ: 'دينار جزائري',
    TR: 'ليرة تركية',
    IN: 'روبية هندية',
    GB: 'جنيه إسترليني',
    DE: 'يورو'
  };

  selectedCurrency: CountryCode = COUNTRY_CODES.find(c => c.iso === 'EG')!;

  // constructor() {
  //   const saved = localStorage.getItem('currency');
  //   if (saved) {
  //     this.selectedCurrency = JSON.parse(saved);
  //   }
  // }

  toggleCurrency() {
    this.openCurrency = !this.openCurrency;
  }

 setCurrency(c: CountryCode) {
  this.selectedCurrency = c;
  this.currencyService.setCurrency(c);  // ← هنا الربط الحقيقي
  this.openCurrency = false;
  console.log(c.iso)
}


  toggleLang(){

  }
 
  @HostListener('document:click', ['$event'])
  closeIfOutside(e: any) {
    if (!e.target.closest('.currency-selector')) {
      this.openCurrency = false;
    }
  }
}
