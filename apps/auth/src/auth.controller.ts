/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CriaUsuarioDTO } from './DTO/criaUsuarioDTO';
import { atualizaUsuarioDTO } from './DTO/atualizaUsuarioDTO';
import { AutenticaDTO } from './DTO/autenticaUsuarioDTO';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'get-usuarios'})
  async listarUsuarios(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)

    return this.authService.listarUsuarios()
  }

  @MessagePattern({ cmd: 'post-usuarios'})
  async postarUsuarios(@Ctx() contexto: RmqContext, @Payload() dados: CriaUsuarioDTO){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return this.authService.criarUsuario(dados)
  }
  @MessagePattern({ cmd: 'delete-usuario'})
  async deletarOUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return this.authService.deletarUsuario(id)
  }
  @MessagePattern({ cmd: 'atualizar-usuario'})
  async atualizarUsuario(@Ctx() contexto: RmqContext, @Payload() dados: atualizaUsuarioDTO){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return this.authService.atualizarUsuario(dados)
  }
  @MessagePattern({ cmd: 'get-usuario'})
  async listarUmUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.authService.listarUmUsuario(id)
  }

  @MessagePattern({ cmd: 'login' })
  async loginUsuario(@Ctx() contexto: RmqContext, @Payload() dados: AutenticaDTO){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.authService.login(dados)
  }
  @MessagePattern({ cmd: 'verificar-token' })
  async verificadorDeToken(@Ctx() contexto: RmqContext, @Payload() payload: { jwt: string}, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    const { jwt } = payload
    return await this.authService.verifyToken(jwt, id)
  }

}
