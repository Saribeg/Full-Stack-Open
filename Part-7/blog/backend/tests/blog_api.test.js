const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const { initialData, handleInitialDataInDb } = require('../utils/testDbSetup');

const api = supertest(app);
let authenticatedApi;
let authenticatedUser;

describe('Integration tests. Testing the CRUD API for blogs', () => {
  beforeEach(async () => {
    await handleInitialDataInDb();
    const { agent, user } = await helper.getAuthenticatedAgent({
      username: 'jessica',
      password: 'sekret',
    });

    authenticatedApi = agent;
    authenticatedUser = user;
  });

  describe('test GET/posts', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');

      assert.strictEqual(response.body.length, initialData.blogs.length);
    });

    test('the unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs');
      const blog = response.body[0];

      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });

  describe('retrieval of existing blog by id', () => {
    test('succeeds with status 200 and returns the correct blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const returnedBlog = response.body;

      assert.strictEqual(returnedBlog.id, blogToView.id);
      assert.strictEqual(returnedBlog.title, blogToView.title);
      assert.strictEqual(returnedBlog.url, blogToView.url);
      assert.ok(returnedBlog.user);
      assert.ok(returnedBlog.user.username);
    });

    test('returns 404 if blog does not exist', async () => {
      const nonExistingId = await helper.nonExistingId();

      const response = await api
        .get(`/api/blogs/${nonExistingId}`)
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog not found');
    });

    test('returns 400 if id is invalid', async () => {
      const invalidId = '12345invalidid';

      const response = await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400);

      assert.ok(response.body.error);
      assert.match(response.body.error, /malformatted|cast/i);
    });
  });

  describe('creation of a new blog', () => {
    test('a new blog can be added ', async () => {
      const newBlog = {
        title: 'Node.js event loop',
        author: 'Saribeh Karakhanian',
        url: 'https://nodejseventloop.com/',
        likes: 100
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const savedBlog = response.body;
      const { id, title, author, url, likes, user } = savedBlog;

      assert.ok(id);
      assert.deepStrictEqual({ title, author, url, likes }, newBlog);
      assert.deepStrictEqual(user, authenticatedUser);
    });

    test('when adding a new blog without likes property the default value 0 is set ', async () => {
      const newBlog = {
        title: 'React Server Components and Next.js',
        author: 'Harry Potter',
        url: 'https://reactandnextjs.com/'
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const savedBlog = response.body;
      const { id, title, author, url, likes } = savedBlog;

      assert.ok(id);
      assert.deepStrictEqual({ title, author, url, likes }, { ...newBlog, likes: 0 });
      assert.strictEqual(likes, 0);
    });

    test('when adding a new blog without title property the error is returned', async () => {
      const newBlog = {
        author: 'Harry Potter',
        url: 'https://rabbitmqorkafka.com/',
        likes: 5
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('when adding a new blog without url property the error is returned', async () => {
      const newBlog = {
        title: 'RabbitMQ or Kafka?',
        author: 'Harry Potter',
        likes: 5
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('creation fails with 401 if token is missing', async () => {
      const newBlog = { title: 'No Token', author: 'Test', url: 'https://no.token' };
      const response = await api.post('/api/blogs').send(newBlog).expect(401);
      assert.match(response.body.error, /token/i);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is creator', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const userId = authenticatedUser.id;
      const blogToDelete = blogsAtStart.find(blog => blog.user.toString() === userId);

      await authenticatedApi.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const ids = blogsAtEnd.map(b => b.id);
      assert(!ids.includes(blogToDelete.id));
      const deleted = blogsAtEnd.find(b => b.id === blogToDelete.id);
      assert.strictEqual(deleted, undefined);
    });

    test('returns 404 if a blog for deletion is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const userId = authenticatedUser.id;
      const blogToDelete = blogsAtStart.find(blog => blog.user.toString() !== userId);

      const response = await authenticatedApi.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'blog can be deleted only by user who created it');
    });

    test('blog can be deleted only by user who created it', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogIdToDelete = await helper.nonExistingId();

      const response = await authenticatedApi.delete(`/api/blogs/${blogIdToDelete}`).expect(404);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('deletion fails with 401 if token is missing', async () => {
      const blogs = await helper.blogsInDb();
      const blogToDelete = blogs[0];

      const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
      assert.match(response.body.error, /token/i);
    });
  });

  describe('update of a blog', () => {
    test('successfully updates likes of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      const response = await authenticatedApi
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, updatedData.likes);
    });

    test('returns 404 if a blog for update is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const exampleData = blogsAtStart[0];
      const updatedData = { ...exampleData, likes: exampleData.likes + 1 };
      const blogIdToUpdate = await helper.nonExistingId();

      const response = await authenticatedApi
        .put(`/api/blogs/${blogIdToUpdate}`)
        .send(updatedData)
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });
  });

  describe('adding comments to blogs', () => {
    test('succeeds with status 201 when adding a valid comment', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const validComment = { comment: 'This is a very thoughtful and insightful comment!' };

      const response = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(validComment)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const updatedBlog = response.body;
      assert.ok(updatedBlog.comments);
      assert.ok(updatedBlog.comments.length > 0);

      const addedComment = updatedBlog.comments.find(c => c.text === validComment.comment);
      assert.ok(addedComment);
      assert.ok(addedComment.id);
      assert.strictEqual(addedComment.text, validComment.comment);
      assert.strictEqual(addedComment.user.id, authenticatedUser.id);
    });

    test('fails with 400 if comment is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send({})
        .expect(400);

      assert.ok(response.body.error);
      assert.match(response.body.error, /comment/i);
    });

    test('fails with 400 if comment is shorter than minlength (20 chars)', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const shortComment = { comment: 'too short' };

      const response = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(shortComment)
        .expect(400);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('returns 404 if blog does not exist', async () => {
      const nonExistingId = await helper.nonExistingId();

      const response = await authenticatedApi
        .post(`/api/blogs/${nonExistingId}/comments`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('returns 400 if blog id is invalid', async () => {
      const invalidId = 'not-a-valid-id';

      const response = await authenticatedApi
        .post(`/api/blogs/${invalidId}/comments`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(400);

      assert.ok(response.body.error);
      assert.match(response.body.error, /malformatted|cast/i);
    });

    test('fails with 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await api
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(401);

      assert.ok(response.body.error);
      assert.match(response.body.error, /token/i);
    });
  });

  describe('editing comments', () => {
    test('succeeds with status 200 when editing own comment', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newComment = { comment: 'This is a very thoughtful and insightful comment!' };
      const addResponse = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const updatedText = 'This is an updated comment that is definitely long enough!';
      const editResponse = await authenticatedApi
        .put(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .send({ comment: updatedText })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const updatedBlog = editResponse.body;
      const editedComment = updatedBlog.comments.find(c => c.id === addedComment.id);

      assert.strictEqual(editedComment.text, updatedText);
      assert.ok(editedComment.editedAt);
    });

    test('fails with 400 if comment text is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newComment = { comment: 'This is a valid initial comment long enough!' };
      const addResponse = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const response = await authenticatedApi
        .put(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .send({})
        .expect(400);

      assert.match(response.body.error, /comment/i);
    });

    test('fails with 400 if comment text is shorter than minlength (20 chars)', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newComment = { comment: 'This is a valid initial comment long enough!' };
      const addResponse = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const response = await authenticatedApi
        .put(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .send({ comment: 'too short' })
        .expect(400);

      assert.match(response.body.error, /validation/i);
    });

    test('returns 404 if blog does not exist', async () => {
      const nonExistingBlogId = await helper.nonExistingId();

      const response = await authenticatedApi
        .put(`/api/blogs/${nonExistingBlogId}/comments/123456789012`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(404);

      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('returns 404 if comment does not exist', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await authenticatedApi
        .put(`/api/blogs/${blogToComment.id}/comments/123456789012`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(404);

      assert.strictEqual(response.body.error, 'Comment is not found');
    });

    test('fails with 401 if trying to edit someone else’s comment', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newUser = {
        username: 'anotheruser',
        name: 'Another User',
        password: 'sekret'
      };

      await api.post('/api/users').send(newUser).expect(201);

      const { agent: otherApi } = await helper.getAuthenticatedAgent({
        username: newUser.username,
        password: newUser.password
      });

      const newComment = { comment: 'This is a valid comment by another user.' };
      const addResponse = await otherApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const response = await authenticatedApi
        .put(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .send({ comment: 'Trying to edit someone else’s comment!' })
        .expect(401);

      assert.match(response.body.error, /own comments/i);
    });

    test('fails with 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await api
        .put(`/api/blogs/${blogToComment.id}/comments/123456789012`)
        .send({ comment: 'This is a valid long enough comment text!' })
        .expect(401);

      assert.match(response.body.error, /token/i);
    });
  });

  describe('deleting comments', () => {
    test('succeeds with status 200 when deleting own comment', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newComment = { comment: 'This is my comment and I will delete it later.' };
      const addResponse = await authenticatedApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const deleteResponse = await authenticatedApi
        .delete(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const updatedBlog = deleteResponse.body;
      const deletedComment = updatedBlog.comments.find(c => c.id === addedComment.id);

      assert.strictEqual(deletedComment, undefined);
    });

    test('returns 404 if blog does not exist', async () => {
      const nonExistingBlogId = await helper.nonExistingId();

      const response = await authenticatedApi
        .delete(`/api/blogs/${nonExistingBlogId}/comments/123456789012`)
        .expect(404);

      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('returns 404 if comment does not exist', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await authenticatedApi
        .delete(`/api/blogs/${blogToComment.id}/comments/123456789012`)
        .expect(404);

      assert.strictEqual(response.body.error, 'Comment is not found');
    });

    test('fails with 401 if trying to delete someone else’s comment', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const newUser = {
        username: 'deleter',
        name: 'Other User',
        password: 'sekret'
      };
      await api.post('/api/users').send(newUser).expect(201);
      const { agent: otherApi } = await helper.getAuthenticatedAgent({
        username: newUser.username,
        password: newUser.password
      });

      const newComment = { comment: 'Comment by another user to be protected.' };
      const addResponse = await otherApi
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(201);

      const addedComment = addResponse.body.comments.find(c => c.text === newComment.comment);

      const response = await authenticatedApi
        .delete(`/api/blogs/${blogToComment.id}/comments/${addedComment.id}`)
        .expect(401);

      assert.match(response.body.error, /own comments/i);
    });

    test('fails with 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToComment = blogsAtStart[0];

      const response = await api
        .delete(`/api/blogs/${blogToComment.id}/comments/123456789012`)
        .expect(401);

      assert.match(response.body.error, /token/i);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});