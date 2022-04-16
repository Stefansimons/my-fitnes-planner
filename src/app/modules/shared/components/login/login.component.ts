import { UserService } from './../../services/user.service';
import { ToastService } from './../../services/toast.service';
import { Router } from '@angular/router';
import { IToken, User } from './../../models/user.model';
import { SpinnerService } from './../../services/spinner.service';
import { AuthenticationService } from './../../../core/auth/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subsink = new SubSink();
  constructor(
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
    private ts: ToastService,
    private us: UserService,
    private sS: SpinnerService
  ) {}
  ngOnDestroy(): void {
    this._subsink.unsubscribe();
  }

  loginForm: FormGroup;

  ngOnInit(): void {
    // Initialization of register form for preventing error getting value of getters
    this.loginForm = this.fb.group({
      id: [null],
      loginAt: new FormControl({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }),
      loginAtTimestamp: new FormControl(new Date().getTime()),
      email: ['simasimic@gmail.com', [Validators.required, Validators.email]],
      password: ['sifra123', [Validators.required]],
      rememberMe: [true],
    });
  }
  /**
   *  convenience getters for easy access to form fields , Angular 8
   */
  get form() {
    return this.loginForm;
  }

  /**
   *
   * @param credentials
   * @returns
   */
  login(credentials: any) {
    if (!this.form.valid) return;
    const loginSub = this.auth
      .login(credentials.email, credentials.password)
      .subscribe(
        (responseData) => {
          // Empty response because api for post doesnt returna any response!
          console.log(`subscribe responseData => ${responseData}`);
          //    Save user data in local storage

          this.sS.hide();
          this.router.navigateByUrl('/home'); // if there is not some error
        },
        (responseError) =>
          this.ts.show('error', `something went wrong ${responseError}`)
      );

    this._subsink.add(loginSub); // NOTE WITHOUT SUBSINK OTHER BUTTON TRIGER LOGIN SUBSCRIBE!!!!
  }
}
