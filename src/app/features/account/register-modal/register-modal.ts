import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes';

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
  showToast = false;

  private auth = inject(AuthService);

  // form fields
  name: string = '';
  contact: string = '';
  phoneLocal: string = '';
  showDropdown = false;

  countryCodes = COUNTRY_CODES;
  selectedCountry: CountryCode = this.countryCodes.find(c => c.iso === 'KW')!;

  loading = false;
  message = '';

  selectCountry(c: CountryCode) {
    this.selectedCountry = c;
    this.showDropdown = false;
  }

  get e164Phone(): string {
    return this.selectedCountry.dial + (this.phoneLocal || '').replace(/^0+/, '');
  }

  
  // ✅ الإرسال إلى الـ API
  onSubmit() {
    if (!this.name || (!this.contact && !this.phoneLocal)) {
      alert('يرجى إدخال جميع البيانات');
      return;
    }

    this.loading = true;
    this.message = '';

    // بناء الـ DTO حسب نوع التسجيل
    const dto = {
      fullName: this.name.trim(),
      email: this.type === 'email' ? this.contact.trim() : null,
      phone: this.type === 'whatsapp' ? this.e164Phone : null,
      password: '' // في التسجيل السريع نرسله فاضي
    };

    this.auth.register(dto).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.succeeded) {
          this.showToast = true; // ✅ إظهار الرسالة
          setTimeout(() => {
            this.showToast = false; // إخفاؤها بعد 3 ثواني
            this.close.emit(); // إغلاق المودال بعد الرسالة
          }, 5000);
        }  else {
          alert(res.message || 'حدث خطأ أثناء التسجيل');
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'حدث خطأ في الاتصال بالسيرفر ❌';
        console.error(err);
      }
    });
  }
}
