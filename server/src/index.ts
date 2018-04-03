import 'reflect-metadata';
import { useExpressServer, useContainer, RoutingControllersOptions } from 'routing-controllers';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from './utils/logger';
import { Config } from './config';
import { IDebugger } from 'debug';
import { Application } from 'express';
import { DataSourceConfig } from './datasource/config/DataSource.config';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as debug from 'debug';

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance = this.loggerFactory.getInstance('App');

  private debug: IDebugger = debug('app:main');

  public async run(): Promise<void> {
    this.debug('starting express app');
    const app: Application = express();
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());
    app.use(cors());
    app.use(this.loggerFactory.requestLogger);

    this.debug('dependency injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);

    const apiPath = Config.settings.apiPath;
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix: apiPath,
      controllers: [`${__dirname}${apiPath}/*.ts`]
    };

    this.debug('routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    this.debug('listen');
    app.listen(Number(Config.settings.port), Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);
    this.logger.info(process.env.PGHOST);
    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
