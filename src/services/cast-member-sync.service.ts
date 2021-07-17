import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {rabbitmqSubscribe} from '../decorators/rabbitmq-subscribe.decorator';
import {CastMemberRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class CastMemberSyncService {
  constructor(
    @repository(CastMemberRepository) private castMemberRepo: CastMemberRepository,
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'micro-catalog/sync-videos/cast_member',
    routingKey: 'model.cast_member.*'
  })

  async handler({message, data}: any) {
    const action = message.fields.routingKey.split('.')[2]

    switch (action) {
      case 'created':
        await this.castMemberRepo.create(data)
        break;
      case 'updated':
        await this.castMemberRepo.updateById(data, data.id)
        break;
      case 'deleted':
        await this.castMemberRepo.deleteById(data.id)
        break;
    }
  }
}
