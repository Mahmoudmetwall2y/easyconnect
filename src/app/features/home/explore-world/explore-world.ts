import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';


@Component({
  selector: 'app-explore-world',
   standalone: true,
  imports: [CommonModule], 
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
    activeIndex = 2;
 
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
  
setActive(i: number) {
  const steps = i - this.activeIndex;

  if (steps > 0) {
    // نلف يمين
    for (let x = 0; x < steps; x++) {
      const first = this.images.shift()!;
      this.images.push(first);
    }
  } else if (steps < 0) {
    // نلف شمال
    for (let x = 0; x < Math.abs(steps); x++) {
      const last = this.images.pop()!;
      this.images.unshift(last);
    }
  }

  // بعدها المركز دايمًا الصورة رقم 2
  this.activeIndex = 2;
}


getCardClass(i: number) {
  const diff = i - this.activeIndex;

  if (diff === 0) return "center-card";
  if (diff === -1) return "left-mid";
  if (diff === -2) return "left-card";
  if (diff === 1) return "right-mid";
  if (diff === 2) return "right-card";

  // باقي الصور تروح بعيد بحيث لا تبان
  return diff < 0 ? "left-hidden" : "right-hidden";
}



}
