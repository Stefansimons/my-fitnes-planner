import { Router } from '@angular/router';
import { AuthenticationService } from './../../../core/auth/authentication.service';
import { UserService } from './../../services/user.service';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private _subsink = new SubSink();
  isLoggedUser: boolean;
  loggedUserFirstName: string;
  constructor(
    private ts: ToastService,
    private us: UserService,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ACCOUNT LOCAL STORAGE DATA
    if (this.auth.isUserLoggedIn()) {
      const loggedUser = this.us.getLoggedUserData; // In order to  assigning token to logged user later
      this.isLoggedUser = true;
      this.loggedUserFirstName = 'Stefan';
    }

    const userSub = this.auth.isLoggedUser.subscribe((data) => {
      console.log('isLoggedUser subscribe');

      const tempUser = this.us.getLoggedUserData;
      this.isLoggedUser = data;
      this.loggedUserFirstName = 'Stefan';
    });

    this._subsink.add(userSub);
  }
  showMessage() {
    this.ts.show('warning', 'Feature will be implemented');
  }

  /**
   *
   */
  logout() {
    this.auth.logUserOut();
    this.isLoggedUser = false;
    this.auth.setIsLoggedUser = false;
    this.router.navigateByUrl('/home');
  }
}
