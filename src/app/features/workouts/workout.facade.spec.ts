import { of, throwError } from 'rxjs';
import { WorkoutApiService } from './services/workout-api.service';
import { WorkoutState } from './workout.state';
import { WorkoutFacade } from './workout.facade';
import { WorkoutDto } from './models/workout.dto';
import { Workout } from './models/workout.model';

class FakeWorkoutApiService {
  workouts: WorkoutDto[] = [];
  savedWorkouts: WorkoutDto[] | undefined;

  getWorkouts() {
    return of(this.workouts);
  }

  saveWorkouts(_userId: string, workouts: WorkoutDto[]) {
    this.savedWorkouts = workouts;
    return of(void 0);
  }
}

describe('WorkoutFacade', () => {
  let api: FakeWorkoutApiService;
  let state: WorkoutState;
  let facade: WorkoutFacade;

  const workout: Workout = {
    id: 1,
    date: '2026-01-15',
    type: 'Push',
    isActive: true,
    updatedAt: new Date('2026-01-15T10:00:00.000Z'),
    exercises: [],
  };

  beforeEach(() => {
    api = new FakeWorkoutApiService();
    state = new WorkoutState();
    facade = new WorkoutFacade(
      api as unknown as WorkoutApiService,
      state
    );
  });

  it('loads DTOs into domain workouts and updates state', () => {
    api.workouts = [
      {
        id: 1,
        trainingDate: workout.date,
        typeOfTraining: workout.type,
        exercises: [],
        isActive: true,
        updatedAt: workout.updatedAt,
      },
    ];

    let result: Workout[] | undefined;
    facade.loadWorkouts('user-1').subscribe((workouts) => (result = workouts));

    expect(result).toEqual([workout]);
    expect(facade.workouts()).toEqual([workout]);
    expect(facade.loading()).toBeFalse();
    expect(facade.error()).toBeNull();
  });

  it('creates a workout through the API and updates state', () => {
    facade.createWorkout('user-1', workout).subscribe();

    expect(api.savedWorkouts?.length).toBe(1);
    expect(api.savedWorkouts?.[0].typeOfTraining).toBe('Push');
    expect(facade.workouts()).toEqual([workout]);
  });

  it('updates, deletes, and finishes workouts through the facade', () => {
    state.setWorkouts([workout]);
    const updatedWorkout = { ...workout, type: 'Legs' };

    facade.updateWorkout('user-1', updatedWorkout).subscribe();
    expect(facade.workouts()[0].type).toBe('Legs');

    facade.finishWorkout('user-1', 1).subscribe();
    expect(facade.workouts()[0].isActive).toBeFalse();

    facade.deleteWorkout('user-1', 1).subscribe();
    expect(facade.workouts()).toEqual([]);
  });

  it('stores API failures in state and rethrows them', () => {
    const failingApi = {
      getWorkouts: () => throwError(() => new Error('network error')),
      saveWorkouts: () => of(void 0),
    } as unknown as WorkoutApiService;
    const failingFacade = new WorkoutFacade(failingApi, state);

    failingFacade.loadWorkouts('user-1').subscribe({
      error: () => undefined,
    });

    expect(failingFacade.error()).toBe('network error');
    expect(failingFacade.loading()).toBeFalse();
  });
});
