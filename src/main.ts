import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: false,
    bodyParser: true
  });

  app.use(session({
    secret: 'test123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  await app.listen(3000);
}
bootstrap();
