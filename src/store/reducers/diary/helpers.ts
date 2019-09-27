import { TemplateId, TemplateIdReverted } from '../../../types';
import { MACRO_ELEMENTS } from '../../../common/consts';
import { Meal } from '../../../database/entities';
import { getDayFromDate, getTimeFromDate } from '../../../common/utils';
import {
  DiaryMealTemplate,
  MealTemplate,
  NormalizeMealsResult,
  DiaryMeal,
  DiaryProduct,
  CalcMacroByQuantityData,
} from './types';

export const calcMacroByQuantity = <T extends CalcMacroByQuantityData>(
  macroData: T,
  quantity: number
) => MACRO_ELEMENTS.map(element => ({
  value: Math.round(macroData[element] * quantity / 100),
  element
}));

export const getRevertedTemplateId = (
  templateId: TemplateId
): TemplateIdReverted => {
  return ((templateId as any) * -1) as any;
}

export const getMealFromTemplate = (
  template: MealTemplate
): DiaryMealTemplate => {
  return {
    id: getRevertedTemplateId(template.id),
    name: template.name,
    type: 'template',
    macro: {
      carbs: 0,
      prots: 0,
      fats: 0,
      kcal: 0,
    },
    day: null,
    date: null,
    time: template.time,
    isToggled: false,
    templateId: template.id,
    productIds: [],
  }
}

export const normalizeMeal = (
  mealEntity: Meal,
  templateId: TemplateId | null = null
) => {
  const { mealProducts = [], ...meal } = mealEntity;

  const normalizedMeal: DiaryMeal = {
    ...meal,
    type: 'meal',
    isToggled: false,
    day: getDayFromDate(meal.date),
    time: getTimeFromDate(meal.date),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
  }

  const normalizedProducts = mealProducts.map<DiaryProduct>(mealProductEntity => {
    const { meal, product, ...data } = mealProductEntity;
    const normalizedProduct: DiaryProduct = {
      ...data,
      ...product,
      isToggled: false,
      calcedMacro: calcMacroByQuantity(product.macro, data.quantity)
    }
    return normalizedProduct;
  });

  return {
    meal: normalizedMeal,
    products: normalizedProducts
  }
}

export const normalizeMeals = (
  payload: Meal[]
): NormalizeMealsResult => {
  return payload.reduce<NormalizeMealsResult>((normalized, mealEntity) => {
    const { meal, products } = normalizeMeal(mealEntity);
    return {
      meals: [...normalized.meals, meal],
      products: [...normalized.products, ...products]
    }
  }, { meals: [], products: [] });
}