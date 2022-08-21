import { ToastService } from './../../shared/services/toast.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private ts: ToastService
  ) {}
  canActivate() {
    return true;
    // if (this.auth.isUserLoggedIn()) {
    //   return true;
    // } else {
    //   this.ts.show('warning', '🙏 login 👈');
    //   this.router.navigateByUrl('/login');
    //   return false;
    // }
  }
}
