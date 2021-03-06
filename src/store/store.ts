import { createStore, applyMiddleware, Store, Action } from 'redux';
import { rootReducer } from './reducers';
import thunk, { ThunkAction } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

export function configureStore(
  initialState?: Partial<StoreState>
): Store<StoreState> {

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        thunk
      )
    )
  );

  module.hot?.accept(() => {
    // eslint-disable-next-line
    const { rootReducer } = require('./reducers');
    store.replaceReducer(rootReducer);
  });

  return store;
}

export const store = configureStore();

export type StoreState = ReturnType<typeof rootReducer>;
export { StoreState as AppState };

export type Thunk<
  R = void,
  A extends Action = Action<string>
> = ThunkAction<R, StoreState, void, A>;