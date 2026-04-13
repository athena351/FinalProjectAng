import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = '134abb97-d3a1-4dc7-b5f3-329052ed9f56';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('INTERCEPTOR WORKS');

    const modifiedReq = req.clone({
    setHeaders: {
      'X-API-KEY': `${API_KEY}`
    }
  });

  return next(modifiedReq);
};
