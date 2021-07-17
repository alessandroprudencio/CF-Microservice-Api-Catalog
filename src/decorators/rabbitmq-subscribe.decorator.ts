import {Options} from 'amqplib'
import {MethodDecoratorFactory} from '@loopback/metadata'

export interface RabbitmqSubscribeMetadata {
  exchange: string,
  routingKey: string | string[],
  queue?: string,
  queueOptions?: Options.AssertQueue
}

export const RABBITMQ_SUBSCRIBE_DECORATOR = 'rabbitmq-subscribe-metadata'


export function rabbitmqSubscriber(subscriber: RabbitmqSubscribeMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<RabbitmqSubscribeMetadata>(
    RABBITMQ_SUBSCRIBE_DECORATOR,
    subscriber
  )
}
