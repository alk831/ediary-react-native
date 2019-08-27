import {
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  MEALS_ADDED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
} from '../consts';
import {
  DateTime,
  TemplateId,
} from '../../types';
import { DiaryActions } from '../actions';
import { calcMacroByQuantity, getRevertedTemplateId, normalizeMeal } from '../helpers/diary';
import { getDayFromDate, getTimeFromDate } from '../../common/utils';
import { DiaryState } from './types/diary';

const initialState: DiaryState = {
  meals: [],
  products: [],
  templates: [
    {
      id: 1 as any as TemplateId,
      name: 'Śniadanie',
      time: '08:30:00' as any as DateTime,
    },
    {
      id: 2 as any as TemplateId,
      name: 'Obiad',
      time: '12:00:00' as any as DateTime,
    }
  ],
  recentProducts: [],
  toggledProductId: null,
  isLoading: false
}

export function diaryReducer(
  state = initialState,
  action: DiaryActions
): DiaryState {
  switch(action.type) {
    case MEALS_ADDED: return {
      ...state,
      // ...normalizeMeals(
      //   action.payload,
      //   action.meta.templateId
      // )
    }
    case MEAL_ADDED: {
      const { templateId } = action.meta;
      const { meal, products } = normalizeMeal(action.payload, templateId);

      if (templateId) {
        return {
          ...state,
          products: [...state.products, ...products],
          meals: state.meals.map(meal => {
            if (meal.type === 'meal' && meal.templateId === templateId) {
              return {
                ...action.payload,
                day: getDayFromDate(action.payload.date),
                time: getTimeFromDate(action.payload.date),
                productIds: products.map(product => product.id),
                isToggled: true,
                templateId: templateId || null,
                type: 'meal'
              }
            }
            return meal;
          })
        }
      }
      return {
        ...state,
        products: [...state.products, ...products],
        meals: [...state.meals, { ...meal, type: 'meal' }]
      }
    }
    case MEAL_DELETED: return {
      ...state,
      products: state.products.filter(product =>
        product.mealId !== action.meta.mealId
      ),
      meals: state.meals.flatMap(meal => {
        if (meal.id === action.meta.mealId) {
          if (meal.templateId) {
            const { templateId, name, time } = meal;
            return [{
              id: getRevertedTemplateId(meal.templateId),
              carbs: 0,
              prots: 0,
              fats: 0,
              kcal: 0,
              day: null,
              date: null,
              type: 'template',
              isToggled: false,
              productIds: [],
              templateId,
              name,
              time,
            }]
          }
          return [];
        }
        return [meal];
      })
    }
    case MEAL_TOGGLED: return {
      ...state,
      toggledProductId: null,
      meals: state.meals.map(meal => ({
        ...meal,
        isToggled: action.meta.targetId === meal.id
          ? !meal.isToggled
          : false
      }))
    }
    case MEAL_UPDATED: return {
      ...state,
      meals: state.meals.map(meal =>
        meal.type === 'meal' && meal.id === action.meta.mealId
          ? { ...meal, ...action.payload }
          : meal
      )
    }
    case MEAL_PRODUCT_ADDED: return {
      ...state,
      meals: state.meals.map(meal => 
        meal.type === 'meal' && meal.id === action.meta.mealId 
          ? { ...meal, productIds: [...meal.productIds, action.payload.id] }
          : meal
      ),
      products: [
        ...state.products,
        {
          ...action.payload,
          isToggled: false,
          macro: calcMacroByQuantity(action.payload)
        }
      ]
    }
    case MEAL_PRODUCT_DELETED: return {
      ...state,
      meals: state.meals.map(meal => {
        if (meal.type === 'meal' && meal.id === action.meta.mealId) {
          const productIds = meal.productIds.filter(productId =>
            productId !== action.meta.productId
          );
          return { ...meal, productIds };
        }
        return meal;
      }),
      products: state.products.filter(product => product.id !== action.meta.productId)
    }
    case PRODUCT_UPDATED: return {
      ...state,
      products: state.products.map(product => {
        if (product.id === action.meta.productId) {
          const merged = { ...product, ...action.payload };
          if (
            'quantity' in action.payload &&
            action.payload.quantity !== product.quantity
          ) {
            return {
              ...merged,
              macro: calcMacroByQuantity(merged)
            }
          }
          return merged;
        }
        return product;
      })
    }
    case PRODUCT_CREATED: return {
      ...state,
      recentProducts: [action.payload, ...state.recentProducts].splice(0, 4)
    }
    case PRODUCT_TOGGLED: return {
      ...state,
      toggledProductId: state.toggledProductId === action.payload
        ? null
        : action.payload,
      products: state.products.map(product => ({
        ...product,
        isToggled: action.payload === product.id
          ? !product.isToggled
          : false
      }))
    }
    default: return state;
  }
}