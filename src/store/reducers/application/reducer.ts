import { AppActions } from '../../actions/types/application';
import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
  APP_STATUS_UPDATED
} from '../../consts';
import { DateDay } from '../../../types';
import { getDayFromDate } from '../../../common/utils';
import dayjs from 'dayjs';
import { ApplicationState } from './types';

const date = new Date;
const todayDateDay = getDayFromDate(date);

const initialState: ApplicationState = {
  date,
  day: todayDateDay,
  todayDate: date,
  todayDay: todayDateDay,
  isConnected: false,
  status: 'INITIALIZING'
}

export function applicationReducer(
  state = initialState,
  action: AppActions
): ApplicationState {
  switch(action.type) {
    case APP_STATUS_UPDATED: return {
      ...state,
      status: action.payload,
    }
    case APP_DATE_UPDATED: return {
      ...state,
      date: action.payload,
      day: dayjs(action.payload).format('YYYY-MM-DD') as any as DateDay
    }
    case APP_CONNECTION_STATUS_UPDATED: return {
      ...state,
      isConnected: action.payload
    }
    default: return state;
  }
}