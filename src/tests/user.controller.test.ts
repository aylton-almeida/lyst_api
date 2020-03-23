import User from '../models/user.model';
import TestUtils from '../utils/test.utils';

beforeEach(async () => {
  await initializeDB();
});

describe('Testing all create operations', () => {
  test('should create a new user increasing id', done => {
    const expectedResponse = { id: 3, email: 'user3@email.com' };
    const body = { email: 'user3@email.com', password: 'password3' };
    TestUtils.testRoutePost('/auth', expectedResponse, 200, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return that the password is two small', done => {
    const expectedResponse = {
      errors: [{ value: 'pass', msg: 'Password must be at least 8 characters long' }],
    };
    const body = { email: 'user3@email.com', password: 'pass' };
    TestUtils.testRoutePost('/auth', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return that email is invalid', done => {
    const expectedResponse = { errors: [{ value: 'email', msg: 'Invalid Email' }] };
    const body = { email: 'email', password: 'password' };
    TestUtils.testRoutePost('/auth', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });

  test('should return email already in use', done => {
    const expectedResponse = { error: 'Email already in use' };
    const body = { email: 'user1@email.com', password: 'password' };
    TestUtils.testRoutePost('/auth', expectedResponse, 422, body)
      .then(() => done())
      .catch(e => done(e));
  });
});

async function initializeDB() {
  await User.destroy({ where: {}, force: true, restartIdentity: true, truncate: true });
  await User.create({ email: 'user1@email.com', password: 'password1' });
  await User.create({ email: 'user2@email.com', password: 'password2' });
}
