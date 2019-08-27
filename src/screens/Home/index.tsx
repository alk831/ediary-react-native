import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import { StoreState, Dispatch } from '../../store';
import { FlatList, ScrollView, Alert } from 'react-native';
import * as selectors from '../../store/selectors';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { nutritionColors } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem, MealListItemTemplate } from '../../components/MealListItem';
import { FloatingButton } from '../../components/FloatingButton';
import { BasicInput } from '../../components/BasicInput';
import { NavigationScreenProps } from 'react-navigation';
import { ProductFindParams } from '../ProductFind';
import { mealProductAdd } from '../../store/actions';
import { ProductCreateParams } from '../ProductCreate';
import { BASE_MACRO_ELEMENTS, IS_DEV } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId } from '../../types';
import { DiaryTemplate } from '../../store/reducers/diary';

interface HomeProps extends NavigationScreenProps {
  appDate: StoreState['application']['date']
  appDateDay: StoreState['application']['day']
  macroNeedsLeft: selectors.MacroNeedsLeft
  toggledProductId: StoreState['diary']['toggledProductId']
  mealsAndTemplates: selectors.MealsAndTemplates
  dispatch: Dispatch
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('Śniadanie');
  const [menuOpened, setMenuOpened] = useState(false);
  const { dispatch } = props;

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFinderNavigation = (
    mealId: MealId | null,
    template?: DiaryTemplate,
  ) => {
    const screenParams: ProductFindParams = {
      onItemPress(foundProduct) {
        props.navigation.navigate('Home');
        if (template) {
          dispatch(
            Actions.mealCreateFromTemplate(
              template, props.appDate, foundProduct.id
            )
          );
        } else if (mealId) {
          dispatch(mealProductAdd(mealId, foundProduct.id));
        }
      }
    }
    props.navigation.navigate('ProductFind', screenParams);
  }
  
  const handleProductCreatorNavigation = () => {
    const screenParams: ProductCreateParams = {
      onProductCreated() {
        props.navigation.navigate('Home');
      }
    }
    props.navigation.navigate('ProductCreate', screenParams);
  }

  const handleMealDelete = <T extends { name: string, id: MealId }>(meal: T) => {
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
          data={props.mealsAndTemplates}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            item.type === 'template' ? (
              <MealListItemTemplate
                meal={item}
                onProductAdd={() => handleProductFinderNavigation(null, item)}
                onToggle={(templateId) => dispatch(Actions.mealTemplateToggled(templateId))}
              />
            ) : (
              <MealListItem
                meal={item}
                toggledProductId={props.toggledProductId}
                onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
                onLongPress={IS_DEV ? undefined : () => handleMealDelete(item)}
                onProductAdd={() => handleProductFinderNavigation(item.id)}
                {...!item.isTemplate && {
                  onProductDelete: (productId) => dispatch(Actions.mealProductDelete(item.id, productId)),
                  onProductToggle: (productId) => dispatch(Actions.productToggled(productId)),
                  onProductQuantityUpdate: (productId, quantity) => dispatch(
                    Actions.mealProductQuantityUpdate(item.id, productId, quantity)
                  )
                }}
              />
            )
          )}
        />
        <BasicInput
          marginVertical={15}
          placeholder="Nazwa nowego posiłku"
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button
          accessibilityLabel="Utwórz nowy posiłek"
          onPress={() => dispatch(Actions.mealCreate(name, props.appDate))}
        >
          Dodaj posiłek
        </Button>
        <Button
          style={{ marginTop: 30 }}
          onPress={handleProductCreatorNavigation}
        >
          Dodaj własny produkt
        </Button>
      </ScrollView>
    </Container>
  );
}

const HomeConnected = connect(
  (state: StoreState) => ({
    macroNeedsLeft: selectors.macroNeedsLeft(state),
    toggledProductId: state.diary.toggledProductId,
    appDate: state.application.date,
    appDateDay: state.application.day,
    mealsAndTemplates: selectors.mealsAndTemplates(state),
  })
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