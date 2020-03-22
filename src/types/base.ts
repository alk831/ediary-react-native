import {
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  PORTION_TYPES,
  UNIT_TYPES,
} from '../common/consts';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';

export type UnitType = typeof UNIT_TYPES[number];
export type PortionUnit = 'g' | 'ml';

export type BaseMacroElement = typeof BASE_MACRO_ELEMENTS[number];
export type MacroElement = typeof MACRO_ELEMENTS[number];

export interface BaseMacroElements<T = number> {
  carbs: T
  prots: T
  fats: T
}

export interface MacroElements<T = number> extends BaseMacroElements<T> {
  kcal: T
}

export type PortionType = typeof PORTION_TYPES[number];

export type WeightGoal = 'decrease' | 'maintain' | 'increase';

export type Environment = 'development' | 'test' | 'production';

export type ApplicationStatus = 'INITIALIZING' | 'CREATING PROFILE' | 'INITIALIZED';

/** Higher order function type for `Array.prototype.filter` method callback. */
export type FilterHOF<T> = (value: T, index: number, values: T[]) => boolean;

export type SortHOF<T> = (itemA: T, itemB: T) => -1 | 0 | 1;

export type BaseScreenProps = {
  navigation: NavigationProp<ParamListBase>
  route: RouteProp<Record<string, object>, string>
}

export type ObjectNumeric = {
  [key: string]: number
}

export type ObjectEntries = <
  T extends object,
  Property extends keyof T = keyof T,
  Value = T[Property]
>(object: T) => [Property, Value][];