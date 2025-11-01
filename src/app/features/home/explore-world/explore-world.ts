import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';


@Component({
  selector: 'app-explore-world',
   standalone: true,
  imports: [CommonModule], // 👈 أضف دي
templateUrl: './explore-world.html',
styleUrls: ['./explore-world.css'],
schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ExploreWorld implements OnInit  {
  images = [
    'assets/images/slider3.jpg',
    'assets/images/slider2.png',
    'assets/images/slider5.jpg',
    'assets/images/slider4.jpg',
    'assets/images/slider1.jpg',
  ];
   screenWidth = window.innerWidth;
 
  constructor() {}

ngOnInit() {
  import('swiper/element/bundle').then(({ register }) => register());
  console.log('✅ ExploreWorld loaded');

}

 

 @HostListener('window:resize', ['$event'])
onResize(event: Event) {
  this.screenWidth = window.innerWidth;
}


  getSlidesPerView(): number {
    if (this.screenWidth < 640) return 1;
    if (this.screenWidth < 1024) return 2;
    return 3;
  }
}
