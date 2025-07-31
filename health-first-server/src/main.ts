import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const SWAGGER_API_ROOT = 'api/docs';
  const SWAGGER_API_NAME = 'API';
  const SWAGGER_API_DESCRIPTION = 'IMH HealthCare';
  const SWAGGER_API_CURRENT_VERSION = '1.0';

  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn', 'verbose', 'fatal'],
  });

  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
  });
  app.enableShutdownHooks();

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const PORT:any= process.env.PORT;

  await app.listen(PORT,() => {
    console.log(`🚀 Server is up at: http://localhost:${PORT}/api`);
  });

}


bootstrap()


