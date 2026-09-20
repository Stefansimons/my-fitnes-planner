export type WorkoutType = string;

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
