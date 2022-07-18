import { Store } from '@ngrx/store';
import { SpinnerService } from './../../services/spinner.service';
import { ToastService } from './../../services/toast.service';
import { UserService } from './../../services/user.service';
import { AuthenticationService } from './../../../core/auth/authentication.service';
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as AuthActions from '@auth/store/auth.actions';
import * as fromApp from '../../../../../app/store/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private us: UserService,
    private ts: ToastService,
    private router: Router,
    private sS: SpinnerService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // Initialization of register form for preventing error getting value of getters
    this.registerForm = this.fb.group({
      id: [null],
      createdAt: new FormControl({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }),
      firstName: ['Sima', Validators.required],
      username: ['SimaSimic', Validators.required],
      lastName: ['Simic', Validators.required],
      email: ['simasimic@gmail.com', [Validators.required, Validators.email]],
      password: ['sifra123', [Validators.required]],
      passwordRpt: ['sifra123', [Validators.required]],
      rememberMe: [true],
    });
  }
  /**
   *  convenience getters for easy access to form fields , Angular 8
   */
  get form() {
    return this.registerForm;
  }
  /**
   *
   * @param training
   */
  register(formValue: any) {
    if (!this.form.valid) return;

    const userData = {
      firstname: formValue.firstName,
      lastname: formValue.lastName,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
    };
    this.store.dispatch(new AuthActions.SignupStart(userData));

    this.router.navigateByUrl('/login'); // if there is not some error
    this.form.reset();
    this.sS.hide();
  }
}
