import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthServ } from '../services/auth-serv';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthServ);
  const router = inject(Router);
  const token = auth.getToken();

  const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `cf255111-ce51-4a66-bef3-1389ea613a8a`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && token) {
        localStorage.removeItem('accessToken');
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    }),
  );
};
