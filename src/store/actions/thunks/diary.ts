import { Meal, Product } from '../../../entities';
import {
  mealCreated,
  mealDeleted,
  mealUpdated,
  mealProductCreated,
  mealProductDeleted,
  productUpdated,
  mealToggled,
  productCreated,
  mealsAdded,
} from '../creators';
import {
  mealRepository,
  mealProductRepository, 
  productRepository
} from '../../../repositories';
import { DiaryMealPayload, DiaryProductPayload } from '../../reducers/diary';
import { getProductMock } from '../../helpers/diary';
import { Between } from 'typeorm/browser';
import { AppState } from '../..';
import { MealId } from '../../../types';


export const mealCreate = (name: Meal['name']) => async (dispatch: any) => {
  const meal = await mealRepository().save({ name });
  dispatch(mealToggled(null));
  dispatch(mealCreated(meal));
}

export const mealDelete = (mealId: Meal['id']) => async (dispatch: any) => {
  dispatch(mealDeleted(mealId));
  const meal = await mealRepository().findOneOrFail(mealId);
  await meal.remove();
}

export const mealUpdate = (
  mealId: Meal['id'],
  meal: Partial<DiaryMealPayload>
) => async (dispatch: any) => {
  dispatch(mealUpdated(mealId, meal));
  await mealRepository().update(mealId, meal);
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: Product
) => async (dispatch: any) => {
  const meal = await mealRepository().findOneOrFail(mealId);
  const mockedProduct = { ...payload, ...getProductMock() };
  const newProduct = await meal.addAndCreateProduct(mockedProduct);
  dispatch(mealProductCreated(mealId, { ...mockedProduct, ...newProduct }));
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
) => async (dispatch: any) => {
  dispatch(mealProductDeleted(mealId, productId));
  await mealProductRepository().delete({ mealId, productId });
}

export const productUpdate = (
  productId: Product['id'],
  product: Partial<DiaryProductPayload>
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, product));
  await productRepository().update(productId, product);
}

export const productCreate = (
  product: Omit<DiaryProductPayload, 'id' | 'createdAt' | 'updatedAt'>
) => async (dispatch: any) => {
  const newProduct = await productRepository().save(product);
  dispatch(productCreated({ ...product, ...newProduct }));
}

export const mealsFindByDay = (
  day?: string
) => async (dispatch: any, getState: () => AppState): Promise<boolean> => {
  const mealDay = day || getState().application.day;

  const foundMeals = await mealRepository().find({
    where: { date: Between(`${mealDay} 00:00:00`, `${mealDay} 23:59:59`) },
    relations: ['mealProducts', 'mealProducts.product']
  });

  if (foundMeals.length) {
    dispatch(mealsAdded(foundMeals));
    return true;
  }
  return false;
}