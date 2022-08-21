import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { ToastService } from './../../services/toast.service';
import { Router } from '@angular/router';
import { IToken, User, AuthResponseData } from './../../models/user.model';
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
    private ss: SpinnerService
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
      email: ['simasimic12@gmail.com', [Validators.required, Validators.email]],
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

    let authObs: Observable<User | null>;
    authObs = this.auth.login(credentials.email, credentials.password);

    this._subsink.add(
      authObs.subscribe(
        (resData) => {
          const tempUser = resData as User;

          this.ts.show('success', `WELLCOME ${tempUser.firstName} 🏋️‍♂️💪`);
          this.router.navigateByUrl('/home'); // if there is not some error
          //this.isLoading = false;

          this.router.navigate(['/home']);
          this.ss.hide();
        },
        (errorMessage) => {
          this.ts.show('error', `something went wrong ${errorMessage}`);
          this.ss.hide();

          // this.isLoading = false;
        }
      )
    ); // NOTE WITHOUT SUBSINK OTHER BUTTON TRIGER LOGIN SUBSCRIBE!!!!

    this.form.reset();
  }
}
