import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

type FooterModalType =
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | null;

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer-section.html',
  styleUrl: './footer-section.css'
})
export class FooterSection {
  activeModal: FooterModalType = null;

  openModal(type: Exclude<FooterModalType, null>): void {
    this.activeModal = type;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  closeFromOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.activeModal) {
      this.closeModal();
    }
  }
}