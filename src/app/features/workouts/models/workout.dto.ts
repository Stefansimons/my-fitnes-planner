export interface WorkoutSetDto {
  id?: string;
  repsNum: number;
  weight: number;
}

export interface WorkoutExerciseDto {
  id?: number;
  exerciseName: string;
  series?: WorkoutSetDto[];
  serieNum?: number;
}

export interface WorkoutDto {
  id?: number;
  trainingDate: string;
  exercises: WorkoutExerciseDto[];
  typeOfTraining: string;
  isActive: boolean;
  updatedAt: Date;
}
