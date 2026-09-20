import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import {
  workoutDtoToDomain,
  workoutToDto,
} from '../models/training.adapter';
import { Workout } from '../models/workout.model';
import { WorkoutApiService } from './workout-api.service';
import { WorkoutState } from './workout.state';

@Injectable({ providedIn: 'root' })
export class WorkoutFacade {
  readonly workouts = this.state.workouts;
  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly currentWorkout = this.state.currentWorkout;
  readonly workoutCount = this.state.workoutCount;

  constructor(
    private readonly api: WorkoutApiService,
    private readonly state: WorkoutState
  ) {}

  loadWorkouts(userId: string): Observable<Workout[]> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.getWorkouts(userId).pipe(
      map((dtos) => dtos.map(workoutDtoToDomain)),
      tap((workouts) => this.state.setWorkouts(workouts)),
      catchError((error) => {
        this.state.setError(error.message ?? 'Unable to load workouts.');
        return throwError(() => error);
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  saveWorkouts(userId: string, workouts: Workout[]): Observable<void> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.saveWorkouts(userId, workouts.map(workoutToDto)).pipe(
      tap(() => this.state.setWorkouts(workouts)),
      catchError((error) => {
        this.state.setError(error.message ?? 'Unable to save workouts.');
        return throwError(() => error);
      }),
      finalize(() => this.state.setLoading(false))
    );
  }
}
