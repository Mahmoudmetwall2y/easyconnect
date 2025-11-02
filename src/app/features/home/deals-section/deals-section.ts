import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FlightsService } from '../../../core/services/flights.service';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-deals-section',
  imports: [CommonModule],
  templateUrl: './deals-section.html',
  styleUrl: './deals-section.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DealsSection implements OnInit {
 deals: any[] = [];
  images = [
    'assets/images/img1.jpg',
    'assets/images/img2.jpg',
    'assets/images/img3.jpg',
    'assets/images/img4.jpg',
  ];
  loading = true;

  constructor(private flights: FlightsService) {
    register(); 
  }

  

  ngOnInit(): void {
    this.flights.getDeals().subscribe({
      next: (res) => {
        this.deals = res.data;
         this.deals = [...res.data, ...res.data]; 
        this.loading = false;
        console.log(res.data);
      },
      error: (err) => {
        console.error('❌ Error fetching deals:', err);
        this.loading = false;
      }
    });
  }
    getImage(i: number) {
    return this.images[i % this.images.length];
  }
    // ✅ دالة لتحويل أسماء المدن للعربية
  getArabicCityName(code: string): string {
    const map: Record<string, string> = {
      'CAI': 'القاهرة',
      'DXB': 'دبي',
      'DOH': 'الدوحة',
      'JED': 'جدة',
      'KWI': 'الكويت',
      'LHR': 'لندن',
      'IST': 'إسطنبول',
      'ROM': 'روما'
    };
    return map[code.toUpperCase()] || code;
  }

}
