import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../core/auth/authentication.service';
import { UserService } from './../../services/user.service';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import * as AuthActions from '@auth/store/auth.actions';
import * as fromApp from '../../../../../app/store/app.reducer';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _subsink = new SubSink();
  isLoggedUser: boolean;
  loggedUserFirstName: string;
  constructor(
    private ts: ToastService,
    private us: UserService,
    private auth: AuthenticationService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // ACCOUNT LOCAL STORAGE DATA
    this.store.select('user').subscribe((resUser) => {
      console.log('header user =>', resUser);

      if (resUser.user) {
        const userAuthData = resUser.user;
        this.isLoggedUser = true;
        this.loggedUserFirstName = userAuthData.firstName;
      }
    });
    // if (this.auth.isUserLoggedIn()) {
    //   this.us.loadLocalStorageUserData();
    //   const loggedUser = this.us.getLoggedUserData; // In order to  assigning token to logged user later
    //   this.isLoggedUser = true;
    //   this.loggedUserFirstName = loggedUser.firstName;
    // }

    // const userSub = this.auth.isLoggedUser.subscribe((data) => {
    //   const tempUser = this.us.getLoggedUserData;
    //   this.isLoggedUser = data;
    //   this.loggedUserFirstName = tempUser.firstName;
    // });

    // this._subsink.add(userSub);
  }
  showMessage() {
    this.ts.show('warning', 'Feature will be implemented');
  }

  /**
   *
   */
  logout() {
    // TODO na logout-u prikazati poruku goodbye
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigateByUrl('/home');
  }
  ngOnDestroy() {
    this._subsink.unsubscribe();
  }
}
