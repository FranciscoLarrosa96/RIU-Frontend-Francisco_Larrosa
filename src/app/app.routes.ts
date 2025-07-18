import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/heroes/list/list').then(m => m.List)
    },
    {
        path: 'heroes/details/:id',
        loadComponent: () => import('./pages/heroes/detail/detail').then(m => m.Detail)
    },
];
