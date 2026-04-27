import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = '241c5c92-7f36-4030-ad25-c66b898efc4a';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `6c325fd1-defe-4a7a-a8ab-1ea112c241d2`
    }
  });

  return next(modifiedReq);
};
