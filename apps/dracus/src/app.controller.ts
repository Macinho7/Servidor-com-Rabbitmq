/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Throttle } from '@nestjs/throttler';
import { atualizaUsuarioDTO } from 'apps/auth/src/DTO/atualizaUsuarioDTO';
import { AutenticaDTO } from 'apps/auth/src/DTO/autenticaUsuarioDTO';
import { CriaUsuarioDTO } from 'apps/auth/src/DTO/criaUsuarioDTO';
import { AuthGuard } from 'apps/auth/src/Jwt/guard/guardaToken';
import { atualizacaoOpniaoDTO } from 'apps/auth/src/opniao/dto/atualizarOpniaoDTO';
import { criarOpniaoDTO } from 'apps/auth/src/opniao/dto/criarOpniaoDTO';



@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private readonly authServico: ClientProxy) {}

  @Throttle({ default: { limit: 10, ttl: 20000}})
  @Get('usuarios')
  async listarUsuarios(){
    return this.authServico.send(
      {
        cmd: 'get-usuarios'
      },
      {}
    )
  }
  @Throttle({ default: { limit: 10, ttl: 20000}})
  @Get('usuario/:id')
  async listarUsuario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-usuario'
      },
      id
    )
  }

  @Throttle({ default: { limit: 5, ttl: 60000}})
  @Post('usuario')
  async criarUmUsuarios(
    @Body() dados: CriaUsuarioDTO ){
    return this.authServico.send(
      {
        cmd: 'post-usuarios'
      },
      dados
    )
  }
  @Throttle({ default: { limit: 3, ttl: 50000}})
  @Put('usuario/:id')
  async atualizaUsuario(@Param('id') id: string, @Body() data: atualizaUsuarioDTO){
    return this.authServico.send(
      {
        cmd: 'atualizar-usuario'
      }, {id, ...data}
    )
  }
  @UseGuards(AuthGuard)
  @Delete('usuario/:id')
  async deletarUsuario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'delete-usuario'
      }, id
    )
  }
  
  @Throttle({ default: { limit: 10, ttl: 20000}})
  @Get('opnioes')
  async listarOpnioes(){
    return this.authServico.send(
      {
        cmd: 'get-opnioes'
      },
      {}
    )
  }
  @Throttle({ default: { limit: 10, ttl: 20000}})
  @Get('opniao/:id')
  async listarOpniao(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'get-opniao'
      },
      id
    )
  }
  @Throttle({ default: { limit: 5, ttl: 60000}})
  @UseGuards(AuthGuard)
  @Post('/:id')
  async postarOpniaoUsuario(@Param('id') id: string, @Body() dados: criarOpniaoDTO){
    return this.authServico.send(
      {
        cmd: 'post-opnioes'
      }, {id, ...dados}
    )
  }
  @Throttle({ default: { limit: 3, ttl: 50000}})
  @Put('opniao/:id')
  async atualizarOpniao(@Param('id') id: string, @Body() dados: atualizacaoOpniaoDTO){
    return this.authServico.send(
      {
        cmd: 'put-opnioes'
      }, {id, ...dados}
    )
  }

  @Delete('opniao/:id')
  async deletarOpniaoUsuario(@Param('id') id: string){
    return this.authServico.send(
      {
        cmd: 'del-opnioes'
      }, id
    )
  }
  
  
  @Throttle({ default: { limit: 5, ttl: 100000}})
  @Post('entrar/login')
  async verificarJWT(@Body() data: AutenticaDTO){
    return this.authServico.send(
      {
        cmd: 'login'
      }, data
    )
  }

}
