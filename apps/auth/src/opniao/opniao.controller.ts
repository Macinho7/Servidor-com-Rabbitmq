/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OpniaoService } from './opniao.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { criarOpniaoDTO } from './dto/criarOpniaoDTO';
import { CriaUsuarioDTO } from '../DTO/criaUsuarioDTO';

@Controller()
export class OpniaoController {
  constructor(private readonly opniaoService: OpniaoService) {}

  @MessagePattern({ cmd: "get-opnioes"})
  async listarOpnioes(@Ctx() contexto: RmqContext){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.opniaoService.listarOpnioes()
  }
  @MessagePattern({ cmd: "get-opniao"})
  async listarOpniao(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.opniaoService.listarUmaOpniao(id)
  }

  @MessagePattern({ cmd: "post-opnioes"})
  async criarOpniaoUsuario(@Ctx() contexto: RmqContext, @Payload() dados: criarOpniaoDTO ){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.opniaoService.criarUmaOpniao(dados)
  }

  @MessagePattern({ cmd: "put-opnioes"})
  async atualizarOpniaoUsuario(@Ctx() contexto: RmqContext, @Payload() dados: CriaUsuarioDTO){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.opniaoService.atualizarOpniao(dados)
  }
  @MessagePattern({ cmd: "del-opnioes"})
  async deletarOpniaoUsuario(@Ctx() contexto: RmqContext, @Payload() id: string){
    const channel = contexto.getChannelRef()
    const message = contexto.getMessage()
    channel.ack(message)
    return await this.opniaoService.deletar(id)
  }
 
}
