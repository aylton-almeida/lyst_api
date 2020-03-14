import express from 'express';
import * as bodyParser from 'body-parser';
import CategoryController from './controllers/category.controller';

const app = express();

app.use(bodyParser.json());

const controllers = [new CategoryController()];

controllers.forEach((controller: any) => {
  app.use('/', controller.router);
});

export default app;
