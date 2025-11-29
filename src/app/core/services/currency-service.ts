import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CountryCode } from '../../shared/data/country-codes';

@Injectable({ providedIn: 'root' })
export class CurrencyService {

  private currencySubject = new BehaviorSubject<CountryCode | null>(null);
  currency$ = this.currencySubject.asObservable();

  setCurrency(c: CountryCode) {
    this.currencySubject.next(c);
    localStorage.setItem('currency', JSON.stringify(c));
    console.log(c);
  }

  getCurrency(): CountryCode | null {
    const stored = localStorage.getItem('currency');
    return stored ? JSON.parse(stored) : null;
  }
  currencyByCountry: Record<string, string> = {
  EG: 'EGP',
  SA: 'SAR',
  AE: 'AED',
  QA: 'QAR',
  KW: 'KWD',
  OM: 'OMR',
  BH: 'BHD',
  US: 'USD',
  JO: 'JOD',
  LB: 'LBP',
  MA: 'MAD',
  TN: 'TND',
  DZ: 'DZD',
  TR: 'TRY',
  IN: 'INR',
  GB: 'GBP',
  DE: 'EUR'
};

}
