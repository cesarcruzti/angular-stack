import { Component, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-home',
  imports: [MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule],
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
