import TestUtils from '../utils/test.utils';
import Note from '../app/models/note.model';

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

async function initializeDB() {
  await Note.destroy({ where: {}, force: true, restartIdentity: true });
  await Note.bulkCreate([
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
}
