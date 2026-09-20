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

  it('filters and paginates workouts through computed state', () => {
    const secondWorkout = {
      ...workout,
      id: 2,
      type: 'Legs',
      exercises: [{ name: 'Squat', sets: [] }],
    };
    const thirdWorkout = { ...workout, id: 3, type: 'Pull' };

    state.setWorkouts([workout, secondWorkout, thirdWorkout]);
    state.setPageSize(1);
    state.setSearchTerm('squat');

    expect(state.total()).toBe(1);
    expect(state.pagedWorkouts()).toEqual([secondWorkout]);
  });

  it('sorts workouts by a selected column and direction', () => {
    const secondWorkout = { ...workout, id: 2, type: 'Legs' };

    state.setWorkouts([secondWorkout, workout]);
    state.setSort('id', 'asc');

    expect(state.pagedWorkouts().map((item) => item.id)).toEqual([1, 2]);
  });
});
