import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Comments - E2E Tests', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /comments - Create', () => {
    it('1. should create a new comment with valid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/comments')
        .send({
          text: 'This is a great post!',
          postId: '1',
          authorId: '1',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.text).toBe('This is a great post!');
      expect(res.body.data.postId).toBe('1');
      expect(res.body.data).toHaveProperty('createdAt');
      createdId = res.body.data.id;
    });

    it('2. should fail if required "text" field is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/comments')
        .send({
          postId: '1',
          authorId: '1',
        })
        .expect(400);

      expect(res.body.message).toContain('text');
    });

    it('3. should fail if required "postId" field is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/comments')
        .send({
          text: 'Comment text',
          authorId: '1',
        })
        .expect(400);

      expect(res.body.message).toContain('postId');
    });

    it('4. should create a comment with nested parent comment', async () => {
      const res = await request(app.getHttpServer())
        .post('/comments')
        .send({
          text: 'Reply to comment',
          postId: '1',
          authorId: '2',
          parentCommentId: createdId,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.parentCommentId).toBe(createdId);
    });
  });

  describe('GET /comments - Retrieve All', () => {
    it('5. should retrieve all comments', async () => {
      const res = await request(app.getHttpServer())
        .get('/comments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('6. should retrieve comments filtered by postId', async () => {
      const res = await request(app.getHttpServer())
        .get('/comments?postId=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.every((c) => c.postId === '1')).toBe(true);
    });

    it('7. should retrieve comments filtered by authorId', async () => {
      const res = await request(app.getHttpServer())
        .get('/comments?authorId=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.every((c) => c.authorId === '1')).toBe(true);
    });
  });

  describe('GET /comments/:id - Retrieve One', () => {
    it('8. should retrieve a comment by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/comments/${createdId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdId);
      expect(res.body.data.text).toBe('This is a great post!');
    });

    it('9. should return 404 for non-existent comment', async () => {
      await request(app.getHttpServer())
        .get('/comments/999')
        .expect(404);
    });
  });

  describe('PUT /comments/:id - Update', () => {
    it('10. should update an existing comment', async () => {
      const res = await request(app.getHttpServer())
        .put(`/comments/${createdId}`)
        .send({
          text: 'Updated comment text',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toBe('Updated comment text');
      expect(res.body.data.id).toBe(createdId);
    });

    it('11. should fail if invalid field type on update', async () => {
      const res = await request(app.getHttpServer())
        .put(`/comments/${createdId}`)
        .send({
          text: 12345, // Invalid: should be string
        })
        .expect(400);

      expect(res.body.message).toContain('text');
    });

    it('12. should return 404 when updating non-existent comment', async () => {
      await request(app.getHttpServer())
        .put('/comments/999')
        .send({
          text: 'Updated text',
        })
        .expect(404);
    });
  });

  describe('DELETE /comments/:id - Remove', () => {
    it('13. should delete a comment', async () => {
      // Create a new comment to delete
      const createRes = await request(app.getHttpServer())
        .post('/comments')
        .send({
          text: 'To be deleted',
          postId: '1',
          authorId: '1',
        });

      const idToDelete = createRes.body.data.id;

      const res = await request(app.getHttpServer())
        .delete(`/comments/${idToDelete}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });

    it('14. should return 404 on subsequent GET after deletion', async () => {
      // Create then delete a comment
      const createRes = await request(app.getHttpServer())
        .post('/comments')
        .send({
          text: 'Temp comment',
          postId: '1',
          authorId: '1',
        });

      const idToDelete = createRes.body.data.id;

      await request(app.getHttpServer())
        .delete(`/comments/${idToDelete}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/comments/${idToDelete}`)
        .expect(404);
    });

    it('15. should return 404 when deleting non-existent comment', async () => {
      await request(app.getHttpServer())
        .delete('/comments/999')
        .expect(404);
    });
  });
});
