import {Context, inject} from '@loopback/context';
import {ApplicationConfig, Server} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Channel, ConsumeMessage} from 'amqplib';
import {Replies} from 'amqplib/properties';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {RabbitmqBindings} from '../keys';
import {AmqpConnectionManager, AmqpConnectionManagerOptions, ChannelWrapper, connect} from 'amqp-connection-manager';

export interface RabbitmqConfig {
  uri: string,
  connOptions?: AmqpConnectionManagerOptions
}

export class RabbitmqServer extends Context implements Server {
  private _listening: boolean;

  private _conn: AmqpConnectionManager;

  private _channelManager: ChannelWrapper;

  channel: Channel;

  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @inject(RabbitmqBindings.CONFIG) private config: RabbitmqConfig
  ) {
    super();
    console.log(config);
  }

  async start(): Promise<void> {
    this._conn = connect([this.config.uri], this.config.connOptions);

    this._channelManager = this._conn.createChannel();

    this._channelManager.on('connect', () => {
      this._listening = true;
      console.log('Successfully connected a RabbitMQ channel');
    })
    this._channelManager.on('error', (err, {name}) => {
      this._listening = false;
      console.log(`Fail to setup a RabbitMQ channel name - ${name}`)
    })

    this._listening = true;

    // this.boot();
  }

  async boot() {
    // @ts-ignore
    this.channel = await this.conn.createChannel();

    const queue: Replies.AssertQueue = await this.channel.assertQueue(
      'micro-catalog/sync-videos',
    );

    const exchange: Replies.AssertExchange = await this.channel.assertExchange(
      'amq.topic',
      'topic',
    );

    await this.channel.bindQueue(queue.queue, exchange.exchange, 'model.*.*');

    this.channel.publish(
      'amq.direct',
      'my-routing-key',
      Buffer.from(JSON.stringify({message: 'insert new category'})),
    );

    // Example msg
    // {"id": "dddab32b-a0ac-435e-9fd8-5350dd98dd4d","name": "categoria 1","createdAt": "2020-02-01","updatedAt": "2020-02-01"}

    this.channel.consume(queue.queue, (msg: ConsumeMessage | null) => {
      if (!msg) return;


      const data = JSON.parse(msg.content.toString());


      const [model, event] = msg.fields.routingKey.split('.').slice(1);

      this
        .sync({model, event, data})
        .then(() => this.channel.ack(msg))
        .catch(err => {
          this.channel.reject(msg, false);
        });
    });
  }

  async sync({
    model,
    event,
    data,
  }: {
    model: string;
    event: string;
    data: Category;
  }) {
    if (model === 'category') {
      switch (event) {
        case 'created':
          await this.categoryRepo.create({
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          break;
        case 'updated':
          await this.categoryRepo.updateById(data.id, data);
          break;
        case 'deleted':
          await this.categoryRepo.deleteById(data.id);
          break;
      }
    }
  }

  async stop(): Promise<void> {
    await this.conn.close();
    this._listening = false;
  }

  get listening(): boolean {
    return this._listening;
  }

  get conn(): AmqpConnectionManager {
    return this._conn;
  }
}
