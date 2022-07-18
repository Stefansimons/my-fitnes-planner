import { ToastService } from './toast.service';
import { SpinnerService } from './spinner.service';
import { trainings } from './firestore.service';
import { Training } from './../../training/models/training.model';
import { environment } from './../../../../environments/environment';
import { userTempData } from './user.service';
import { User } from './../models/user.model';
import { AppConfigService } from './../../../core/app-config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldPath } from 'firebase/firestore';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  // TODO : Implement here error handling global
  fbApi: string = this.appConfs.config.firebase.databaseURL;

  constructor(
    private appConfs: AppConfigService,
    private http: HttpClient,
    private ss: SpinnerService,
    private toasts: ToastService
  ) {}

  /****CRUD REQUESTS TO FIREBASE*/
  /**
   *
   * @param userId
   * @returns
   */
  fetchUserRequest(userId: string) {
    return this.http.get<User>(`${this.fbApi}/users/${userId}.json`);
  }
  /**
   *
   * @param userId
   * @returns
   */
  fetchUsersRequest() {
    return this.http.get<User>(`${this.fbApi}/users.json`);
  }
  /**
   *
   * @param user
   * @returns
   */
  postUserRequest(user: User) {
    return this.http.post<User>(`${this.fbApi}/users.json`, user);
  }
  /**
   *
   * @param user
   * @returns
   */
  putUserRequest(user: User) {
    return this.http
      .put<User>(`${this.fbApi}/users/${user.id}/users.json`, user)
      .pipe(
        tap(() => this.ss.show()),
        catchError((error) => {
          this.toasts.show('Error', `Something went wrong =>${error.message}`);
          return throwError(error);
        })
      );
  }

  /**
   *
   * @param userId
   * @param trainingId
   * @returns
   */
  fetchTrainingsRequest(userId: string) {
    return this.http.get<Training[]>(
      `${this.fbApi}/users/${userId}/trainings.json`
    );
  }
  /**
   *
   * @param userId
   *
   * @returns
   */
  fetchTrainingRequest(userId: string, trainingId: string) {
    return this.http.get<Training>(
      `${this.fbApi}/users/${userId}/trainings/${trainingId}/.json`
    );
  }
  /**
   *
   * @param userId
   * @param training
   * @returns
   */
  postTrainingRequest(userId: string, training: Training) {
    return this.http.post<Training>(
      `${this.fbApi}/users/${userId}/trainings.json`,
      training
    );
  }
  /**
   *
   * @param userId
   * @param training
   * @returns
   */
  putTrainingRequest(userId: string, training: Training) {
    const postUserData = userTempData;
    postUserData.trainings = [];

    return this.http.post<Training>(
      `${this.fbApi}/users/${userId}/trainings/${training.id}/training.json`,
      training
    );
  }
  deleteUserRequest() {}
}
