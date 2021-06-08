import {lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './esv7.datasource.config';

@lifeCycleObserver('datasource')
export class Esv7DataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'esv7';
  static readonly defaultConfig = config;

  constructor() {
    super(config);
  }
}
