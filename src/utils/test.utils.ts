import request from 'supertest';
import app from '../app';

export default abstract class TestUtils {
  static testRouteGet(path: string, expectedResponse: any, status: number) {
    return request(app)
      .get(path)
      .expect(status)
      .expect(res => {
        console.log(expectedResponse);
        console.log(res.body['id'] === expectedResponse['id']);
        console.log(res.body);
        Object.keys(expectedResponse).forEach(key => {
          if (res.body[key] !== expectedResponse[key]) return false;
        });
        return true;
      });
  }

  static testRoutePost(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .post(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(status)
      .expect(expectedResponse);
  }

  static testRoutePut(path: string, expectedResponse: any, status: number, body: object) {
    return request(app)
      .put(path)
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(status)
      .expect(expectedResponse);
  }

  static testRouteDelete(path: string, expectedResponse: any, status: number) {
    return request(app)
      .delete(path)
      .expect(status)
      .expect(expectedResponse);
  }
}
