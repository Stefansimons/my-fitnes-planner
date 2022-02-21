import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'my-fitnes-planner-app';

  constructor(private fs: AngularFirestore, public auth: AngularFireAuth) {}
  ngOnInit(): void {
    //console.log('fs:', this.fs);
    // const courses = this.fs
    //   .collection('courses')
    //   .add({ name: 'course 1' })
    //   .then((data) => {
    //     console.log('courses:', courses);
    //     return data;
    //   });
    const cs = this.fs
      .collection('courses')
      .valueChanges()
      .subscribe((data) => {
        const temp = data;

        console.log(temp);
        return temp;
      });
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
}
