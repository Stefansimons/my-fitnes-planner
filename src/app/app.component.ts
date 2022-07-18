import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { environment } from './../environments/environment';
import { HttpRequestsService } from './modules/shared/services/http-requests.service';
import { Router } from '@angular/router';
import { HelperService } from './modules/shared/services/helper.service';
import { IToast } from './modules/shared/components/toast/toast.component';
import { ToastService } from './modules/shared/services/toast.service';
import { User } from './modules/shared/models/user.model';
import { SpinnerService } from './modules/shared/services/spinner.service';
import { UserService } from './modules/shared/services/user.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import * as fromApp from '@store/app.reducer';
import * as AuthActions from '@auth/store/auth.actions';
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
  isAuthenticated = false;
  loggedUserFirstName: string;
  constructor(
    private us: UserService,
    private ss: SpinnerService,
    private ts: ToastService,
    private hs: HelperService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
    // TODO: DELETE HttpRequestsService
    this.loading$ = this.ss.loading$;
    //  this.loading$
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    const userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
      });

    // const userSub = this.auth.isLoggedUser.subscribe((data) => {
    //   this.isLoggedUser = data;
    // });
    const toastSub = this.ts.toastSourceSubject$.subscribe((data) => {
      this.isShowToast = true;
      this.toastData = data;
      // Close toast after 5 sec
      setTimeout(() => {
        this.isShowToast = false;
      }, 10000);
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
  // test() {
  //   this.auth.login('', '');
  // }
}
