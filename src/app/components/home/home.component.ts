import { Component, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-home',
  imports: [MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly keycloak = inject(Keycloak);
  userProfile: any;

  async ngOnInit() {
    try {
      this.userProfile = await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  logout() {
    this.keycloak.logout();
  }
  
}
