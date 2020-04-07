import express from 'express';
import * as bodyParser from 'body-parser';
import AuthController from './app/controllers/auth.controller';
import CategoryController from './app/controllers/category.controller';
import NoteController from './app/controllers/note.controller';

const app = express();

app.use(bodyParser.json());

const controllers = [new AuthController(), new CategoryController(), new NoteController()];

controllers.forEach((controller: any) => {
  app.use('/', controller.router);
});

export default app;
