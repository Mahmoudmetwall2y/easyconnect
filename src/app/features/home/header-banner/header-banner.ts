
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-banner.html',
   styleUrl: './header-banner.css'
})
export class HeaderBanner {
  @Input() activeTab: 'flights' | 'hotels' = 'flights';
  @Output() tabChanged = new EventEmitter<'flights' | 'hotels'>();

  changeTab(tab: 'flights' | 'hotels') {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }
}
