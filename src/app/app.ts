import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { HomeHeader } from "./features/home/home-header/home-header";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HomeHeader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('easy-travel');
}
