import App from './app';
import CategoryController from './controllers/category.controller';

const app = new App(
    [
        new CategoryController(),
    ],
    8080
);

app.listen();
