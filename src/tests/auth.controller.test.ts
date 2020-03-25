import User from '../app/models/user.model';
import TestUtils from '../utils/test.utils';
import request from 'supertest';
import app from '../app';

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

describe('Testing all create operations', () => {
  test('should create a new user with auth token', done => {
    const expectedResponse = { newUser: { id: 3, email: 'user3@email.com' } };
    const body = { email: 'user3@email.com', password: 'password3' };
    return request(app)
      .post('/user')
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(200);
      })
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return that the password is two small', done => {
    const expectedResponse = {
      errors: [{ value: 'pass', msg: 'Password must be at least 8 characters long' }],
    };
    const body = { email: 'user3@email.com', password: 'pass' };
    TestUtils.testUnauthenticatedRoutePost('/user', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return that email is invalid', done => {
    const expectedResponse = { errors: [{ value: 'email', msg: 'Invalid Email' }] };
    const body = { email: 'email', password: 'password' };
    TestUtils.testUnauthenticatedRoutePost('/user', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return email already in use', done => {
    const expectedResponse = { error: 'Email already in use' };
    const body = { email: 'user1@email.com', password: 'password' };
    TestUtils.testUnauthenticatedRoutePost('/user', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });
});

describe('Testing authentication', () => {
  test('should return the authenticated user`and hash', done => {
    const expectedResponse = { user: { email: 'user1@email.com', password: '' } };
    const body = { email: 'user1@email.com', password: 'password1' };
    return request(app)
      .post('/auth')
      .send(body)
      .set({ Accept: 'application/json' })
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(200);
      })
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return user not found', done => {
    const expectedResponse = { error: 'User not found' };
    const body = { email: 'user3@email.com', password: 'password3' };
    TestUtils.testUnauthenticatedRoutePost('/auth', expectedResponse, 400, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return invalid password', done => {
    const expectedResponse = { error: 'Invalid password' };
    const body = { email: 'user1@email.com', password: 'password2' };
    TestUtils.testUnauthenticatedRoutePost('/auth', expectedResponse, 400, body)
      .then(() => done())
      .catch(e => done(e));
  });
});

describe('Testing authorization', () => {
  test('should return required authorization', done => {
    const expectedResponse = { error: 'No token provided' };
    return request(app)
      .get('/category')
      .expect(res => {
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject(expectedResponse);
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });

  test('should return token malformed', done => {
    const expectedResponse = { error: 'Token malformed' };
    return request(app)
      .get('/category')
      .set('Authorization', 'malformed token')
      .expect(res => {
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject(expectedResponse);
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });

  test('should return invalid token', done => {
    const expectedResponse = { error: 'Token invalid' };
    return request(app)
      .get('/category')
      .set('Authorization', `Bearer invalid-token`)
      .expect(res => {
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject(expectedResponse);
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });

  test('should respond with JSON', done => {
    return request(app)
      .get('/category')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(response => {
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });
});

describe('Testing forgot password', () => {
  test('should return E-mail sent', done => {
    const expectedResponse = { msg: 'E-mail sent' };
    const body = { email: 'almeida@aylton.dev', isTest: true };
    return request(app)
      .post('/forgot_password')
      .send(body)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(200);
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });

  test('should return invalid body', done => {
    const expectedResponse = { errors: [{ msg: 'Invalid Email' }] };
    const body = { user: 'almeida@aylton.dev', isTest: true };
    return request(app)
      .post('/forgot_password')
      .send(body)
      .expect(res => {
        expect(res.body).toMatchObject(expectedResponse);
        expect(res.status).toBe(422);
      })
      .end(e => {
        if (e) done(e);
        done();
      });
  });
});

async function initializeDB() {
  await User.destroy({ where: {}, force: true, restartIdentity: true, truncate: true });
  await User.create({ email: 'user1@email.com', password: 'password1' });
  await User.create({ email: 'user2@email.com', password: 'password2' });
}
