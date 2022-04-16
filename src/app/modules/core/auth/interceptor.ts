import { Store } from '@ngrx/store';
import { environment } from './../../../../environments/environment.prod';

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducer';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log(`interceptor`);

    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token.accessToken), // This set param in requestUrl , see network => requestUrl .  This is firebase realtime database secure rule
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
