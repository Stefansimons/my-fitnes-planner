import { Training } from './../../training/models/training.model';
import { UserService } from './../../shared/services/user.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Resolve,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResolveGuard implements Resolve<Training[]> {
  constructor(private users: UserService) {}
  resolve() {
    // TODO: Give samo other data source
    return this.users.getTrainings;
  }
}
