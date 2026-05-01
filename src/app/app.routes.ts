import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path : "",
        redirectTo : "home",
        pathMatch : "full"
 },
    {
        path: "home",
        loadComponent: () => import('./main-page/main-page').then(m => m.MainPage)
    },
    {
        path: "shop",
        loadComponent: () => import('./shop/shop').then(m => m.Shop)
    },
    {
        path: "details",
        loadComponent: () => import('./details/details').then(m => m.Details)
    },
    {
        path: "auth",
        loadComponent: () => import('./auth/auth').then(m => m.Auth)
    }
];
