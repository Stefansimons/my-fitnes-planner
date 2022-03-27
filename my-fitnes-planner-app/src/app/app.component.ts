import { ToastService } from './modules/shared/services/toast.service';
import { IToken, User } from './modules/shared/models/user.model';
import { AuthenticationService } from './modules/core/auth/authentication.service';
import { SpinnerService } from './modules/shared/services/spinner.service';
import { UserService } from './modules/shared/services/user.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProvaderData } from './modules/shared/models/firebaseUser.model';

interface Item {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'my-fitnes-planner-app';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  spinnerWithoutBackdrop = false;
  user: User;
  loading$: Observable<boolean>; // SPINNER LOADING

  constructor(
    private us: UserService,
    private ss: SpinnerService,
    private auth: AuthenticationService,
    private ts: ToastService
  ) {
    this.loading$ = this.ss.loading$;
    //  this.loading$
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    console.log('app on init');

    // TODO this.us.getFirebaseUser('9cQyfjp2zLt1pkK5IUtF');
    if (!this.us.getData()) {
      this.us.saveUser();
    } else {
      this.us.loadUserData();
      this.user = this.us.getLoggedUserData(); // In order to  assigning token to logged user later
    }
  }
  ngOnDestroy(): void {
    this.us.clearUserData();
  }
  public add() {
    const todo = {
      name: 'todo1',
    };
    //    this.store.collection('todo').add(todo);
  }
  login() {
    this.ss.show();
    this.auth
      .login('stefanfb123@gmail.com', 'fanstefb321')
      .then((res) => {
        return res.user.toJSON();
        // const tempTokenData:IToken ={...res._t
        // }
      })
      .then((data: any) => {
        const token: IToken = data.stsTokenManager;

        this.user.token = token;
        // Update local storage with user data
        this.us.updateLocalStorageUserData(this.user);
        // Hide spinner
        this.ss.hide();
        // Show toast
        this.ts.show('Success', 'Successful login');
      })
      .catch((error) => {
        this.ts.show('Error', `Something went wrong => msg:${error.message}`);
      });
  }
  logout() {
    this.auth.logout();
    this.ts.show('Success', 'Successful logout');
    const user = this.us.getLoggedUserData();
    // Remove token
    user.token = undefined;
    this.us.updateLocalStorageUserData(user);
  }
}
