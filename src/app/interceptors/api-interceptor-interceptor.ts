import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = '54719a79-7505-4ace-a7f3-9df16edc0fe0';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('INTERCEPTOR WORKS');

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `54719a79-7505-4ace-a7f3-9df16edc0fe0`
    }
  });

  return next(modifiedReq);
};
