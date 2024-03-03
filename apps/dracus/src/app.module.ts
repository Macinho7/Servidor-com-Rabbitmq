/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule, rmqModule } from '@app/lib';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    rmqModule.registrarRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    ThrottlerModule.forRoot([
      {
        
        ttl: 30000,
        limit: 5,
      },   
    ]),
    RedisModule,
    AuthModule

  ],
  controllers: [AppController],
  providers: [{provide: APP_GUARD, useClass: ThrottlerGuard}, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
