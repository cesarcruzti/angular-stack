import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { environment } from '../environments/environment';


export const routes: Routes = [ 
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