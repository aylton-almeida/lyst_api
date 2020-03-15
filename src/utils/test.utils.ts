import request from 'supertest';
import app from '../app';

export default abstract class TestUtils {
  static testRouteGet(path: string, expectedResponse: any, status: number, done: any) {
    request(app)
      .get(path)
      .expect(status)
      .expect(expectedResponse)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  }

  static testRoutePost(
    path: string,
    expectedResponse: any,
    status: number,
    done: any,
    body: object
  ) {
    request(app)
      .post(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(status)
      .expect(expectedResponse)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  }
  static testRoutePut(
    path: string,
    expectedResponse: any,
    status: number,
    done: any,
    body: object
  ) {
    request(app)
      .put(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(status)
      .expect(expectedResponse)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  }

  static testRouteDelete(path: string, expectedResponse: any, status: number, done: any) {
    request(app)
      .delete(path)
      .expect(status)
      .expect(expectedResponse)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  }
}
