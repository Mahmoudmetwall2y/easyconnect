import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { HomeHeader } from "./features/home/home-header/home-header";
import { TravelTabs } from "./features/home/travel-tabs/travel-tabs";
import { FlightsForm } from "./features/home/flights-form/flights-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HomeHeader, TravelTabs, FlightsForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('easy-travel');
}
