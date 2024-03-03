/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpniaoEntidade } from './opniao.entity';
import { Repository } from 'typeorm';
import { UsuarioEntidade } from '../Usuario.entity';
import { criarOpniaoDTO } from './dto/criarOpniaoDTO';
import { atualizacaoOpniaoDTO } from './dto/atualizarOpniaoDTO';
import { randomUUID } from 'crypto';
import { verificarFraseProibida } from '../arrayF/arrayDasPalavras';

@Injectable()
export class OpniaoService {
 constructor(
    @InjectRepository(OpniaoEntidade)
    private readonly opniaoRepository: Repository<OpniaoEntidade>,
    @InjectRepository(UsuarioEntidade)
    private readonly usuarioRepository: Repository<UsuarioEntidade>
 ){}

 private async verificarOpniaoExistente(id: string){
    const usuario = await this.usuarioRepository.findOneBy({id})
    if(usuario.opniao && usuario.opniao.length > 0){
        throw new ConflictException("Esse usuario ja possui uma opniao")
    }
    return usuario

 }
 async criarUmaOpniao(dados: criarOpniaoDTO): Promise<OpniaoEntidade>{
    const { id, opniao, nota, recomendaria, melhorar } = dados
    const usuario = await this.usuarioRepository.findOneBy({id})
    await verificarFraseProibida(opniao)
    await verificarFraseProibida(melhorar)
    if(usuario === null){
        throw new NotFoundException(`ìd de usuario: ${id} nao existe`)
    }
    const verificado = this.verificarOpniaoExistente(usuario.id)
    if(!verificado){
        throw new ConflictException(`Usuario: ${usuario.id} ja possui uma opniao`)
    }
    
    if(nota < 0){
        throw new BadRequestException(`Nota: ${nota} nao pode ser um numero negativo`)
    
    }
    
    if(nota > 10){
        throw new BadRequestException(`Nota: ${nota}. nao pode conter numero maior que nota maxima 10!`)
    }
    const opniaoEntidade = new OpniaoEntidade()
    opniaoEntidade.id = id
    opniaoEntidade.opniao = opniao
    opniaoEntidade.nota = nota
    opniaoEntidade.recomendaria = recomendaria
    opniaoEntidade.melhorar = melhorar
    opniaoEntidade.usuario = usuario
    const id2 = randomUUID()
    opniaoEntidade.id = id2
    return await this.opniaoRepository.save(opniaoEntidade)

 }
 async listarOpnioes(){
    return await this.opniaoRepository.find()
 }
 async listarUmaOpniao(id: string){
    const opniao = await this.opniaoRepository.findOneBy({id})
    if(opniao === null){
        throw new NotFoundException(`o id: ${id} nao achado`)
    }
    return {
        Opniao: opniao
    }
 }

 async deletar(id: string){
    const del = await this.opniaoRepository.findOneBy({id})
    if(del === null){
        throw new NotFoundException(`ìd: ${id} nao achado`)
    }
    const delComplete = await this.opniaoRepository.remove(del)
    return {
        Message: `Esse id: ${id} foi deletado`,
        Opniao_Deletada: delComplete
    }
 }

 async atualizarOpniao(dados: atualizacaoOpniaoDTO){
    const { id, opniao, nota, recomendaria, melhorar} = dados
    const Opniao = await this.opniaoRepository.findOne({where: {id}})
    await verificarFraseProibida(opniao)
    await verificarFraseProibida(melhorar)
    if(Opniao === null){
        throw new NotFoundException("Opniao inexistente")
    }

    if(nota < 0){
        throw new BadRequestException(`Nota: ${nota} nao pode conter numeros negativos`)
    
    }
    
    if(nota > 10){
        throw new BadRequestException(`Nota: ${nota} nao pode conter numero maior que nota maxima 10!`)
    }

    const usuario = await this.opniaoRepository.save({id, opniao, nota, recomendaria, melhorar})
    return {
        Message: `O id: ${id} foi atualizado`,
        Nova_Opniao: usuario
    }
 }
}