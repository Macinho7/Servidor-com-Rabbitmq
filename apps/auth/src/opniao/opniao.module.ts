/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { OpniaoService } from './opniao.service';
import { OpniaoController } from './opniao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpniaoEntidade } from './opniao.entity';
import { UsuarioEntidade } from '../Usuario.entity';
import { AuthModule } from '../auth.module';
import { PostgresModule, rmqModule } from '@app/lib';

@Module({
  imports:[
    rmqModule,
    PostgresModule,
    TypeOrmModule.forFeature([
      OpniaoEntidade, UsuarioEntidade
    ]), forwardRef(() => AuthModule)
  ],
  controllers: [OpniaoController],
  providers: [OpniaoService, OpniaoEntidade
  ],
  exports: [OpniaoEntidade]
})
export class OpniaoModule {}
