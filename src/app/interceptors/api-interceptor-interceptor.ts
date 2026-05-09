import { HttpInterceptorFn } from '@angular/common/http';


export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `a1acad61-3941-411b-93a6-e9cf3e85ff21`
    }
  });

  return next(modifiedReq);
};
