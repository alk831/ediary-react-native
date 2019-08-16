import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { useDispatch, connect } from 'react-redux';
import * as Actions from '../../store/actions';
import { AppState } from '../../store';
import { FlatList, ScrollView, Alert } from 'react-native';
import * as selectors from '../../store/selectors';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { nutritionColors } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { FloatingButton } from '../../components/FloatingButton';
import { BasicInput } from '../../components/BasicInput';
import { NavigationScreenProps } from 'react-navigation';
import { ProductFinderParams } from '../ProductFinder';
import { mealProductAdd } from '../../store/actions';
import { ProductCreateParams } from '../ProductCreate';
import { BASE_MACRO_ELEMENTS, IS_DEV } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId } from '../../types';

interface HomeProps extends NavigationScreenProps {
  mealsWithRatio: selectors.MealsWithRatio
  appDate: AppState['application']['date']
  appDateDay: AppState['application']['day']
  macroNeedsLeft: selectors.MacroNeedsLeft
  toggledProductId: AppState['diary']['toggledProductId']
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('Śniadanie');
  const [menuOpened, setMenuOpened] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFinderNavigation = (mealId: MealId) => {
    const screenParams: ProductFinderParams = {
      onItemPress(foundProduct) {
        props.navigation.navigate('Home');
        dispatch(mealProductAdd(mealId, foundProduct.id));
      }
    }
    props.navigation.navigate('ProductFinder', screenParams);
  }
  
  const handleProductCreatorNavigation = () => {
    const screenParams: ProductCreateParams = {
      onProductCreated() {
        props.navigation.navigate('Home');
      }
    }
    props.navigation.navigate('ProductCreate', screenParams);
  }

  const handleMealDelete = (meal: HomeProps['mealsWithRatio'][number]) => {
    Alert.alert(
      'Usuń posiłek',
      `Czy jesteś pewnien że chcesz usunąć: ${meal.name}?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => dispatch(Actions.mealDelete(meal.id))
        }
      ]
    );
  }
  
  return (
    <Container>
      <FloatingButton
        children="+"
        onPress={() => setMenuOpened(status => !status)}
      />
      <ScrollView>
        <DateChanger
          value={props.appDate}
          onChange={date => dispatch(Actions.appDateUpdated(date))}
        />
        <MacroCards>
          {BASE_MACRO_ELEMENTS.map(element => (
            <MacroCard
              key={element}
              colors={nutritionColors[element]}
              percentages={props.macroNeedsLeft[element].ratio}
              title={elementTitles[element]}
              reached={props.macroNeedsLeft[element].eaten}
              goal={props.macroNeedsLeft[element].needed}
            />
          ))}
        </MacroCards>
        <FlatList
          data={props.mealsWithRatio}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MealListItem
              meal={item}
              onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
              onLongPress={IS_DEV ? undefined : () => handleMealDelete(item)}
              onProductAdd={() => handleProductFinderNavigation(item.id)}
              onProductDelete={productId => dispatch(Actions.mealProductDelete(item.id, productId))}
              onProductToggle={productId => dispatch(Actions.productToggled(productId))}
              onProductQuantityUpdate={(productId, quantity) => dispatch(Actions.mealProductQuantityUpdate(
                item.id, productId, quantity
              ))}
              toggledProductId={props.toggledProductId}
            />
          )}
        />
        <BasicInput
          placeholder="Nazwa nowego posiłku"
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button
          accessibilityLabel="Utwórz nowy posiłek"
          onPress={() => dispatch(Actions.mealCreate(name))}
        >
          Dodaj posiłek
        </Button>
        <Button onPress={handleProductCreatorNavigation}>
          Dodaj własny produkt
        </Button>
      </ScrollView>
    </Container>
  );
}

const HomeConnected = connect(
  (state: AppState) => ({
    mealsWithRatio: selectors.mealsWithRatio(state),
    macroNeedsLeft: selectors.macroNeedsLeft(state),
    toggledProductId: state.diary.toggledProductId,
    appDate: state.application.date,
    appDateDay: state.application.day,
  }),
  (dispatch) => ({ dispatch })
)(Home);

(HomeConnected as any).navigationOptions = {
  header: null
}

const Container = styled.View`
  display: flex;
  min-height: 100%;
`

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 50px;
`

export { HomeConnected as Home };