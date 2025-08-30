import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { environment } from '../environments/environment';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';


export const routes: Routes = [
    {
        path: 'unauthorised',
        component: UnauthorisedComponent
    },
    {
        path: '',
        pathMatch: 'full',  
        component: HomeComponent,
        data: {
            role: [environment.keycloak.role]
        },
        canActivate: [canActivateAuthRole]
    }
];