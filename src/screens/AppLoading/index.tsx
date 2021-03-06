import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { DEFAULT_CONNECTION } from '../../common/consts';
import { Actions } from '../../store';
import { databaseConfig } from '../../database/config/config';
import { getOrCreateConnection } from '../../database/utils/getOrCreateConnection';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import { useAppError } from '../../hooks';

export const AppLoadingScreen = () => {
  const dispatch = useDispatch();
  const { setAppError } = useAppError();

  useEffect(() => {
    async function bootstrap() {
      try {
        const defaultConnection = await getOrCreateConnection(
          DEFAULT_CONNECTION, { name: DEFAULT_CONNECTION, ...databaseConfig }
        );
    
        const hasMigrationsToRun = await defaultConnection.showMigrations();
    
        if (hasMigrationsToRun) {
          await defaultConnection.runMigrations();
        }
    
        await dispatch(Actions.userInitialize());
    
      } catch(error) {
        setAppError(error);
      }
    }

    bootstrap();
  }, [dispatch]);

  return <Spinner size="large" />;
}

const Spinner = styled(ActivityIndicator)`
  flex: 1;
`