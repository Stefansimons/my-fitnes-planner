import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import {
  workoutDtoToDomain,
  workoutToTraining,
  workoutToDto,
} from './adapters/training.adapter';
import { Workout } from './models/workout.model';
import { Training } from './models/training.model';
import { WorkoutApiService } from './services/workout-api.service';
import { WorkoutState } from './workout.state';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class WorkoutFacade {
  readonly workouts = this.state.workouts;
  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly currentWorkout = this.state.currentWorkout;
  readonly workoutCount = this.state.workoutCount;
  readonly page = this.state.page;
  readonly pageSize = this.state.pageSize;
  readonly searchTerm = this.state.searchTerm;
  readonly sortColumn = this.state.sortColumn;
  readonly sortDirection = this.state.sortDirection;
  readonly workouts$: Observable<Training[]> = toObservable(this.state.pagedWorkouts).pipe(
    map((workouts: Workout[]) => workouts.map(workoutToTraining))
  );
  readonly total$ = toObservable(this.state.total);

  setPage(page: number): void {
    this.state.setPage(page);
  }

  setPageSize(pageSize: number): void {
    this.state.setPageSize(pageSize);
  }

  setSearchTerm(searchTerm: string): void {
    this.state.setSearchTerm(searchTerm);
  }

  setSort(column: 'id' | 'date' | 'type' | '', direction: 'asc' | 'desc' | ''): void {
    this.state.setSort(column, direction);
  }

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

  createWorkout(userId: string, workout: Workout): Observable<void> {
    const nextId = this.workouts().reduce(
      (highestId, currentWorkout) => Math.max(highestId, currentWorkout.id ?? 0),
      0
    ) + 1;
    const workoutToCreate = { ...workout, id: workout.id ?? nextId };

    return this.saveWorkouts(userId, [...this.workouts(), workoutToCreate]);
  }

  updateWorkout(userId: string, workout: Workout): Observable<void> {
    if (workout.id === undefined) {
      return this.rejectOperation('A workout ID is required to update a workout.');
    }

    const workoutExists = this.workouts().some((item) => item.id === workout.id);
    if (!workoutExists) {
      return this.rejectOperation('The workout to update was not found.');
    }

    const updatedWorkouts = this.workouts().map((item) =>
      item.id === workout.id ? workout : item
    );

    return this.saveWorkouts(userId, updatedWorkouts);
  }

  deleteWorkout(userId: string, workoutId: number): Observable<void> {
    const updatedWorkouts = this.workouts().filter((item) => item.id !== workoutId);
    if (updatedWorkouts.length === this.workouts().length) {
      return this.rejectOperation('The workout to delete was not found.');
    }

    return this.saveWorkouts(userId, updatedWorkouts);
  }

  finishWorkout(userId: string, workoutId: number): Observable<void> {
    const workout = this.workouts().find((item) => item.id === workoutId);
    if (!workout) {
      return this.rejectOperation('The workout to finish was not found.');
    }

    return this.updateWorkout(userId, { ...workout, isActive: false });
  }

  private rejectOperation(message: string): Observable<void> {
    this.state.setError(message);
    return throwError(() => new Error(message));
  }
}
