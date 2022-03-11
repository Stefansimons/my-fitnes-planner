export interface Training {
  id?: string;
  trainingDate: string;
  exercises?: Exercise[];
  typeOfTraining: string;
}
export interface Exercise {
  id?: string;
  name: string;
  series?: Series[];
}
export interface Series {
  id?: string;
  repetitionNumber: number;
  weight: number;
}
