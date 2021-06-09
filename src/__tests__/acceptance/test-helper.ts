import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {CfMicroserviceApiCatalogApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new CfMicroserviceApiCatalogApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  //@ts-ignore
  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: CfMicroserviceApiCatalogApplication;
  client: Client;
}
