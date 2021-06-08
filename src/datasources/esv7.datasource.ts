import {lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './esv7.datasource.config';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
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
