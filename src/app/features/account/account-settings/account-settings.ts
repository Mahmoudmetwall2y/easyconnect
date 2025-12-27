import { Component, computed, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes';
import { CurrencyService } from '../../../core/services/currency-service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-settings.html'
})
export class AccountSettings {
   @Output() openPrivacy = new EventEmitter<void>();
@Output() openTerms = new EventEmitter<void>();
@Output() openAbout = new EventEmitter<void>();
 timezone = '';
  currencies = COUNTRY_CODES;
  openCurrency = false;

  selectedCurrency: CountryCode | null = null;

  constructor(private currencyService: CurrencyService) {}
  ngOnInit() {
    this.timezone = this.getGMTOffset();
    this.selectedCurrency = this.currencyService.getCurrency();

    this.currencyService.currency$.subscribe(c => {
      if (c) this.selectedCurrency = c;
    });
  }
  
  toggleCurrency() {
    this.openCurrency = !this.openCurrency;
  }

  setCurrency(c: CountryCode) {
    this.currencyService.setCurrency(c);
    this.openCurrency = false;
  }

  language = 'ar';
    getGMTOffset(): string {
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes / 60);
    const sign = offsetMinutes <= 0 ? '+' : '-';
    return `GMT${sign}${offsetHours}`;
  }
}
