import { HttpInterceptorFn } from '@angular/common/http';


export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `04649f25-7f25-4259-b346-97902d932794`
    }
  });

  return next(modifiedReq);
};
