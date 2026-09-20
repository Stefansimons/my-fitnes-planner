import { WorkoutState } from './workout.state';
import { Workout } from './models/workout.model';

describe('WorkoutState', () => {
  let state: WorkoutState;

  const workout: Workout = {
    id: 1,
    date: '2026-01-15',
    type: 'Push',
    isActive: true,
    updatedAt: new Date('2026-01-15T10:00:00.000Z'),
    exercises: [],
  };

  beforeEach(() => {
    state = new WorkoutState();
  });

  it('stores workouts and exposes the computed workout count', () => {
    state.setWorkouts([workout]);

    expect(state.workouts()).toEqual([workout]);
    expect(state.workoutCount()).toBe(1);
  });

  it('tracks loading, error, and current workout state', () => {
    state.setLoading(true);
    state.setError('Unable to load workouts.');
    state.setCurrentWorkout(workout);

    expect(state.loading()).toBeTrue();
    expect(state.error()).toBe('Unable to load workouts.');
    expect(state.currentWorkout()).toEqual(workout);
  });

  it('resets every state value', () => {
    state.setWorkouts([workout]);
    state.setLoading(true);
    state.setError('error');
    state.setCurrentWorkout(workout);

    state.reset();

    expect(state.workouts()).toEqual([]);
    expect(state.workoutCount()).toBe(0);
    expect(state.loading()).toBeFalse();
    expect(state.error()).toBeNull();
    expect(state.currentWorkout()).toBeNull();
  });
});
