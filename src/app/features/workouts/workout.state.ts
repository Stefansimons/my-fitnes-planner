import { Injectable, computed, signal } from '@angular/core';
import { Workout } from './models/workout.model';

export type WorkoutSortColumn = 'id' | 'date' | 'type' | '';
export type WorkoutSortDirection = 'asc' | 'desc' | '';

@Injectable({ providedIn: 'root' })
export class WorkoutState {
  private readonly workoutsState = signal<Workout[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly currentWorkoutState = signal<Workout | null>(null);
  private readonly pageState = signal(1);
  private readonly pageSizeState = signal(4);
  private readonly searchTermState = signal('');
  private readonly sortColumnState = signal<WorkoutSortColumn>('');
  private readonly sortDirectionState = signal<WorkoutSortDirection>('');

  readonly workouts = this.workoutsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly currentWorkout = this.currentWorkoutState.asReadonly();
  readonly workoutCount = computed(() => this.workoutsState().length);
  readonly page = this.pageState.asReadonly();
  readonly pageSize = this.pageSizeState.asReadonly();
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly sortColumn = this.sortColumnState.asReadonly();
  readonly sortDirection = this.sortDirectionState.asReadonly();
  readonly filteredWorkouts = computed(() => {
    const searchTerm = this.searchTermState().trim().toLowerCase();

    if (!searchTerm) {
      return this.workoutsState();
    }

    return this.workoutsState().filter((workout) =>
      workout.type.toLowerCase().includes(searchTerm) ||
      workout.exercises.some((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm)
      )
    );
  });
  readonly total = computed(() => this.filteredWorkouts().length);
  readonly pagedWorkouts = computed(() => {
    const sortedWorkouts = [...this.filteredWorkouts()];
    const column = this.sortColumnState();
    const direction = this.sortDirectionState();

    if (column && direction) {
      sortedWorkouts.sort((firstWorkout, secondWorkout) => {
        const firstValue = this.sortValue(firstWorkout, column);
        const secondValue = this.sortValue(secondWorkout, column);
        const comparison = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    const start = (this.pageState() - 1) * this.pageSizeState();
    return sortedWorkouts.slice(start, start + this.pageSizeState());
  });

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

  setPage(page: number): void {
    this.pageState.set(page);
  }

  setPageSize(pageSize: number): void {
    this.pageSizeState.set(pageSize);
    this.pageState.set(1);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchTermState.set(searchTerm);
    this.pageState.set(1);
  }

  setSort(column: WorkoutSortColumn, direction: WorkoutSortDirection): void {
    this.sortColumnState.set(column);
    this.sortDirectionState.set(direction);
    this.pageState.set(1);
  }

  reset(): void {
    this.workoutsState.set([]);
    this.currentWorkoutState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);
    this.pageState.set(1);
    this.pageSizeState.set(4);
    this.searchTermState.set('');
    this.sortColumnState.set('');
    this.sortDirectionState.set('');
  }

  private sortValue(workout: Workout, column: Exclude<WorkoutSortColumn, ''>): string | number {
    switch (column) {
      case 'id':
        return workout.id ?? 0;
      case 'date':
        return workout.date;
      case 'type':
        return workout.type;
    }
  }
}
