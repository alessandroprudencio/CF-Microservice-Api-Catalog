import {DefaultCrudRepository} from '@loopback/repository';
import {Message} from 'amqplib';
import {pick, camelCase} from 'lodash';

export interface SyncOptions {
  repo: DefaultCrudRepository<any, any>;
  data: any;
  message: Message;

}

export abstract class BaseModelSyncService {

  protected async sync({repo, message, data}: SyncOptions) {
    const {id} = data || {}
    const action = this.getAction(message)

    const entity = this.createEntity(data, repo)

    switch (action) {
      case 'created':
        await repo.create(entity)
        break;
      case 'updated':
        await this.updateOrCreate({repo, id, entity})
        break;
      case 'deleted':
        await repo.deleteById(id)
        break;
    }
  }

  protected getAction(message: Message) {
    return message.fields.routingKey.split('.')[2]
  }

  protected createEntity(data: any, repo: DefaultCrudRepository<any, any>) {
    const convertCamelCase = Object.keys(data).reduce((attrs, key) => ({
      ...attrs,
      [camelCase(key)]: data[key],
    }), {})

    return pick(convertCamelCase, Object.keys(repo.entityClass.definition.properties))
  }

  protected async updateOrCreate({repo, id, entity}: {repo: DefaultCrudRepository<any, any>, id: string, entity: any}) {
    const exists = await repo.exists(id)

    return exists ? repo.updateById(id, entity) : repo.create(entity)
  }

}
