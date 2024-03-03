/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { LivrariaService } from '@app/lib';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  const livrariaS = app.get(LivrariaService)
  const configService = app.get(ConfigService)

  const queue = configService.get('RABBITMQ_AUTH_QUEUE')

  app.connectMicroservice(livrariaS.getRmqOptions(queue))
  app.startAllMicroservices()
}
bootstrap();
