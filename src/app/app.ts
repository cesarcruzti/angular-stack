import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import Keycloak from 'keycloak-js';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    CommonModule,
    RouterLink, 
    RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-app');
  readonly keycloak = inject(Keycloak);
  userProfile: any;

  async ngOnInit() {
    try {
      this.userProfile = await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  logout() {
    this.keycloak.logout({redirectUri: window.location.origin + '/'});
  }

  login() {
    this.keycloak.login();
  }
}
