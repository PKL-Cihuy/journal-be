import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { GlobalExceptionFilter } from '@/filter/globalException.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, whitelist: true }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept,Authorization',
  });
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('PKL Journaling System API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: "Input JWT Token (without 'Bearer' prefix)",
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  if (process.env.ENVIRONMENT == 'dev') {
    app.setGlobalPrefix('/v1');
  }
  const pathKeys = Object.keys(swaggerDocument.paths);
  const pathValues = Object.values(swaggerDocument.paths);
  const newPathKeys = pathKeys.map((path) => `/v1${path}`);

  const newPaths: { [key: string]: any } = {};
  for (const [index, path] of newPathKeys.entries()) {
    newPaths[path] = pathValues[index];
  }

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
