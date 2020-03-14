import TestUtils from '../utils/test.utils';
import Category from '../models/category.model';

describe('should perform all CRUD operations from CategoryController', () => {
  test('should return a list with all categories', done => {
    const expectedResponse = JSON.stringify([{ id: 1, title: 'category 1', color: 'ffffff' }]);
    TestUtils.testRouteGet('/category', expectedResponse, 200, done);
  });

  test('should return the first category', done => {
    const expectedResponse = JSON.stringify({ id: 1, title: 'category 1', color: 'ffffff' });
    TestUtils.testRouteGet('/category/1', expectedResponse, 200, done);
  });

  test('should return no category found with id', done => {
    const expectedResponse = JSON.stringify({ error: 'Category not found' });
    TestUtils.testRouteGet('/category/2', expectedResponse, 404, done);
  });

  test('should delete the first category', done => {
    const expectedResponse = 'Category deleted';
    TestUtils.testRouteDelete('/category/1', expectedResponse, 200, done);
  });

  test('should return category not found for deletion', done => {
    const expectedResponse = JSON.stringify({ error: 'Category not found' });
    TestUtils.testRouteDelete('/category/5', expectedResponse, 404, done);
  });

  test('should create category', done => {
    const expectedResponse = JSON.stringify(
      new Category({ id: 2, title: 'category 2', color: 'ffffff' })
    );
    TestUtils.testRoutePost(
      '/category',
      expectedResponse,
      200,
      done,
      new Category({ id: 2, title: 'category 2', color: 'ffffff' })
    );
  });
});
