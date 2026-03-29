import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Team Board API')
    .setDescription('API documentation for Team Board application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = join(__dirname, '../openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log('✓ OpenAPI spec generated at apps/backend/openapi.json');

  await app.close();
  process.exit(0);
}

generateOpenApi();
