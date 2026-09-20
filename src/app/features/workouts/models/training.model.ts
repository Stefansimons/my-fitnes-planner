export interface Training {
  id?: number;
  trainingDate: string;
  exercises: Exercise[];
  typeOfTraining: string;
  isActive: boolean;
  updatedAt: Date; // timestamp
}
export interface Exercise {
  id?: number;
  exerciseName: string;
  series?: Series[];
  serieNum?: number;
}
export interface Series {
  id?: string;
  repsNum: number;
  weight: number;
}
