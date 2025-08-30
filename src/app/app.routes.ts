import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        data: {
            role: ['admin']
        },
        canActivate: [canActivateAuthRole]
    }
];