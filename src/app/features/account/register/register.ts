// src/app/features/account/register/register.ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes'; // ✅ استيراد ملف الأعلام

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  countryCodes = COUNTRY_CODES; // ✅ نستخدمه في القالب

  showDropdown = false;
selectedCountry = this.countryCodes.find(c => c.iso === 'KW')!;


  loading = signal(false);
  apiError = signal<string | null>(null);
  apiSuccess = signal<string | null>(null);

 
  eyeIcon = '<i class="fa-solid fa-eye text-gray-500"></i>';
eyeSlashIcon = '<i class="fa-solid fa-eye-slash "></i>';

showPassword = false;
showConfirm = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

toggleConfirm() {
  this.showConfirm = !this.showConfirm;
}


  // ✅ النموذج
  form = this.fb.group({
    fullName: [''],
    email: [''], // خلي الإيميل اختياري بدون Validators
   countryDial: ['+965', [Validators.required]],

    phoneLocal: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // 🔹 رقم الهاتف الكامل بصيغة E.164
  e164Phone = computed(() => {
    const dial = this.form.value.countryDial ?? '';
    let local = (this.form.value.phoneLocal ?? '').toString().trim();
    if (local.startsWith('0')) local = local.substring(1);
    return dial + local;
  });

  // ✅ الإرسال
  submit(): void {
    this.apiError.set(null);
    this.apiSuccess.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.apiError.set('Please fill all required fields correctly.');
      return;
    }

    this.loading.set(true);

    const dto = {
      email: this.form.value.email?.trim() || null, 
      phone: this.e164Phone(),
      password: (this.form.value.password ?? '').toString()
    };

    this.auth.register(dto).subscribe({
      next: (res) => {
        console.log('Form valid?', this.form.valid, 'DTO:', dto);

        this.loading.set(false);
        if (res.succeeded) {
          this.apiSuccess.set(res.message ?? 'Registered successfully.');
          this.form.reset({ countryDial: '+20' });
        } else {
          this.apiError.set(res.message || 'Registration failed.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.message ||
          err?.error ||
          (err.status === 409 ? 'Email or phone already in use.' : 'Server error.');
        this.apiError.set(msg);
      }
    });
  }

  // ✅ مساعد للتحقق من الحقول
  controlInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
  selectCountry(c: CountryCode) {
  this.selectedCountry = c;
  this.form.patchValue({ countryDial: c.dial });
  this.showDropdown = false;
}




}
