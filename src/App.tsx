import React from 'react';
import { DatabaseProvider } from './context/Database';
import { Home } from './pages/Home';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from 'styled-components/native';
import { themeProps } from './common/theme';

export const App = () => {
  return (
    <Provider store={store}>
      <DatabaseProvider>
        <ThemeProvider theme={themeProps}>
          <ApplicationProvider
            mapping={mapping}
            theme={lightTheme}
          >
            <Home />
          </ApplicationProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </Provider>
  );
};