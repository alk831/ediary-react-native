import { DAYJS_DATETIME_BASE } from '../../../common/consts';
import { Meal, IProductMerged, Product } from '../../../database/entities';
import { getTimeFromDate, calculateMacroPerQuantity } from '../../../common/utils';
import {
  DiaryMealTemplate,
  MealTemplate,
  DiaryMeal,
  DiaryProduct,
  DiaryMealOrTemplate,
  DiaryMealOrTemplateId,
} from './types';
import dayjs from 'dayjs';
import { MealId, TemplateId } from '../../../types';

export const getDiaryMealTemplate = (
  template: MealTemplate
): DiaryMealTemplate => ({
  type: 'template',
  data: template,
  productIds: [],
  isOpened: false,
  dateTime: template.dateTime,
  dateTimeBase: template.dateTimeBase as any,
});

export const normalizeProductEntity = (
  productEntity: Product | IProductMerged,
  mealId: MealId,
  quantity: number,
): DiaryProduct => {

  const normalizedProduct: DiaryProduct = {
    mealId,
    quantity,
    data: productEntity,
    calcedMacro: calculateMacroPerQuantity(productEntity.macro, productEntity.portion)
  }
  
  return normalizedProduct;
}

export const normalizeMealEntity = (
  mealEntity: Meal,
  openMealByDefault = false
) => {
  const { mealProducts = [], ...meal } = mealEntity;

  const normalizedMeal: DiaryMeal = {
    data: meal,
    type: 'meal',
    isOpened: openMealByDefault,
    dateTime: getTimeFromDate(meal.date),
    dateTimeBase: dayjs(meal.date).format(DAYJS_DATETIME_BASE),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
  }

  const normalizedProducts = mealProducts
    .map<DiaryProduct>(({ product, mealId, quantity }) =>
      normalizeProductEntity(product, mealId, quantity)
    );

  return {
    meal: normalizedMeal,
    products: normalizedProducts
  }
}

export const normalizeMealEntities = (
  payload: Meal[],
  openMealsByDefault = false
): NormalizeMealsResult => {
  return payload.reduce<NormalizeMealsResult>((normalized, mealEntity) => {
    const { meal, products } = normalizeMealEntity(mealEntity, openMealsByDefault);
    
    return {
      meals: [...normalized.meals, meal],
      products: [...normalized.products, ...products]
    }
  }, { meals: [], products: [] });
}

export const isDiaryMeal = (meal: DiaryMealOrTemplate): meal is DiaryMeal => meal.type === 'meal';

export const isEqualMealId = <ID extends DiaryMealOrTemplateId>(
  diaryMealOrTemplate: DiaryMealOrTemplate,
  targetId: ID
): diaryMealOrTemplate is PredictDiaryMealType<ID> => {
  return diaryMealOrTemplate.data.id === targetId;
}

type PredictDiaryMealType<ID extends DiaryMealOrTemplateId> =
  ID extends MealId ? DiaryMeal :
  ID extends TemplateId ? DiaryMealTemplate :
  DiaryMealOrTemplate;

type NormalizeMealsResult = {
  meals: DiaryMeal[]
  products: DiaryProduct[]
}