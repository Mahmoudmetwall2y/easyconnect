import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register'; // ✅ المسار الصحيح

export const ACCOUNT_ROUTES: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'register', pathMatch: 'full' }, // مؤقتًا نوجهها للتسجيل
];
