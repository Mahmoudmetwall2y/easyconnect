import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes';
import { Router } from '@angular/router';
import { LeadService } from '../../../core/services/lead.service.ts';

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
  loading = false;


private router = inject(Router);
private leadService = inject(LeadService);



  // form fields
  name: string = '';
  contact: string = '';
  phoneLocal: string = '';
  showDropdown = false;

  countryCodes = COUNTRY_CODES;
  selectedCountry: CountryCode = this.countryCodes.find(c => c.iso === 'KW')!;

  selectCountry(c: CountryCode) {
    this.selectedCountry = c;
    this.showDropdown = false;
  }

  get e164Phone(): string {
    return this.selectedCountry.dial + (this.phoneLocal || '').replace(/^0+/, '');
  }
ngOnDestroy() {
  this.showToast = false;
}

  
onSubmit() {
  // basic validation
  if (!this.name) {
    alert('يرجى إدخال الاسم');
    return;
  }

  if (this.type === 'email' && !this.contact) {
    alert('يرجى إدخال البريد الإلكتروني');
    return;
  }

  if (this.type === 'whatsapp' && !this.phoneLocal) {
    alert('يرجى إدخال رقم الهاتف');
    return;
  }

  if (this.loading) return;
  this.loading = true;

  const dto = {
    email: this.type === 'email' ? this.contact.trim() : null,
    phone: this.type === 'whatsapp' ? this.e164Phone : null
  };

  this.leadService.quickRegister(dto).subscribe({
    next: () => {
      this.showToast = true;

      const queryParams: any = {
        fullName: this.name.trim(),
        method: this.type
      };

      if (dto.email) queryParams.email = dto.email;
      if (dto.phone) queryParams.phone = dto.phone;

      setTimeout(() => {
        this.showToast = false;
        this.close.emit();
        this.router.navigate(['/auth/register'], { queryParams });
        this.loading = false;
      }, 1500); // ⏱️ 1.5 ثانية
    },

    error: (err) => {
      alert(err?.error?.message || 'حدث خطأ أثناء التسجيل');
      this.loading = false;
    }
  });
}



   

 
  }

