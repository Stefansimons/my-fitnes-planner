import { ToastService } from './../../shared/services/toast.service';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private ts: ToastService) {}
  canActivate() {
    if (this.auth.isCorrectUserRole()) {
      return true;
    } else {
      this.ts.show(
        'warning',
        'You do not have right permission for this page ✋❗'
      );
      return false;
    }
  }
}
