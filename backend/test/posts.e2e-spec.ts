import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatePostDto, UpdatePostDto } from '../src/posts/posts.dto';

describe('Posts Controller (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. should create a new post with valid data', async () => {
    const dto: CreatePostDto = {
      title: 'Test Post',
      content: 'This is a test',
      mainImage: 'https://example.com/img.png',
    };
    const res = await request(app.getHttpServer())
      .post('/posts')
      .send(dto)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    createdId = res.body.data.id;
  });

  it('2. should return validation error when required fields missing', async () => {
    const dto: Partial<CreatePostDto> = {
      content: 'no title',
      mainImage: 'https://example.com/img.png',
    };
    const res = await request(app.getHttpServer())
      .post('/posts')
      .send(dto)
      .expect(400);

    expect(res.body.message).toContain('title');
  });

  it('3. should update an existing post with valid data', async () => {
    const dto: UpdatePostDto = { title: 'Updated Title' };
    const res = await request(app.getHttpServer())
      .put(`/posts/${createdId}`)
      .send(dto)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('4. should fail validation when updating with invalid data', async () => {
    const dto: any = { content: 123 }; // invalid type
    const res = await request(app.getHttpServer())
      .put(`/posts/${createdId}`)
      .send(dto)
      .expect(400);

    expect(res.body.message).toContain('content');
  });

  it('6. should retrieve content by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts/${createdId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  it('5. should delete the content', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/posts/${createdId}`)
      .expect(200);

    expect(res.body.success).toBe(true);

    // verify gone
    await request(app.getHttpServer())
      .get(`/posts/${createdId}`)
      .expect(404);
  });
});
