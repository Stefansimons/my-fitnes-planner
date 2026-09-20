import { Exercise, Series, Training } from './training.model';
import {
  WorkoutDto,
  WorkoutExerciseDto,
  WorkoutSetDto,
} from './workout.dto';

import {
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from './workout.model';

export function trainingToWorkout(training: Training): Workout {
  return {
    id: training.id,
    date: training.trainingDate,
    exercises: training.exercises.map(exerciseToWorkoutExercise),
    type: training.typeOfTraining,
    isActive: training.isActive,
    updatedAt: training.updatedAt,
  };
}

export function workoutToTraining(workout: Workout): Training {
  return {
    id: workout.id,
    trainingDate: workout.date,
    exercises: workout.exercises.map(workoutExerciseToExercise),
    typeOfTraining: workout.type,
    isActive: workout.isActive,
    updatedAt: workout.updatedAt,
  };
}

export function workoutDtoToDomain(dto: WorkoutDto): Workout {
  return {
    id: dto.id,
    date: dto.trainingDate,
    exercises: dto.exercises.map(dtoToWorkoutExercise),
    type: dto.typeOfTraining,
    isActive: dto.isActive,
    updatedAt: dto.updatedAt,
  };
}

export function workoutToDto(workout: Workout): WorkoutDto {
  return {
    id: workout.id,
    trainingDate: workout.date,
    exercises: workout.exercises.map(workoutExerciseToDto),
    typeOfTraining: workout.type,
    isActive: workout.isActive,
    updatedAt: workout.updatedAt,
  };
}

function exerciseToWorkoutExercise(exercise: Exercise): WorkoutExercise {
  return {
    id: exercise.id,
    name: exercise.exerciseName,
    sets: (exercise.series ?? []).map(seriesToWorkoutSet),
  };
}

function workoutExerciseToExercise(exercise: WorkoutExercise): Exercise {
  return {
    id: exercise.id,
    exerciseName: exercise.name,
    series: exercise.sets.map(workoutSetToSeries),
  };
}

function seriesToWorkoutSet(series: Series): WorkoutSet {
  return {
    id: series.id,
    reps: series.repsNum,
    weight: series.weight,
  };
}

function workoutSetToSeries(set: WorkoutSet): Series {
  return {
    id: set.id,
    repsNum: set.reps,
    weight: set.weight,
  };
}

function dtoToWorkoutExercise(exercise: WorkoutExerciseDto): WorkoutExercise {
  return {
    id: exercise.id,
    name: exercise.exerciseName,
    sets: (exercise.series ?? []).map(dtoToWorkoutSet),
  };
}

function workoutExerciseToDto(exercise: WorkoutExercise): WorkoutExerciseDto {
  return {
    id: exercise.id,
    exerciseName: exercise.name,
    series: exercise.sets.map(workoutSetToDto),
  };
}

function dtoToWorkoutSet(set: WorkoutSetDto): WorkoutSet {
  return {
    id: set.id,
    reps: set.repsNum,
    weight: set.weight,
  };
}

function workoutSetToDto(set: WorkoutSet): WorkoutSetDto {
  return {
    id: set.id,
    repsNum: set.reps,
    weight: set.weight,
  };
}
