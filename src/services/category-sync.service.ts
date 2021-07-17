import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {rabbitmqSubscriber} from '../decorators/rabbitmq-subscribe.decorator';

@injectable({scope: BindingScope.TRANSIENT})
export class CategorySyncService {
  constructor(/* Add @inject to inject parameters */) { }

  @rabbitmqSubscriber({
    exchange: 'amq.topic',
    queue: 'x',
    routingKey: 'model.category.*'
  })

  handler() {
    // this.repository.create()
  }
}
