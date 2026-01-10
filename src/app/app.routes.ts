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
import { Login } from './features/account/login/login';
import { AuthGuard } from './core/guards/auth.guard';
import { Account } from './features/account/account';
import { PassengerForm } from './features/booking/passenger-form/passenger-form';

export const routes: Routes = [

  // AUTH PAGES
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: Login }
    ]
  },

  // PUBLIC PAGES
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'home', component: HomeHeader },
      { path: 'hotels', component: Hotels },
      { path: 'search', component: SearchResults },
      { path: 'error', component: ErrorScreen },
      { path: 'no-results', component: NoResults },

      {
        path: 'booking',
        component: Booking,
        canActivate: [AuthGuard]
      },
        {
        path: 'passengers',
        component: PassengerForm,
       
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' },
         {
  path: 'account',
  component: Account,
  canActivate: [AuthGuard]
},
    ]
  },
 

  // FALLBACK
  { path: '**', redirectTo: '/home' }
];
