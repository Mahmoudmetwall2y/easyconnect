import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterModal } from "../register-modal/register-modal";

@Component({
  selector: 'app-register-options',
  imports: [CommonModule, FormsModule, RegisterModal],
  templateUrl: './register-options.html',
  styleUrl: './register-options.css'
})
export class RegisterOptions {
 modalType: 'whatsapp' | 'email' | null = null;

  openModal(type: 'whatsapp' | 'email') {
    this.modalType = type;
  }

  closeModal() {
    this.modalType = null;
  }
}
