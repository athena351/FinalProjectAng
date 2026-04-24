import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = '241c5c92-7f36-4030-ad25-c66b898efc4a';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('INTERCEPTOR WORKS');

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `925b76e7-ca1b-4edd-8dea-9f2c34bb4acf`
    }
  });

  return next(modifiedReq);
};
