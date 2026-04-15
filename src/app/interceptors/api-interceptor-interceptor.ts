import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = '6edf87a6-1a90-429b-b3a5-01a5268656a4';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('INTERCEPTOR WORKS');

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `${API_KEY}`
    }
  });

  return next(modifiedReq);
};
