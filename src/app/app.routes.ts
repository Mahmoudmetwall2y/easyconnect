import { Routes } from '@angular/router';
import { RegisterComponent } from './features/account/register/register';
import { Booking } from './features/booking/booking';
import { Hotels } from './features/hotels/hotels';
import { HomeHeader } from './features/home/home-header/home-header';
import { SearchResults } from './features/search-results/search-results';
import { NoResults } from './features/flight-search/no-results/no-results';

export const routes: Routes = [
  { path: 'account', component: RegisterComponent },
  { path: 'home', component: HomeHeader },
  { path: 'booking', component: Booking },
  { path: 'hotels', component: Hotels },
{path: 'search',component: SearchResults},
{path:'no-results',component:NoResults},
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/account' } // fallback route

];
