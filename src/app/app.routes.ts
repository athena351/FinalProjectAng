import { Routes } from '@angular/router';
import { Account } from './account/account';
import { authGuardGuard } from './auth-guard-guard';
import { ProfileInfo } from './profile-info/profile-info';
import { FullCart } from './full-cart/full-cart';
import { Favorites } from './favorites/favorites';
import { Settings } from './settings/settings';

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
    },
    {
        path: "login",
        loadComponent: () => import('./login/login').then(m => m.Login)
    },
    {
        path: "cart",
        loadComponent: () => import('./cart/cart').then(m => m.Cart)
    },
    {
        path: "account",
        component: Account,
        canActivate: [authGuardGuard],
        children : [
            { path: 'profile', component: ProfileInfo },
            { path: 'cart', component: FullCart },
            { path: 'favorites', component: Favorites },
            { path: 'settings', component: Settings },
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
        ]
    },
     {
        path: "**",
        loadComponent: () => import('./error/error').then(m => m.Error)
    }
];
