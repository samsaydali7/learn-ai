import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authors - E2E Tests', () => {
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

  describe('POST /authors - Create', () => {
    it('1. should create a new author with valid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          bio: 'A passionate writer',
          profileImage: 'https://example.com/profile.jpg',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.firstName).toBe('John');
      expect(res.body.data.lastName).toBe('Doe');
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data).toHaveProperty('createdAt');
      createdId = res.body.data.id;
    });

    it('2. should fail if required "firstName" field is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/authors')
        .send({
          lastName: 'Doe',
          email: 'test@example.com',
        })
        .expect(400);

      expect(res.body.message).toContain('firstName');
    });

    it('3. should fail if required "email" field is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
        })
        .expect(400);

      expect(res.body.message).toContain('email');
    });

    it('4. should fail if email is in invalid format', async () => {
      const res = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'not-an-email',
        })
        .expect(400);

      expect(res.body.message).toContain('email');
    });

    it('5. should create author with optional fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'Bob',
          lastName: 'Builder',
          email: 'bob@example.com',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.bio).toBeUndefined();
    });
  });

  describe('GET /authors - Retrieve All', () => {
    it('6. should retrieve all authors', async () => {
      const res = await request(app.getHttpServer())
        .get('/authors')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('7. should retrieve authors filtered by email', async () => {
      const res = await request(app.getHttpServer())
        .get('/authors?email=john@example.com')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0].email).toBe('john@example.com');
      }
    });
  });

  describe('GET /authors/:id - Retrieve One', () => {
    it('8. should retrieve an author by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/authors/${createdId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdId);
      expect(res.body.data.firstName).toBe('John');
    });

    it('9. should return 404 for non-existent author', async () => {
      await request(app.getHttpServer())
        .get('/authors/999')
        .expect(404);
    });
  });

  describe('PUT /authors/:id - Update', () => {
    it('10. should update an existing author', async () => {
      const res = await request(app.getHttpServer())
        .put(`/authors/${createdId}`)
        .send({
          firstName: 'Jonathan',
          bio: 'Updated bio',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Jonathan');
      expect(res.body.data.bio).toBe('Updated bio');
      expect(res.body.data.lastName).toBe('Doe');
    });

    it('11. should fail if invalid email format on update', async () => {
      const res = await request(app.getHttpServer())
        .put(`/authors/${createdId}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);

      expect(res.body.message).toContain('email');
    });

    it('12. should fail if invalid field type on update', async () => {
      const res = await request(app.getHttpServer())
        .put(`/authors/${createdId}`)
        .send({
          firstName: 12345, // Invalid: should be string
        })
        .expect(400);

      expect(res.body.message).toContain('firstName');
    });

    it('13. should return 404 when updating non-existent author', async () => {
      await request(app.getHttpServer())
        .put('/authors/999')
        .send({
          firstName: 'Updated',
        })
        .expect(404);
    });
  });

  describe('DELETE /authors/:id - Remove', () => {
    it('14. should delete an author', async () => {
      // Create a new author to delete
      const createRes = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'Delete',
          lastName: 'Me',
          email: 'deleteme@example.com',
        });

      const idToDelete = createRes.body.data.id;

      const res = await request(app.getHttpServer())
        .delete(`/authors/${idToDelete}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });

    it('15. should return 404 on subsequent GET after deletion', async () => {
      // Create then delete an author
      const createRes = await request(app.getHttpServer())
        .post('/authors')
        .send({
          firstName: 'Temp',
          lastName: 'Author',
          email: 'temp@example.com',
        });

      const idToDelete = createRes.body.data.id;

      await request(app.getHttpServer())
        .delete(`/authors/${idToDelete}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/authors/${idToDelete}`)
        .expect(404);
    });

    it('16. should return 404 when deleting non-existent author', async () => {
      await request(app.getHttpServer())
        .delete('/authors/999')
        .expect(404);
    });
  });
});
