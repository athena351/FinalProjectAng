import { HttpInterceptorFn } from '@angular/common/http';


export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `512bfe19-cd9f-49c3-afb4-42b7eec7753c`
    }
  });

  return next(modifiedReq);
};
