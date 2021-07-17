import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {rabbitmqSubscribe} from '../decorators/rabbitmq-subscribe.decorator';
import {GenreRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class GenreSyncService {
  constructor(
    @repository(GenreRepository) private genreRepo: GenreRepository,
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    queue: 'micro-catalog/sync-videos/genre',
    routingKey: 'model.genre.*'
  })

  async handler({message, data}: any) {
    const action = message.fields.routingKey.split('.')[2]

    switch (action) {
      case 'created':
        await this.genreRepo.create(data)
        break;
      case 'updated':
        await this.genreRepo.updateById(data, data.id)
        break;
      case 'deleted':
        await this.genreRepo.deleteById(data.id)
        break;
    }
  }
}
