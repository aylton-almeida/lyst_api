import TestUtils from '../utils/test.utils';
import Category from '../app/models/category.model';

let authToken: string;

beforeAll(done => {
  TestUtils.getAuthToken().end((err, response) => {
    authToken = response.body.token;
    done();
  });
});

beforeEach(async () => {
  await initializeDB();
});

describe('Testing all get operations', () => {
  test('should return a list with all categories', done => {
    const expectedResponse = [
      { title: 'Category 1', color: 'ffffff' },
      { title: 'Category 2', color: '000000' },
    ];
    TestUtils.testGetAll('/category', expectedResponse, 200, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return the first category', done => {
    const expectedResponse = { title: 'Category 1', color: 'ffffff' };
    TestUtils.testGet('/category/1', expectedResponse, 200, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return no category found with id', done => {
    const expectedResponse = { error: 'Category not found' };
    TestUtils.testGet('/category/4', expectedResponse, 404, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return invalid id', done => {
    const expectedResponse = {
      errors: [{ value: 'a', msg: 'invalid Id', param: 'id' }],
    };
    TestUtils.testGet('/category/a', expectedResponse, 422, authToken)
      .then(() => done())
      .catch(e => done(e));
  });
});

describe('Testing all create operations', () => {
  test('should create category increasing id', done => {
    const expectedResponse = { id: 3, title: 'category 3', color: 'ffffff' };
    const body = { title: 'category 3', color: 'ffffff' };
    TestUtils.testRoutePost('/category', expectedResponse, 200, body, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return invalid schema', done => {
    const expectedResponse = {
      errors: [
        {
          value: '123456789',
          msg: 'Color must be between 3 and 6 chars long',
        },
      ],
    };
    const body = { id: 2, title: 'category 2', color: '123456789' };
    TestUtils.testRoutePost('/category', expectedResponse, 422, body, authToken)
      .then(() => done())
      .catch(e => done(e));
  });
});

describe('Testing all update operations', () => {
  test('should update category', done => {
    const expectedResponse = { msg: 'Category updated' };
    const body = { id: 1, title: 'Category 1', color: 'ffffff' };
    TestUtils.testRoutePut('/category', expectedResponse, 200, body, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should point category not found', done => {
    const expectedResponse = { error: 'Category not found' };
    const body = { id: 4, title: 'Category 1', color: 'ffffff' };
    TestUtils.testRoutePut('/category', expectedResponse, 404, body, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return invalid schema', done => {
    const expectedResponse = {
      errors: [
        {
          value: 'fffffff',
          msg: 'Color must be between 3 and 6 chars long',
        },
      ],
    };
    const body = { id: 2, title: 'category 2', color: 'fffffff' };
    TestUtils.testRoutePut('/category', expectedResponse, 422, body, authToken)
      .then(() => done())
      .catch(e => done(e));
  });
});

describe('testing all delete operations', () => {
  test('should delete the first category', done => {
    const expectedResponse = { msg: 'Category deleted' };
    TestUtils.testRouteDelete('/category/1', expectedResponse, 200, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return category not found for deletion', done => {
    const expectedResponse = { error: 'Category not found' };
    TestUtils.testRouteDelete('/category/3', expectedResponse, 404, authToken)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return invalid schema', done => {
    const expectedResponse = {
      errors: [{ value: 'a', msg: 'invalid Id', param: 'id' }],
    };
    TestUtils.testRouteDelete('/category/a', expectedResponse, 422, authToken)
      .then(() => done())
      .catch(e => done(e));
  });
});

async function initializeDB() {
  await Category.destroy({ where: {}, force: true, restartIdentity: true, truncate: true });
  await Category.create({
    title: 'Category 1',
    color: 'ffffff',
  });
  await Category.create({
    title: 'Category 2',
    color: '000000',
  });
}
