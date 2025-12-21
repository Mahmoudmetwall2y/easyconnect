import { Component, computed, inject, signal } from '@angular/core';
import { COUNTRY_CODES, CountryCode } from '../../../shared/data/country-codes';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
private route = inject(ActivatedRoute);


  countryCodes = COUNTRY_CODES;
  showDropdown = false;
  selectedCountry = this.countryCodes.find(c => c.iso === 'KW')!;

  loading = signal(false);
  apiError = signal<string | null>(null);
  apiSuccess = signal<string | null>(null);

  eyeIcon = '<i class="fa-solid fa-eye text-gray-500"></i>';
  eyeSlashIcon = '<i class="fa-solid fa-eye-slash "></i>';

  showPassword = false;
  togglePassword() { this.showPassword = !this.showPassword; }

  form = this.fb.group({
    countryDial: ['+965', Validators.required],
    phoneLocal: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  getErrorMessage(controlName: string): string | null {
    const c = this.form.get(controlName);
    if (!c || !c.errors || !c.touched) return null;

    if (c.errors['required']) return 'هذا الحقل مطلوب';
    if (c.errors['pattern']) return 'الرجاء إدخال قيمة صحيحة';
    if (c.errors['minlength']) return 'الحد الأدنى للطول غير كافٍ';

    return null;
  }

  e164Phone = computed(() => {
    const dial = this.form.value.countryDial ?? '';
    let local = (this.form.value.phoneLocal ?? '').trim();
    if (local.startsWith('0')) local = local.substring(1);
    return dial + local;
  });

  submit() {
    this.apiError.set(null);
    this.apiSuccess.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.apiError.set('الرجاء إدخال بيانات صحيحة');
      return;
    }

    this.loading.set(true);

    const dto = {
      phone: this.e164Phone(),
      password: this.form.value.password!
    };

    this.auth.login(dto).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.succeeded && res.data) {
               this.apiSuccess.set('تم تسجيل الدخول بنجاح');
          console.log(res);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
     

const returnUrl =
  this.route.snapshot.queryParamMap.get('returnUrl') || '/home';

this.router.navigateByUrl(returnUrl);
        } else {
          this.apiError.set(res.message || 'فشل تسجيل الدخول');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.apiError.set(err?.error?.message || 'خطأ في الخادم');
      }
    });
  }

  selectCountry(c: CountryCode) {
    this.selectedCountry = c;
    this.form.patchValue({ countryDial: c.dial });
    this.showDropdown = false;
  }
}
