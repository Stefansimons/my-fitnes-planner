import { tap, debounceTime } from 'rxjs/operators';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SpinnerService } from './modules/shared/services/spinner.service';
import { UserService } from './modules/shared/services/user.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

// Firebase user authentification
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  loading$: Observable<boolean>; // SPINNER LOADING

  constructor(
    private fs: AngularFirestore,
    public auth: AngularFireAuth,
    private us: UserService,
    private ss: SpinnerService
  ) {
    this.loading$ = this.ss.loading$;
  }
  ngAfterViewInit(): void {
    // this.loading$.subscribe((data) => {
    //   this.displayProgressSpinner = data;
    //   console.log(
    //     'subscribe=>this.displayProgressSpinner=>',
    //     this.displayProgressSpinner
    //   );
    // });
  }

  ngOnInit(): void {
    if (!this.us.getData()) {
      this.us.saveUser();
    } else {
      this.us.loadUserData();
    }
    // this.loading$.pipe(debounceTime(1000)).subscribe((data) => {
    //   this.showProgressSpinner();
    //   // this.displayProgressSpinner = data;
    //   console.log('subscribe=>data=>', data);
    // });
    // Show/Hide spinner subject
    // this.ss.getIsDisplay().subscribe((data) => {
    //   this.displayProgressSpinner = data;
    // });
    //console.log('fs:', this.fs);
    // const courses = this.fs
    //   .collection('courses')
    //   .add({ name: 'course 1' })
    //   .then((data) => {
    //     console.log('courses:', courses);
    //     return data;
    //   });
  }
  ngOnDestroy(): void {
    console.log('clear local storage');

    this.us.clearUserData();
  }
  public add() {
    const todo = {
      name: 'todo1',
    };
    //    this.store.collection('todo').add(todo);
    console.log('pozvana add');
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

  /**
   * ************************************************** Mat progress spinner test **********************************
   */

  /**
   * Display progress spinner with backdrop for 3 secs on click of button  // NOTE: DELETE THIS AFTER IMPLEMENTAION LOADING WITH OBSERVABLE
   */
  showProgressSpinner = () => {
    this.displayProgressSpinner = true;
    // this.ss.show();
    // setTimeout(() => {
    // this.ss.hide();
    // }, 3000);
  };
  /**
   * Display progress spinner without backdrop for 3 secs on click of button
   */
  showSpinnerWithoutBackdrop = () => {
    this.spinnerWithoutBackdrop = true;
    setTimeout(() => {
      this.spinnerWithoutBackdrop = false;
    }, 3000);
  };
}
