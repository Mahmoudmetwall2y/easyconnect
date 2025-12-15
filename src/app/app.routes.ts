import { Routes } from '@angular/router';
import { RegisterComponent } from './features/account/register/register';
import { Booking } from './features/booking/booking';
import { Hotels } from './features/hotels/hotels';
import { HomeHeader } from './features/home/home-header/home-header';
import { SearchResults } from './features/search-results/search-results';
import { NoResults } from './features/flight-search/no-results/no-results';
import { ErrorScreen } from './features/flight-search/error-screen/error-screen';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

export const routes: Routes = [

   {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'register', component: RegisterComponent },
      // لو عندك login بعدين هضيفه هنا
    ]
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'home', component: HomeHeader },
      { path: 'booking', component: Booking },
      { path: 'hotels', component: Hotels },
      { path: 'search', component: SearchResults },
      { path: 'error', component: ErrorScreen },
      { path: 'no-results', component: NoResults },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/auth/register' }

];
