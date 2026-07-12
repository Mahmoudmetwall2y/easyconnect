import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

interface FlightDeal {
  origin: string;
  destination: string;
  price: number;
  currency: string;
  image: string;
  remainingSeats: number;
  discount: number;
  tripType: string;
}

@Component({
  selector: 'app-deals-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals-section.html',
  styleUrl: './deals-section.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DealsSection implements OnInit {



  ngOnInit(): void {
  setTimeout(() => {
    const swiperElement =
      document.querySelector('.deals-swiper') as any;

    if (!swiperElement) {
      return;
    }

    Object.assign(swiperElement, {
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 25
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30
        }
      }
    });

    swiperElement.initialize();
  });
}

  deals: FlightDeal[] = [
    {
      origin: 'CAI',
      destination: 'DXB',
      price: 350,
      currency: 'USD',
      image: 'assets/images/img1.jpg',
      remainingSeats: 3,
      discount: 15,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'JED',
      price: 280,
      currency: 'USD',
      image: 'assets/images/img2.jpg',
      remainingSeats: 5,
      discount: 20,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'IST',
      price: 420,
      currency: 'USD',
      image: 'assets/images/img3.jpg',
      remainingSeats: 2,
      discount: 10,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'ROM',
      price: 490,
      currency: 'USD',
      image: 'assets/images/img4.jpg',
      remainingSeats: 4,
      discount: 15,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'DOH',
      price: 310,
      currency: 'USD',
      image: 'assets/images/img1.jpg',
      remainingSeats: 3,
      discount: 12,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'KWI',
      price: 295,
      currency: 'USD',
      image: 'assets/images/img2.jpg',
      remainingSeats: 6,
      discount: 18,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'LHR',
      price: 580,
      currency: 'USD',
      image: 'assets/images/img3.jpg',
      remainingSeats: 2,
      discount: 15,
      tripType: 'ذهاب وعودة'
    },
    {
      origin: 'CAI',
      destination: 'ROM',
      price: 465,
      currency: 'USD',
      image: 'assets/images/img4.jpg',
      remainingSeats: 4,
      discount: 20,
      tripType: 'ذهاب وعودة'
    }
  ];

  constructor() {
    register();
  }

 

  getArabicCityName(code: string): string {
    const cities: Record<string, string> = {
      CAI: 'القاهرة',
      DXB: 'دبي',
      DOH: 'الدوحة',
      JED: 'جدة',
      KWI: 'الكويت',
      LHR: 'لندن',
      IST: 'إسطنبول',
      ROM: 'روما'
    };

    return cities[code.toUpperCase()] ?? code;
  }
}