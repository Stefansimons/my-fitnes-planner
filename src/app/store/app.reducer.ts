import { State, TrainingListReducer } from './training-list.reducer';
import { ActionReducerMap } from '@ngrx/store';

export * as fromTrainingListActions from './training-list.actions';
import * as fromAuth from '../modules/core/auth/store/auth.reducer';
export const rootReducer = {};

// Interface for all states in app
export interface AppState {
  trainingList: State;
  auth: fromAuth.State;
}
// lsit of reducers in app. Imported in app.module as StoreModule.forRoot(reducers)
export const reducers: ActionReducerMap<AppState, any> = {
  trainingList: TrainingListReducer,
  auth: fromAuth.authReducer,
};
