import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend. Supports comma-separated FRONTEND_URLS env var
  const urlsEnv = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:4200';
  const allowedOrigins = urlsEnv.split(',').map(s => s.trim()).filter(Boolean);
  console.log('Allowed CORS origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // allow non-browser requests like curl/postman with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // enable validation pipe globally
  app.useGlobalPipes(
    new (require('@nestjs/common').ValidationPipe)({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on http://localhost:${port}`);
}

bootstrap();
