import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Ecommerce API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api", {
    exclude: ["auth/google/callback", "auth/github/callback"]
  });
  app.enableCors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(morgan("dev"));

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
