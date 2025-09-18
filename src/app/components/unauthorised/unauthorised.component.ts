import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import Keycloak, { KeycloakLogoutOptions } from 'keycloak-js';

@Component({
  selector: 'app-unauthorised',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './unauthorised.component.html',
  styleUrl: './unauthorised.component.scss'
})
export class UnauthorisedComponent {
  private readonly keycloak = inject(Keycloak);
  logout(){
    const options: KeycloakLogoutOptions = {
      redirectUri: window.location.origin + '/'
    };
    this.keycloak.login(options);
  }

}
