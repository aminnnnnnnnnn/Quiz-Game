import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); //kann evtl wieder raua
    const config = new DocumentBuilder()
        .setTitle('QuizDuell')
        .setDescription('QuizDuell Api description')
        .setVersion('1.0')
        .addTag('Quiz')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  await app.listen(3000);

  console.log('-------------------------------------------------------------');
  console.log('                         Backend läuft                       ');
  console.log('-------------------------------------------------------------');
  console.log('       Frontend abrufen:     http://localhost:3000/          ');
  console.log('-------------------------------------------------------------');
}
bootstrap();
