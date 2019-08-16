import { ConnectionOptions } from 'typeorm';
import * as entities from './entities';
import * as migrations from './migrations';
import { Environment } from '../types';
import { APP_ENV, IS_DEV } from '../common/consts';

export const migrationsArray = Object.values(migrations);
export const entitiesArray = Object.values(entities);

export const config: DatabaseConfig = {
  development: {
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    dropSchema: false,
    synchronize: false,
    migrations: migrationsArray,
    entities: entitiesArray
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: ['error'],
    migrations: migrationsArray,
    entities: entitiesArray
  },
  production: {
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    dropSchema: false,
    synchronize: true,
    migrations: migrationsArray,
    entities: entitiesArray
  }
}

export const databaseConfig = config[IS_DEV ? 'development' : 'production'];

type DatabaseConfig = { [key in Environment]: ConnectionOptions }