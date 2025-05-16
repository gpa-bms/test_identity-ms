import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder().setTitle('API').build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
