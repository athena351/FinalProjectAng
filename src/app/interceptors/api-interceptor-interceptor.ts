import { HttpInterceptorFn } from '@angular/common/http';


export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `3467242a-1864-4d13-a9f7-e8bc6aa96dcf`
    }
  });

  return next(modifiedReq);
};
