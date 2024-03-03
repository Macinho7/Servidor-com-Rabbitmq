/* eslint-disable prettier/prettier */
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'
import { UsuarioEntidade } from './Usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { OpniaoEntidade } from './opniao/opniao.entity';
import { OpniaoModule } from './opniao/opniao.module';
import { PostgresModule, rmqModule } from '@app/lib';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SEGREDO'),
        signOptions: { expiresIn: '2min' },
      }),
      inject: [ConfigService],
    }),

    rmqModule,
    PostgresModule,

    TypeOrmModule.forFeature([
      UsuarioEntidade, OpniaoEntidade
    ]), forwardRef(() => OpniaoModule)

  ],
  controllers: [AuthController],
  providers: [AuthService, UsuarioEntidade],
  exports: [AuthService, UsuarioEntidade]
})
export class AuthModule {}
