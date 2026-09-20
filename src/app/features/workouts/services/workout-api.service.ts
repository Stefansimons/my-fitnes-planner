import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { updateDoc } from 'firebase/firestore';
import { WorkoutDto } from '../models/workout.dto';
import { WorkoutApiError } from './workout-api.error';

interface UserWorkoutDocument {
  trainings?: WorkoutDto[];
}

@Injectable({ providedIn: 'root' })
export class WorkoutApiService {
  constructor(private readonly firestore: Firestore) {}

  getWorkouts(userId: string): Observable<WorkoutDto[]> {
    const userDocument = doc(this.firestore, `users/${userId}`);

    return docData(userDocument).pipe(
      map((user) => (user as UserWorkoutDocument | undefined)?.trainings ?? []),
      catchError((error) =>
        throwError(
          () => new WorkoutApiError('Unable to load workouts.', 'getWorkouts', error)
        )
      )
    );
  }

  saveWorkouts(userId: string, workouts: WorkoutDto[]): Observable<void> {
    const userDocument = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userDocument, { trainings: workouts })).pipe(
      catchError((error) =>
        throwError(
          () => new WorkoutApiError('Unable to save workouts.', 'saveWorkouts', error)
        )
      )
    );
  }
}
