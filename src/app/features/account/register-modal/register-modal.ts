import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css'
})
export class RegisterModal {
 @Input() type: 'whatsapp' | 'email' | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  name: string = '';
  contact: string = '';

  get icon(): string {
    return this.type === 'whatsapp'
      ? 'fa-brands fa-whatsapp text-[#25D366]'
      : 'fa-solid fa-envelope text-[#EA4335]';
  }

  get placeholder(): string {
    return this.type === 'whatsapp' ? 'رقم الهاتف' : 'البريد الإلكتروني';
  }

  onSubmit() {
    if (!this.name || !this.contact) return alert('يرجى إدخال جميع البيانات');
    console.log(`🟢 نوع التسجيل: ${this.type}`, { name: this.name, contact: this.contact });
    this.close.emit();
  }
}
