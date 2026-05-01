import { HttpInterceptorFn } from '@angular/common/http';


export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `296b7f2f-7a8e-4b31-85c8-cd590656d381`
    }
  });

  return next(modifiedReq);
};
