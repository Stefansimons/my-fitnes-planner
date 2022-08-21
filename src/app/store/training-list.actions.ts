import { Training } from './../modules/training/models/training.model';
import { Action } from '@ngrx/store';
// constant which signify actions .. For preventing some error
export const ADD_TRAINING = 'ADD_TRAINING';
export const ADD_TRAININGS = 'ADD_TRAININGS';
export const UPDATE_TRAINING = 'UPDATE_TRAINING';
export const DELETE_TRAINING = 'DELETE_TRAINING'; // as update, only set isActive to false
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';
export class AddTraining implements Action {
  readonly type = ADD_TRAINING;
  constructor(public payload: Training) {}
}

export class AddTrainings implements Action {
  readonly type = ADD_TRAININGS;
  constructor(public payload: Training[]) {}
}

export class UpdateTraining implements Action {
  readonly type = UPDATE_TRAINING;
  constructor(public payload: { training: Training }) {}
}
export class DeleteTraining implements Action {
  readonly type = DELETE_TRAINING;
  constructor(public payload: { training: Training }) {}
}
export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload: number) {}
}
export class StopEdit implements Action {
  readonly type = STOP_EDIT;
  constructor(public payload: { training: Training }) {}
}

// NOTE: TYPESCRIPT FEATURE CREATING MY OWN TYPE, OR | == UNION
export type TrainingListActionsMyType =
  | AddTraining
  | AddTrainings
  | UpdateTraining
  | DeleteTraining
  | StartEdit
  | StopEdit;
