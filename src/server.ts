import App from './app';
import CategoryController from './controllers/category.controller';

const app = new App([new CategoryController()], process.env.PORT || 8080);

app.listen();
