import request from 'supertest';
import app from '../app';

jest.mock('../app/models/category.model', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const mockDb = new SequelizeMock();
  return mockDb.define('users', [
    {
      email: 'user1@email.com',
      password: 'password1',
    },
    {
      email: 'user2@email.com',
      password: 'password2',
    },
  ]);
});

jest.mock('../app/models/category.model', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const mockDb = new SequelizeMock();
  return mockDb.define('categories', [
    {
      title: 'Category 1',
      color: 555555,
      userId: 1,
    },
    {
      title: 'Category 2',
      color: 757575,
      userId: 2,
    },
  ]);
});

jest.mock('../app/models/category.model', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const mockDb = new SequelizeMock();
  return mockDb.define('notes', [
    {
      title: 'note 1',
      content: 'first note content',
      categoryId: 1,
      userId: 1,
    },
    {
      title: 'note 2',
      content: 'second note content',
      categoryId: 2,
      userId: 1,
    },
    {
      title: 'note 3',
      content: 'third note content',
      categoryId: 1,
      userId: 2,
    },
    {
      title: 'note 4',
      content: 'fourth note content',
      categoryId: 2,
      userId: 2,
    },
  ]);
});

export default abstract class TestUtils {
  static testGetAll(path: string, expectedResponse: any[], status: number, token: string) {
    return request(app)
      .get(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.length).toEqual(expectedResponse.length);
        res.body.forEach((item: any, index: number) => {
          expect(item).toMatchObject(expectedResponse[index]);
        });
        expect(res.status).toBe(status);
      });
  }

  static testGet(path: string, expectedResponse: any, status: number, token: string) {
    return request(app)
      .get(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRoutePost(
    path: string,
    expectedResponse: any,
    status: number,
    body: object,
    token: string,
  ) {
    return request(app)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testUnauthenticatedRoutePost(
    path: string,
    expectedResponse: any,
    status: number,
    body: object,
  ) {
    return request(app)
      .post(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRoutePut(
    path: string,
    expectedResponse: any,
    status: number,
    body: object,
    token: string,
  ) {
    return request(app)
      .put(path)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRouteDelete(path: string, expectedResponse: any, status: number, token: string) {
    return request(app)
      .delete(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static getAuthToken() {
    return request(app)
      .post('/auth')
      .send({
        email: 'user1@email.com',
        password: 'password1',
      });
  }

  static getPassResetToken() {
    return request(app)
      .post('/forgot_password')
      .send({
        email: 'user2@email.com',
        isTest: true,
      });
  }
}
