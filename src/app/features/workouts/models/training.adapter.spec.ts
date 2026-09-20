import {
  workoutDtoToDomain,
  workoutToDto,
} from './training.adapter';
import { WorkoutDto } from './workout.dto';
import { Workout } from './workout.model';

describe('training adapter', () => {
  const updatedAt = new Date('2026-01-15T10:00:00.000Z');

  const dto: WorkoutDto = {
    id: 7,
    trainingDate: '2026-01-15',
    typeOfTraining: 'Push',
    isActive: true,
    updatedAt,
    exercises: [
      {
        id: 2,
        exerciseName: 'Bench press',
        series: [
          { id: 'set-1', repsNum: 8, weight: 80 },
          { id: 'set-2', repsNum: 6, weight: 85 },
        ],
      },
    ],
  };

  it('maps a backend DTO to the workout domain model', () => {
    expect(workoutDtoToDomain(dto)).toEqual({
      id: 7,
      date: '2026-01-15',
      type: 'Push',
      isActive: true,
      updatedAt,
      exercises: [
        {
          id: 2,
          name: 'Bench press',
          sets: [
            { id: 'set-1', reps: 8, weight: 80 },
            { id: 'set-2', reps: 6, weight: 85 },
          ],
        },
      ],
    });
  });

  it('maps a workout domain model back to the backend DTO', () => {
    const workout: Workout = workoutDtoToDomain(dto);

    expect(workoutToDto(workout)).toEqual(dto);
  });

  it('normalizes missing DTO series to an empty domain collection', () => {
    const workout = workoutDtoToDomain({
      ...dto,
      exercises: [{ id: 3, exerciseName: 'Pull-up' }],
    });

    expect(workout.exercises[0].sets).toEqual([]);
  });
});
