import request from 'supertest';
import app from '../app';
import Category from '../models/category.model';

export default abstract class TestUtils {
  static testGetAll(path: string, expectedResponse: any[], status: number) {
    return request(app)
      .get(path)
      .expect(res => {
        res.body.forEach((item: Category, index: number) => {
          expect(item).toMatchObject(expectedResponse[index]);
        });
        expect(res.status).toBe(status);
      });
  }

  static testGet(path: string, expectedResponse: any, status: number) {
    return request(app)
      .get(path)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRoutePost(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .post(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRoutePut(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .put(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }

  static testRouteDelete(path: string, expectedResponse: any, status: number) {
    return request(app)
      .delete(path)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(status);
      });
  }
}
