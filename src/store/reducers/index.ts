import { combineReducers } from 'redux';
import { diaryReducer } from './diary';
import { applicationReducer } from './application';
import { userReducer } from './user';
import { productHistoryReducer } from './productHistory';
import { gymTrainingReducer } from './gymTraining';

export const rootReducer = combineReducers({
  application: applicationReducer,
  diary: diaryReducer,
  user: userReducer,
  productHistory: productHistoryReducer,
  gymTraining: gymTrainingReducer,
});