import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  countryCodes = COUNTRY_CODES;

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

  // FORM
  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: [''],
    countryDial: ['+965', [Validators.required]],
    phoneLocal: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  // RETURN CUSTOM VALIDATION MSG
  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);

    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['required']) return 'هذا الحقل مطلوب';
    if (control.errors['minlength']) return 'الحد الأدنى للطول غير كافٍ';
    if (control.errors['pattern']) return 'الرجاء إدخال قيمة صحيحة';

    return null;
  }

  // FULL PHONE NUMBER
  e164Phone = computed(() => {
    const dial = this.form.value.countryDial ?? '';
    let local = (this.form.value.phoneLocal ?? '').toString().trim();
    if (local.startsWith('0')) local = local.substring(1);
    return dial + local;
  });

  // SUBMIT FORM
  submit(): void {
    this.apiError.set(null);
    this.apiSuccess.set(null);

    // VALIDATE ALL
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.apiError.set('الرجاء التأكد من تعبئة الحقول المطلوبة بشكل صحيح.');
      return;
    }

    // PASSWORD MATCH CHECK
    const password = this.form.value.password;
    const confirmPassword = this.form.value.confirmPassword;

    if (password !== confirmPassword) {
      this.apiError.set("كلمة المرور غير متطابقة");
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.loading.set(true);

    const dto = {
      fullName: this.form.value.fullName?.trim() || null,
      email: this.form.value.email?.trim() || null,
      phone: this.e164Phone(),
      password: (this.form.value.password ?? '').toString()
    };

    this.auth.register(dto).subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res.succeeded) {
          this.apiSuccess.set('تم تسجيل المستخدم بنجاح');
          this.form.reset({ countryDial: this.selectedCountry.dial });
        } else {
          this.apiError.set(res.message || 'Registration failed.');
        }
      },

      error: (err) => {
        this.loading.set(false);

        const msg =
          err?.error?.message ||
          err?.error ||
          (err.status === 409 ? 'البريد أو الهاتف مستخدم بالفعل.' : 'خطأ في الخادم.');

        this.apiError.set(msg);
      }
    });
  }

  // CHECK CONTROL INVALID
  controlInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  // SELECT COUNTRY
  selectCountry(c: CountryCode) {
    this.selectedCountry = c;
    this.form.patchValue({ countryDial: c.dial });
    this.showDropdown = false;
  }
}
