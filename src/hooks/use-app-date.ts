import { useSelector } from 'react-redux';
import { Selectors, Actions } from '../store';
import { useBoundAction } from './use-bound-action';

export const useAppDate = () => {
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay);

  const update = useBoundAction(Actions.appDateUpdated);

  return { appDate, appDateDay, update };
}