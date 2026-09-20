import { Injectable, computed, signal } from '@angular/core';
import { Workout } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutState {
  private readonly workoutsState = signal<Workout[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly currentWorkoutState = signal<Workout | null>(null);

  readonly workouts = this.workoutsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly currentWorkout = this.currentWorkoutState.asReadonly();
  readonly workoutCount = computed(() => this.workoutsState().length);

  setWorkouts(workouts: Workout[]): void {
    this.workoutsState.set(workouts);
  }

  setCurrentWorkout(workout: Workout | null): void {
    this.currentWorkoutState.set(workout);
  }

  setLoading(loading: boolean): void {
    this.loadingState.set(loading);
  }

  setError(error: string | null): void {
    this.errorState.set(error);
  }

  reset(): void {
    this.workoutsState.set([]);
    this.currentWorkoutState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}
