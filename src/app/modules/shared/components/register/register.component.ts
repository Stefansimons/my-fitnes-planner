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
    private router: Router
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
    this.auth.register(formValue.email, formValue.password).subscribe(
      (cred) => {
        // Create fb doc with with cred.user.id
        const basicUserData: User = {
          id: cred.user?.uid || '',
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          username: '',
          email: formValue.email,
          password: formValue.password,
          trainings: new Array(),
          code: '',
          updatedAt: new Date(),
          isActive: true,
        };
        // Set local user data
        this.us.saveUser(basicUserData);

        // if remember me == true logg user in
        if (formValue.rememberMe) {
          this.auth.login(formValue.email, formValue.password).subscribe(
            (response) => {
              const tempUser = response as User;
              //    Save user data in local storage
              this.us.emitLoggedUserValue = tempUser;
              this.us.setLocalStorageUserData(tempUser);
              this.us.loadLocalStorageUserData();

              this.auth.setIsLoggedUser = true;

              this.ts.show('Success', `WELLCOME ${tempUser.firstName} 🏋️‍♂️💪`);
              this.router.navigateByUrl('/home'); // if there is not some error
            },
            (error) => this.ts.show('error', `something went wrong ${error}`)
          );
        }
        this.form.reset();
      },
      (error) =>
        this.ts.show(
          'error',
          `Register => Something went wrong error=>${error}`
        )
    );
    // training.trainingDate = this.format(
    //   this.trainingForm.controls['trainingDate'].value
    // );
    // this.dts
    //   .saveTraining(training)
    //   .then((res) => {
    //     this.form.reset();
    //     this.save.emit(true);
    //     this.ts.show('Success', 'Successful insert');
    //   })
    //   .catch((error) => this.ts.show('Error', `${error.message}`));
    // // Emit next value to child component
    //   this.eventsSubject.next(this.userModel.id);
  }
}
