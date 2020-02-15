import { useNavigation } from 'react-navigation-hooks';

export const useNavigationParams = <T extends object>(): T => {
  const { state: { params = {} }} = useNavigation();
  return params as T;
}