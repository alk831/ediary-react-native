import { Meal, Product } from '../../../entities';
import {
  mealCreated,
  mealDeleted,
  mealUpdated,
  mealProductCreated,
  mealProductDeleted,
  productUpdated
} from '../index';
import {
  mealRepository,
  mealProductRepository, 
  productRepository
} from '../../../repositories';
import { ProductState } from '../../reducers/diary';
import { getProductMock } from '../../helpers/diary';
import { mealToggled, productCreated } from '../creators';


export const mealCreate = (name: Meal['name']) => async (dispatch: any) => {
  const meal = await mealRepository().save({ name });
  dispatch(mealToggled(null));
  dispatch(mealCreated(meal));
}

export const mealDelete = (mealId: Meal['id']) => async (dispatch: any) => {
  dispatch(mealDeleted(mealId));
  const meal = await mealRepository().findOne(mealId) as Meal;
  await meal.deleteInCascade();
}

export const mealUpdate = (mealId: Meal['id'], meal: Meal) => async (dispatch: any) => {
  dispatch(mealUpdated(mealId, meal));
  await mealRepository().update(mealId, meal);
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: Product
) => async (dispatch: any) => {
  const meal = await mealRepository().findOne(mealId) as Meal;
  const newProduct = await meal.addAndCreateProduct(payload);
  dispatch(mealProductCreated(mealId, { ...newProduct, ...getProductMock() }));
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
  product: Partial<ProductState>
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, product));
  await productRepository().update(productId, product);
}

export const productCreate = (
  product: ProductState
) => async (dispatch: any) => {
  const newProduct = await productRepository().create(product);
}