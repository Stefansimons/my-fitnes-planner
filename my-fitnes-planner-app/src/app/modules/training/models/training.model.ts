export interface Training {
  id?: string;
  trainingDate: string;
  exercises?: Exercise[];
  typeOfTraining: string;
}
export interface Exercise {
  id?: string;
  exerciseName: string;
  series?: Series[];
}
export interface Series {
  id?: string;
  repsNum: number;
  weight: number;
}
