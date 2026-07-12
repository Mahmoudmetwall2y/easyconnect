import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COUNTRY_CODES } from '../../../shared/data/country-codes';

export interface SelectedLocation {
  city: string;
  airportName: string;
  iataCode: string;
  countryCode?: string;
}

interface StaticLocation extends SelectedLocation {
  country: string;
}

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-selector.html',
  styleUrls: ['./location-selector.css']
})
export class LocationSelector implements OnInit {

  @Input() type: 'from' | 'to' = 'from';
  @Input() placeholder = 'مدينة أو مطار';
  @Input() value: SelectedLocation | null = null;
  @Input() initialValue: SelectedLocation | null = null;

  @Output() locationSelected =
    new EventEmitter<SelectedLocation>();

  text = '';
  warning = '';
  showDropdown = false;

  readonly staticLocations: StaticLocation[] = [
    {
      city: 'القاهرة',
      airportName: 'مطار القاهرة الدولي',
      iataCode: 'CAI',
      countryCode: 'EG',
      country: 'مصر'
    },
    {
      city: 'الإسكندرية',
      airportName: 'مطار برج العرب الدولي',
      iataCode: 'HBE',
      countryCode: 'EG',
      country: 'مصر'
    },
    {
      city: 'شرم الشيخ',
      airportName: 'مطار شرم الشيخ الدولي',
      iataCode: 'SSH',
      countryCode: 'EG',
      country: 'مصر'
    },
    {
      city: 'الغردقة',
      airportName: 'مطار الغردقة الدولي',
      iataCode: 'HRG',
      countryCode: 'EG',
      country: 'مصر'
    },
    {
      city: 'دبي',
      airportName: 'مطار دبي الدولي',
      iataCode: 'DXB',
      countryCode: 'AE',
      country: 'الإمارات'
    },
    {
      city: 'أبوظبي',
      airportName: 'مطار زايد الدولي',
      iataCode: 'AUH',
      countryCode: 'AE',
      country: 'الإمارات'
    },
    {
      city: 'جدة',
      airportName: 'مطار الملك عبدالعزيز الدولي',
      iataCode: 'JED',
      countryCode: 'SA',
      country: 'السعودية'
    },
    {
      city: 'الرياض',
      airportName: 'مطار الملك خالد الدولي',
      iataCode: 'RUH',
      countryCode: 'SA',
      country: 'السعودية'
    },
    {
      city: 'الدوحة',
      airportName: 'مطار حمد الدولي',
      iataCode: 'DOH',
      countryCode: 'QA',
      country: 'قطر'
    },
    {
      city: 'الكويت',
      airportName: 'مطار الكويت الدولي',
      iataCode: 'KWI',
      countryCode: 'KW',
      country: 'الكويت'
    },
    {
      city: 'عمّان',
      airportName: 'مطار الملكة علياء الدولي',
      iataCode: 'AMM',
      countryCode: 'JO',
      country: 'الأردن'
    },
    {
      city: 'بيروت',
      airportName: 'مطار رفيق الحريري الدولي',
      iataCode: 'BEY',
      countryCode: 'LB',
      country: 'لبنان'
    },
    {
      city: 'إسطنبول',
      airportName: 'مطار إسطنبول الدولي',
      iataCode: 'IST',
      countryCode: 'TR',
      country: 'تركيا'
    },
    {
      city: 'روما',
      airportName: 'مطار روما فيوميتشينو',
      iataCode: 'FCO',
      countryCode: 'IT',
      country: 'إيطاليا'
    },
    {
      city: 'لندن',
      airportName: 'مطار لندن هيثرو',
      iataCode: 'LHR',
      countryCode: 'GB',
      country: 'المملكة المتحدة'
    },
    {
      city: 'باريس',
      airportName: 'مطار شارل ديغول',
      iataCode: 'CDG',
      countryCode: 'FR',
      country: 'فرنسا'
    }
  ];

  options: StaticLocation[] = [];

  ngOnInit(): void {
    if (this.initialValue) {
      this.value = this.initialValue;
    }

    this.options = [...this.staticLocations];
  }

  toggle(): void {
    if (this.value) {
      this.value = null;
      this.text = '';
    }

    this.showDropdown = true;
    this.options = [...this.staticLocations];
  }

  openDropdown(event?: MouseEvent | FocusEvent): void {
    event?.stopPropagation?.();

    this.showDropdown = true;

    if (!this.text.trim()) {
      this.options = [...this.staticLocations];
    }
  }

  onInput(value: string): void {
    this.text = value;

    const keyword = value
      .trim()
      .toLowerCase();

    this.warning = '';

    if (!keyword) {
      this.options = [...this.staticLocations];
      return;
    }

    this.options = this.staticLocations.filter(location => {
      return (
        location.city.toLowerCase().includes(keyword) ||
        location.airportName.toLowerCase().includes(keyword) ||
        location.iataCode.toLowerCase().includes(keyword) ||
        location.country.toLowerCase().includes(keyword)
      );
    });
  }

  choose(item: StaticLocation): void {
    const selected: SelectedLocation = {
      city: item.city,
      airportName: item.airportName,
      iataCode: item.iataCode,
      countryCode: item.countryCode
    };

    this.value = selected;
    this.showDropdown = false;
    this.text = '';

    this.locationSelected.emit(selected);
  }

  getFlag(item: StaticLocation): string {
    const code = item.countryCode?.toUpperCase() ?? '';

    const match = COUNTRY_CODES.find(
      country => country.iso === code
    );

    if (match) {
      return match.flag;
    }

    if (code) {
      return `/assets/flags/${code.toLowerCase()}.png`;
    }

    return '/assets/flags/world.png';
  }

  getCityName(item: StaticLocation): string {
    return item.city;
  }

  getAirportName(item: StaticLocation): string {
    return item.airportName;
  }
}