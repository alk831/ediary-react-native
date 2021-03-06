import React from 'react';
import styled from 'styled-components/native';
import { H2, TextSecondary, MacroDetails } from '../..';
import { THEME } from '../../../common/theme';
import { ProductOrNormalizedProduct } from '../../../database/entities';

interface ProductSearchItemProps<T = ProductOrNormalizedProduct> {
  product: T
  onSelect: (product: T) => void
}

export const ProductSearchItem = (props: ProductSearchItemProps) => {
  return (
    <Container
      onPress={() => props.onSelect(props.product)}
      accessibilityLabel="Dodaj produkt do posiłku"
      accessibilityHint="Wraca na główną stronę i dodaje produkt do posiłku"
    >
      <ProductName>{props.product.name}</ProductName>
      <Content>
        <MacroContainer>
          <MacroDetails
            title="W"
            color={THEME.color.carbs}
            value={props.product.macro.carbs}
          />
          <MacroDetails
            title="B"
            color={THEME.color.prots}
            value={props.product.macro.prots}
          />
          <MacroDetails
            title="T"
            color={THEME.color.fats}
            value={props.product.macro.fats}
          />
        </MacroContainer>
        <Info>
          <TextSecondary>
            {props.product.portion}g
          </TextSecondary>
          <Calories>
            {props.product.macro.kcal} kcal
          </Calories>
        </Info>
      </Content>
    </Container>
  );
}

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`

const Calories = styled(H2)`
  font-size: ${props => props.theme.fontSize.h4};
`

const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.baseXSmall};
`

const Info = styled.View`
  align-items: flex-end;
`

const MacroContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.micro};
`

const ProductName = styled(H2)`
  font-size: 14px;
`

export const ProductSearchItemMemo = React.memo(ProductSearchItem);