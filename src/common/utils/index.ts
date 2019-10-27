import dayjs from 'dayjs';
import { DateDay, UnitType, DateTime, MacroElements } from '../../types';
import { UNIT_TYPES, DATE_TIME, DATE_DAY, MACRO_ELEMENTS } from '../consts';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

export const debounce = () => {
  let timeout: NodeJS.Timeout;
  return (callback: () => void, delay = 250) => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  }
}

export const round = (value: number, scale = 10) => Math.round(value * scale) / scale;

export const toLocaleString = (value: number) => new Intl.NumberFormat('pl-PL').format(value);

/**
 * Maps over an array and runs promise returned from a callback in a sequence.
 * @param items array of elements to iterate on
 * @param callback callback that is executed on each iteration
 */
export const mapAsyncSequence = async <T, R>(
  items: T[],
  callback: (item: T) => Promise<R>
) => {
  const result: R[] = [];

  for (const item of items) {
    const resultItem = await callback(item);
    result.push(resultItem);
  }

  return result;
}

export function getDayFromDate(
  date: dayjs.ConfigType
): DateDay {
  const dateDay: DateDay = dayjs(date).format(DATE_DAY) as any;
  return dateDay;
}

export function getTimeFromDate(
  date: dayjs.ConfigType
) {
  const dateTime: DateTime = dayjs(date).format(DATE_TIME) as any;
  return dateTime;
}

export function getValAndUnitFromString(value: string): {
  value: number | null
  unit: UnitType | null
} {
  const unit = UNIT_TYPES.find(unit => value.includes(unit));
  const parsedValue = parseFloat(
    value.replace(/,/, '.')
  );
  const result = Number.isNaN(parsedValue) ? null : parsedValue; 

  return {
    unit: unit || null,
    value: result || null
  }
}

export function sortByMostAccurateName(
  phrase: string
) {
  const phraseLowered = phrase.toLowerCase();

  return function<T extends { name: string }>(
    a: T,
    b: T
  ): -1 | 0 | 1 {
    const aNameLowered = a.name.toLowerCase();
    const bNameLowered = b.name.toLowerCase();
  
    const aIndex = aNameLowered.indexOf(phraseLowered);
    const bIndex = bNameLowered.indexOf(phraseLowered);
  
    const notFoundIndex = -1;
    const orderByShorter = aNameLowered.length > bNameLowered.length ? 1 : -1;

    const aNameHasNotBeenFound = aIndex === notFoundIndex;
    const bNameHasNotBeenFound = bIndex === notFoundIndex;
  
    if (aNameHasNotBeenFound && bNameHasNotBeenFound) {
      return -1;
    }
    if (aNameHasNotBeenFound) {
      return 1;
    }
    if (bNameHasNotBeenFound) {
      return -1;
    }
  
    if (aNameLowered.length === bNameLowered.length) {
      return 0;
    }
  
    return orderByShorter;
  }
}

export function getNumAndUnitFromString(value: string): {
  value: number | null
  unit: UnitType | null
} {
  const parseToNumber = (val: string): number | null => {
    const parsed = val.trim().replace(/,/, '.')
    const numbers = parsed.match(/[+-]?\d+(\.\d+)?/g);

    if (!numbers) {
      return null;
    }
    const result = parseFloat(numbers[numbers.length - 1]);

    if (Number.isNaN(result)) {
      return null;
    }
    return result;
  }

  const unit = UNIT_TYPES.find(unit => value.includes(` ${unit}`)) || null;
  const result = parseToNumber(value);

  return {
    value: result,
    unit
  }
}

export function filterByUniqueId<T extends { id: number | string }>(
  item: T,
  index: number,
  self: T[]
): boolean {
  const foundIndex = self.findIndex(anyItem => anyItem.id === item.id);
  return foundIndex === index;
}

export function parseNumber(
  value: string,
  maxNumber?: number,
  maxLength?: number,
): string {
  const trimmed = maxLength ? value.substring(0, maxLength) : value;
  const cleaned = trimmed.replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);

  if (maxNumber && parsed >= maxNumber) {
    return cleaned.slice(0, -1);
  }

  return cleaned;
}

export function findOrFail<T>(
  array: T[],
  matcher: (item: T, index: number, self: T[]) => boolean
): T {
  const foundItem = array.find(matcher);
  if (!foundItem) {
    throw new Error(
      '[findOrFail] - No item could be found for specified criteria'
    );
  }
  return foundItem;
}

export function calcMacroNeedsLeft(
  macroEaten: MacroElements,
  macroNeeds: MacroElements
) {
  const macroNeedsElement = { diff: 0, ratio: 0, eaten: 0, needed: 0 };

  return MACRO_ELEMENTS.reduce((result, element) => {
    const diff = Math.round(macroNeeds[element] - macroEaten[element]);
    const ratio = Math.floor(
      macroEaten[element] / macroNeeds[element] * 100
    );
    return {
      ...result,
      [element]: {
        diff,
        ratio,
        eaten: macroEaten[element],
        needed: macroNeeds[element]
      }
    }
  }, {
    carbs: { ...macroNeedsElement },
    prots: { ...macroNeedsElement },
    fats: { ...macroNeedsElement },
    kcal: { ...macroNeedsElement }
  });
}

export const getCurrentPosition = (): Promise<GeolocationResponse> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve,
      reject
    );
  });
}

const padTime = (time: number) => {
  return String(time).padStart(2, '0');
}

export const formatDuration = (duration: number): string => {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60);
  const hours = Math.floor(minutes / 60);

  const parsedTime = [hours, minutes, seconds].map(padTime).join(':');
  return parsedTime;
}