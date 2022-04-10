import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { HelperService } from './modules/shared/services/helper.service';
import { IToast } from './modules/shared/components/toast/toast.component';
import { ToastService } from './modules/shared/services/toast.service';
import { IToken, User } from './modules/shared/models/user.model';
import { AuthenticationService } from './modules/core/auth/authentication.service';
import { SpinnerService } from './modules/shared/services/spinner.service';
import { UserService } from './modules/shared/services/user.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProvaderData } from './modules/shared/models/firebaseUser.model';
import { SubSink } from 'subsink';

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

  isShowToast: boolean = false; // TOAST
  toastData: IToast;
  private _subsink = new SubSink();
  isLoggedUser: boolean = false;
  loggedUserFirstName: string;
  constructor(
    private us: UserService,
    private ss: SpinnerService,
    private auth: AuthenticationService,
    private ts: ToastService,
    private hs: HelperService,
    private router: Router
  ) {
    this.loading$ = this.ss.loading$;
    //  this.loading$
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // LOCAL STORAGE DATA
    if (this.auth.isUserLoggedIn()) {
      this.isLoggedUser = true;
    }

    const userSub = this.auth.isLoggedUser.subscribe((data) => {
      this.isLoggedUser = data;
    });

    const toastSub = this.ts.toastSourceSubject$.subscribe((data) => {
      this.isShowToast = true;
      this.toastData = data;
      // Close toast after 5 sec
      setTimeout(() => {
        this.isShowToast = false;
      }, 7000);
    });

    this._subsink.add(toastSub, userSub);
  }

  ngOnDestroy(): void {
    this._subsink.unsubscribe();
    this.us.clearUserData();
  }
  public add() {
    const todo = {
      name: 'todo1',
    };
    //    this.store.collection('todo').add(todo);
  }

  /**
   * Close toast
   */
  close() {
    this.isShowToast = false;
  }
  /**
   *
   */
  test() {
    this.auth.login('', '');
  }
}
