import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterSection } from '../../shared/components/footer-section/footer-section';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet,FooterSection,Navbar],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}
