import TestUtils from '../utils/test.utils';
import Category from '../models/category.model';
import { fakeDB } from '../utils/fakeDB';

beforeEach(() => {
  // TODO: Change for real db in the future
  while (fakeDB.length > 0) fakeDB.pop();
  fakeDB.push(new Category({ id: 1, title: 'category 1', color: 'ffffff' }));
});

describe('testing all get operations', () => {
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

  test('should return invalid id', done => {
    const expectedResponse = JSON.stringify({
      errors: [{ value: 'a', msg: 'invalid Id', param: 'id', location: 'params' }],
    });
    TestUtils.testRouteGet('/category/a', expectedResponse, 422, done);
  });
});

describe('testing all create operations', () => {
  test('should create category increasing id', done => {
    const expectedResponse = JSON.stringify(
      new Category({ id: 2, title: 'category 2', color: 'ffffff' })
    );
    const body = new Category({ title: 'category 2', color: 'ffffff' });
    TestUtils.testRoutePost('/category', expectedResponse, 200, done, body);
  });

  test('should return invalid schema', done => {
    const expectedResponse = JSON.stringify({
      errors: [
        {
          value: 'fffffff',
          msg: 'Color must be between 3 and 6 chars long',
          param: 'color',
          location: 'body',
        },
      ],
    });
    const body = new Category({ id: 2, title: 'category 2', color: 'fffffff' });
    TestUtils.testRoutePost('/category', expectedResponse, 422, done, body);
  });
});

describe('testing all update operations', () => {
  test('should update category', done => {
    const expectedResponse = 'Category updated';
    const body = new Category({ id: 1, title: 'category 1', color: 'ffffff' });
    TestUtils.testRoutePut('/category', expectedResponse, 200, done, body);
  });

  test('should point category not found', done => {
    const expectedResponse = { error: 'Category not found' };
    const body = new Category({ title: 'category 1', color: 'ffffff' });
    TestUtils.testRoutePut('/category', expectedResponse, 404, done, body);
  });

  test('should return invalid schema', done => {
    const expectedResponse = JSON.stringify({
      errors: [
        {
          value: 'fffffff',
          msg: 'Color must be between 3 and 6 chars long',
          param: 'color',
          location: 'body',
        },
      ],
    });
    const body = new Category({ id: 2, title: 'category 2', color: 'fffffff' });
    TestUtils.testRoutePut('/category', expectedResponse, 422, done, body);
  });
});

describe('testing all delete operations', () => {
  test('should delete the first category', done => {
    const expectedResponse = 'Category deleted';
    TestUtils.testRouteDelete('/category/1', expectedResponse, 200, done);
  });

  test('should return category not found for deletion', done => {
    const expectedResponse = JSON.stringify({ error: 'Category not found' });
    TestUtils.testRouteDelete('/category/2', expectedResponse, 404, done);
  });

  test('should return invalid schema', done => {
    const expectedResponse = JSON.stringify({
      errors: [{ value: 'a', msg: 'invalid Id', param: 'id', location: 'params' }],
    });
    TestUtils.testRouteDelete('/category/a', expectedResponse, 422, done);
  });
});
