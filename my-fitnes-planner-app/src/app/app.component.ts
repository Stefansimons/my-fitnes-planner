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
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    if (!this.us.getData()) {
      this.us.saveUser();
    } else {
      this.us.loadUserData();
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
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }
}
