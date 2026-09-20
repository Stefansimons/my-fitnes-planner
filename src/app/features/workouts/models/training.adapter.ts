import { Exercise, Series, Training } from './training.model';
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
