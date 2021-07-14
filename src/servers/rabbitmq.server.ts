import {Context} from '@loopback/context';
import {Server} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Channel, connect, Connection, ConsumeMessage} from 'amqplib';
import {Replies} from 'amqplib/properties';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

export class RabbitmqServer extends Context implements Server {
  private _listening: boolean;

  conn: Connection;

  channel: Channel;

  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
  ) {
    super();
  }

  async start(): Promise<void> {
    try {
      this.conn = await connect({
        hostname: 'rabbitmq',
        username: 'admin',
        password: 'admin',
      });
      this._listening = true;
      await this.boot();
    } catch (error) {
      this._listening = false;
    }
  }

  async boot() {
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
          console.log('data=>', data)
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
}
