import { Training } from './../modules/training/models/training.model';
import { Action } from '@ngrx/store';
import { trainings } from './../modules/shared/services/firestore.service';
import * as TrainingListActions from './training-list.actions';

export interface State {
  trainings: Training[];
  editedTraining: Training | null;
  editedTrainingIndex: number;
}

const initialState: State = {
  trainings: [
    {
      id: 'string1',
      idCounter: 1,
      updatedAt: new Date(),
      isActive: true,
      trainingDate: new Date().toISOString(),
      typeOfTraining: 'Push',
      exercises: [
        {
          id: 4,
          exerciseName: 'Bench press',
          serieNum: 3,
          series: [{ id: 4, repsNum: 4, weight: 1000 }],
        },
      ],
    },
    {
      id: 'string2',
      idCounter: 2,
      updatedAt: new Date(),
      isActive: true,
      trainingDate: new Date().toISOString(),
      typeOfTraining: 'Push',
      exercises: [
        {
          id: 4,
          exerciseName: 'Bench press',
          serieNum: 3,
          series: [{ id: 4, repsNum: 4, weight: 1000 }],
        },
      ],
    },
    {
      id: 'string3',
      idCounter: 3,
      updatedAt: new Date(),
      isActive: true,
      trainingDate: new Date().toISOString(),
      typeOfTraining: 'Push',
      exercises: [
        {
          id: 4,
          exerciseName: 'Bench press',
          serieNum: 3,
          series: [{ id: 4, repsNum: 4, weight: 1000 }],
        },
      ],
    },
    {
      id: 'string4',
      idCounter: 4,
      updatedAt: new Date(),
      isActive: true,
      trainingDate: new Date().toISOString(),
      typeOfTraining: 'Push',
      exercises: [
        {
          id: 4,
          exerciseName: 'Bench press',
          serieNum: 3,
          series: [{ id: 4, repsNum: 4, weight: 1000 }],
        },
      ],
    },
  ],
  editedTraining: null,
  editedTrainingIndex: -1,
};

// Reducer is as very big object, my app
// Only at initialization of state it will be initial state, next time it will be previous state..
// Give it name by object to which it refers
// Action is some event which can change current state of object
export function TrainingListReducer(
  state = initialState,
  action: TrainingListActions.TrainingListActionsMyType
) {
  switch (action.type) {
    case TrainingListActions.ADD_TRAINING:
      return {
        ...state, // Always copy old state ... and furthermore merged with new value
        trainings: [...state.trainings, action.payload], // Add new payload training
      };
    case TrainingListActions.ADD_TRAININGS:
      return {
        ...state,
        trainings: [...state.trainings, ...action.payload], // merged old training with new payload training =  trainings array
      };
    case TrainingListActions.UPDATE_TRAINING:
      // const trainings = state.trainings.map((item) => {
      //   let returnitem;
      //   returnitem =
      //     item.idCounter === action.payload.index ? action.payload : item;
      //   return returnitem;
      //      });
      // THE SECOND WAY
      const training = state.trainings[action.payload.training.idCounter];
      const updatedTraining = {
        ...training,
        ...action.payload,
      };
      // state.trainings[action.payload.index] = updatedTraining; // NOTE WRONG WAY BECAUSE MAIN ARRAY AM CHANGING SAO CREATE A COPY :
      const updatedArray = [...state.trainings];
      updatedArray[action.payload.training.idCounter] = updatedTraining;
      return {
        ...state,
        trainings: updatedArray.filter((item) => item.isActive),
      };

    case TrainingListActions.START_EDIT:
      return {
        ...state,
        editedTraining: { ...state.trainings[action.payload] },
        editedTrainingIndex: action.payload,
      };
    case TrainingListActions.STOP_EDIT:
      return {
        ...state,
        editedTraining: null,
        editedTrainingIndex: -1,
      };

    default:
      return state;
  }
}
