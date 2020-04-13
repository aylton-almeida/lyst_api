import TestUtils from '../utils/test.utils';

let authToken: string;

beforeAll(done => {
  TestUtils.getAuthToken().end((err, response) => {
    authToken = response.body.token;
    done();
  });
});

beforeEach(async () => jest.resetAllMocks());

describe('Testing all get operations', () => {
  test('should return a list with all notes', done => {
    const expectedResponse = [
      { title: 'note 1', content: 'first note content', categoryId: 1, userId: 1 },
      { title: 'note 2', content: 'second note content', categoryId: 2, userId: 1 },
    ];
    return TestUtils.testGetAll('/note', expectedResponse, 200, authToken)
      .then(() => done())
      .catch(e => done(e));
  });
});
