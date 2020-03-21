import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, InteractionManager } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import styled from 'styled-components/native';
import { MealId } from '../../types';
import { DiaryMeal, DiaryMealOrTemplateId, DiaryProduct, DiaryMealOrTemplate } from '../../store/reducers/diary';
import { useAfterInteractions, useNavigationData } from '../../hooks';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { MealItem, MealItemSeparator, ChartsMacroNeeds } from '../../_components';
import { layoutAnimateEase, alertDelete } from '../../common/utils';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate, navigation } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const dispatch = useDispatch();
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay);
  const macroNeeds = useSelector(Selectors.getCalcedMacroNeeds);
  const meals = useSelector(Selectors.getMealsCalced);
  const mealListRef = useRef<FlatList<Selectors.MealCalced>>(null);

  useAfterInteractions(() => dispatch(Actions.productHistoryRecentLoad()));

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(appDateDay));
  }, [appDateDay]);

  const handleProductAdd = (meal: DiaryMealOrTemplate): void => {
    navigate('ProductFind', {
      async onProductSelected(productResolver, productQuantity) {
        navigate('NutritionHome');

        await dispatch(
          Actions.mealOrTemplateProductAdd(
            meal,
            productResolver,
            productQuantity,
            appDate
          )
        );
      }
    });
  }
  
  const handleMealDelete = (meal: DiaryMeal): void => {
    alertDelete(
      'Usuń posiłek',
      `Czy jesteś pewnien że chcesz usunąć "${meal.data.name}"?`,
      () => dispatch(Actions.mealDelete(meal.data.id))
    );
  }

  const handleProductDelete = (mealId: MealId, product: DiaryProduct): void => {
    alertDelete(
      'Usuń produkt',
      `Czy jesteś pewnien że chcesz usunąć "${product.data.name}"?`,
      () => dispatch(Actions.mealProductDelete(mealId, product.data.id))
    );
  }

  const handleMealOpen = (
    mealId: DiaryMealOrTemplateId,
    meal: Selectors.MealCalced,
    index: number
  ): void => {
    const scroll = () => {
      mealListRef.current?.scrollToIndex({
        index,
        viewOffset: 50,
      });
    }

    layoutAnimateEase();

    dispatch(Actions.mealOpenToggled(mealId));

    if (!meal.isOpened) scroll();
  }

  const handleProductQuantityUpdate = (mealId: MealId, product: DiaryProduct): void => {
    navigate('ProductPreview', {
      product: product.data,
      quantity: product.quantity,
      async onProductQuantityUpdated(quantity) {
        navigation.goBack();

        await InteractionManager.runAfterInteractions();

        dispatch(Actions.mealProductQuantityUpdate(mealId, product.data.id, quantity));
      }
    });
  }

  const Header = (
    <>
      <DateChanger
        value={appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <ChartsMacroNeeds macroNeeds={macroNeeds} />
    </>
  );

  return (
    <Container>
      <FlatList
        ref={mealListRef}
        data={meals}
        keyExtractor={mealKeyExtractor}
        ItemSeparatorComponent={MealItemSeparator}
        ListHeaderComponent={Header}
        renderItem={({ item: meal, index }) => (
          <MealItem
            meal={meal}
            onMealOpen={(mealId) => handleMealOpen(mealId, meal, index)}
            onMealDelete={handleMealDelete}
            onProductAdd={handleProductAdd}
            onProductQuantityUpdate={handleProductQuantityUpdate}
            onProductDelete={handleProductDelete}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const mealKeyExtractor = (meal: Selectors.MealCalced): string => `${meal.type}${meal.data.id}`;