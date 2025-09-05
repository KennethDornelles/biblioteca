import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToLogin() {
    console.log('Navegando para login...');
    this.router.navigate(['/login']);
  }

  goToRegister() {
    console.log('Navegando para registro...');
    this.router.navigate(['/register']);
  }
}
