/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Team Board API')
    .setDescription('API documentation for Team Board application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Export OpenAPI JSON
  const fs = await import('fs');
  const path = await import('path');
  const outputPath = path.join(__dirname, '../../openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger UI available at http://localhost:3000/api');
  console.log('OpenAPI spec exported to apps/backend/openapi.json');
}
bootstrap();
