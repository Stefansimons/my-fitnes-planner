import { ToastService } from './../../shared/services/toast.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private ts: ToastService
  ) {}
  canActivate() {
    if (this.auth.isUserLoggedIn()) {
      return true;
    } else {
      this.ts.show('warning', '🙏 login 👈');
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
