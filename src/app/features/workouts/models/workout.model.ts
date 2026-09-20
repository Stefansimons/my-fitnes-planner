export type GymWorkoutType =
  | 'Trening A'
  | 'Trening B'
  | 'Push'
  | 'Pull'
  | 'Legs'
  | 'Drugo';

export type CrossFitWorkoutType = 'AMRAP' | 'EMOM' | 'For Time' | 'Rounds';

export type WorkoutType = GymWorkoutType | CrossFitWorkoutType | string;

export type CrossFitFormat = 'AMRAP' | 'EMOM' | 'For Time' | 'Rounds';

export interface CrossFitResult {
  score?: number;
  timeSeconds?: number;
  rounds?: number;
  notes?: string;
}

export interface WorkoutSet {
  id?: string;
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  id?: number;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id?: number;
  date: string;
  exercises: WorkoutExercise[];
  type: WorkoutType;
  isActive: boolean;
  updatedAt: Date;
}

export interface CrossFitWorkout extends Workout {
  type: CrossFitWorkoutType;
  format: CrossFitFormat;
  result?: CrossFitResult;
}
