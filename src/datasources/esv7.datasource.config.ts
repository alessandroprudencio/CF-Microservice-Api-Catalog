import datasource from './esv7.datasource.config.json';

export default {
  ...datasource,
  connector: 'esv6',
  index: 'catalog',
  version: 7,
  debug: process.env.APP_ENV === 'dev',
  // defaultSize: 50,
  configuration: {
    node: process.env.ELASTIC_SEARCH_HOST,
    requestTimeout: Number(process.env.ELASTIC_SEARCH_REQUEST_TIMEOUT),
    pingTimeout: Number(process.env.ELASTIC_SEARCH_PING_TIMEOUT),
  },
  mappingProperties: {
    docType: {
      type: 'keyword',
    },
    id: {
      type: 'keyword',
    },
    name: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    description: {
      type: 'text',
    },
    isActive: {
      type: 'boolean',
    },
    createdAt: {
      type: 'date',
    },
    updatedAt: {
      type: 'date',
    },
  },
};
