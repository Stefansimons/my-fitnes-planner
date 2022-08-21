import { AuthenticationService } from './authentication.service';
import { environment } from '../../../../environments/environment.prod';

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('interceptor');
    return this.authService.authtoken.pipe(
      take(1),
      exhaustMap((token) => {
        console.log('interceptor=>token=>', token);
        if (!token) {
          return next.handle(req);
        }
        console.log('token=>', token.accessToken);
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', token.accessToken),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
