import request from 'supertest';
import app from '../app';
import Category from '../models/category.model';

export default abstract class TestUtils {
  static testGetAll(path: string, expectedResponse: any[], status: number) {
    return request(app)
      .get(path)
      .expect(res => {
        expect(res.status).toBe(status);
        res.body.forEach((item: Category, index: number) => {
          expect(item).toMatchObject(expectedResponse[index]);
        });
      });
  }

  static testGet(path: string, expectedResponse: any, status: number) {
    return request(app)
      .get(path)
      .expect(res => {
        expect(res.status).toBe(status);
        expect(res.body).toMatchObject(expectedResponse);
      });
  }

  static testRoutePost(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .post(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.status).toBe(status);
        expect(res.body).toMatchObject(expectedResponse);
      });
  }

  static testRoutePut(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .put(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.status).toBe(status);
        expect(res.body).toMatchObject(expectedResponse);
      });
  }

  static testRouteDelete(path: string, expectedResponse: any, status: number) {
    return request(app)
      .delete(path)
      .expect(res => {
        expect(res.status).toBe(status);
        expect(res.body).toMatchObject(expectedResponse);
      });
  }
}
