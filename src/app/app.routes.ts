import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('./features/flights/flights.routes').then(m => m.FLIGHTS_ROUTES),
  },
  {
    path: 'booking',
    loadChildren: () =>
      import('./features/booking/booking.routes').then(m => m.BOOKING_ROUTES),
  },
  {
    path: 'hotels',
    loadChildren: () =>
      import('./features/hotels/hotels.routes').then(m => m.HOTELS_ROUTES),
  },
  { path: '', redirectTo: '/account', pathMatch: 'full' },
];
