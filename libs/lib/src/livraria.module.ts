/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LivrariaService } from './livraria.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.js, .ts}'],
        //synchronize: true
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [LivrariaService],
  exports: [LivrariaService],
})
export class PostgresModule {}