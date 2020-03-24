import express from 'express';
import * as bodyParser from 'body-parser';
import CategoryController from './controllers/category.controller';
import AuthController from './controllers/auth.controller';

const app = express();

app.use(bodyParser.json());

const controllers = [
  new AuthController(),
  new CategoryController(),
];

controllers.forEach((controller: any) => {
  app.use('/', controller.router);
});

export default app;
