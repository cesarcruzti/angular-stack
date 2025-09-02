import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { environment } from '../environments/environment';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
    {
        path: 'unauthorised',
        component: UnauthorisedComponent
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        pathMatch: 'full',  
        component: DashboardComponent,
        data: {
            role: [environment.keycloak.role]
        },
        canActivate: [canActivateAuthRole]
    }
];