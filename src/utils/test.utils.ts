import request from 'supertest';
import app from '../app';
import Category from '../app/models/category.model';

export default abstract class TestUtils {
  static testGetAll(path: string, expectedResponse: any[], status: number, token: string) {
    return request(app)
      .get(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        res.body.forEach((item: Category, index: number) => {
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
    token: string
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
    body: object
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
    token: string
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
        email: 'user1@email.com',
        isTest: true,
      });
  }

}
