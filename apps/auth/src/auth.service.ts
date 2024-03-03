/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuarioEntidade } from './Usuario.entity';
import { Repository } from 'typeorm';
import { CriaUsuarioDTO } from './DTO/criaUsuarioDTO';
import "reflect-metadata";
import * as bcrypt from 'bcrypt'
import { atualizaUsuarioDTO } from './DTO/atualizaUsuarioDTO';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { verificarFraseProibida } from './arrayF/arrayDasPalavras';
import { AutenticaDTO } from './DTO/autenticaUsuarioDTO';
import { listarUsuarioFiltroDTO } from './DTO/listarUsuariosDTO';

export interface payload {
  id: string
  nome: string
  email: string
  senha: string
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntidade)
    private readonly usuarioRepository: Repository<UsuarioEntidade>,
    private readonly jwtService: JwtService,
    
  ){}
  async acharEmail(email: string){
    return await this.usuarioRepository.findOne({where: {email}})
    
  }
  async validarEmailPropio(email: string, id: string){
    const usuario = await this.usuarioRepository.findOneBy({id})
    if(usuario.email === email){
      return email
    } else {
      const emailVerificado = await this.acharEmail(email)
      if(emailVerificado){
        throw new ConflictException(`Email: ${email} ja existente`)
      }
      return email
    }
  }
  async acharNome(nome: string){
    return await this.usuarioRepository.findOne({where: {nome}})
    
  }
  async hashearSenha(senha: string){
    const sal = await bcrypt.genSalt(10)
    const hash =  await bcrypt.hash(senha, sal)
    return hash
  }
  async compararSenha(senha: string, senha2: string){
    return await bcrypt.compare(senha, senha2)
  }
  
  async criarUsuario(dados: CriaUsuarioDTO): Promise<UsuarioEntidade>{
    const {id, nome, email, senha, idade } = dados
    await verificarFraseProibida(nome)
    await verificarFraseProibida(email)
    await verificarFraseProibida(senha)
 
    const achado = await this.acharEmail(email)
    if(achado){
      throw new ConflictException(`um ùsuario ja possui esse email: ${email}`)
    }
    const usuario = await this.acharNome(nome)
    if(usuario){
      throw new ConflictException(`um usuario ja possui esse nome: ${nome}`)
    }
    const senhaHasheada = await this.hashearSenha(senha)
    if(idade < 18){
      throw new UnauthorizedException(`Sr ${nome} voce deve ter a idade minima: Idade Minima: 18`)
    }
    if(idade > 150){
      throw new UnauthorizedException(`idade"${idade} e muito velho`)
    }
    
    const usuarioSalvar = await this.usuarioRepository.save({
      id, nome, email, senha: senhaHasheada, idade
    })
    return usuarioSalvar
  }

  async listarUsuarios(){
    const usuarios =  await this.usuarioRepository.find()
    const usuariosFiltro = usuarios.map((filtro) => new listarUsuarioFiltroDTO(filtro.id, filtro.nome, filtro.email, filtro.idade, filtro.opniao))

    return usuariosFiltro
  }

  async deletarUsuario(id: string){
    const usuario = await this.usuarioRepository.findOneBy({id})
    if(usuario === null){
      throw new NotFoundException('úsuario com id nao achado')
    }
    const valor1 = Object.values(usuario)[0]
    const valor2 = Object.values(usuario)[1]
    const valor3 = Object.values(usuario)[2]
    const valor4 = Object.values(usuario)[4]
    
    await this.usuarioRepository.remove(usuario)
    return {
      Message: `o id: ${id} foi deletado`,
      Usuario_Deletado: `Usuario do id: ${[valor1]}, nome: ${[valor2]} , email: ${[valor3]},  idade: ${[valor4]},  deletado!`
    }
  }
  async listarUmUsuario(id: string){
    const usuario = await this.usuarioRepository.findOneBy({id})
    
    if(usuario === null){
      throw new NotFoundException('úsuario com id nao achado')
    }
    return {
      Usuario: usuario
    }
  }
  async atualizarUsuario(dados: atualizaUsuarioDTO){
    const {id, nome, email, senha, idade} = dados
    const usuarioachar  = await this.usuarioRepository.findOneBy({id})
    if(usuarioachar === null){
      throw new NotFoundException('úsuario com id nao achado')
    }
    await verificarFraseProibida(nome)
    await verificarFraseProibida(email)
    await verificarFraseProibida(senha)
    await this.validarEmailPropio(email, usuarioachar.id)
    
    const senhaHasheada = await this.hashearSenha(senha)
  
    if(idade < 18){
      throw new UnauthorizedException(`Sr ${nome} voce deve ter a idade minima. Idade Minima: 18`)
    }
    if(idade > 100){
      throw new UnauthorizedException(`idade"${idade} e muito velho`)
    }
    
    const usuario = await this.usuarioRepository.save({id, nome, email, senha: senhaHasheada, idade })
  
    return {
      Message: ` o id: ${id} foi atualizado`,
      Novo_Usuario: usuario
    }
  }

 
  async login({email, senha}: AutenticaDTO){
    const usuario = await this.usuarioRepository.findOne({where: {email}})
    if(usuario === null){
      throw new NotFoundException(`Esse usuario do email: ${email} nao existe`)
    }
        
    const vericarSenha = await bcrypt.compare(senha, usuario.senha)
    if(!vericarSenha){
      throw new UnauthorizedException(`senha: ${senha} errada!`)
    }
    const payload: payload = {
      id: usuario.id,
      nome: usuario.nome,
      email:  usuario.email ,
      senha: usuario.senha
    }
    
    const jwtToken =  await this.jwtService.signAsync(payload)
    return { Token_Usuario: jwtToken}
  }

  async verifyToken(jwt: string, usuarioParam: string): Promise<{ usuario: payload, exp: number}>{
    if(!jwt){
      throw new UnauthorizedException("token nao existe")
    }
    const id = Object.values(usuarioParam)[1]
    
    const usuarioVerificado = await this.usuarioRepository.findOneBy({id})
    
    const DED = await this.jwtService.decode(jwt)
    if(usuarioVerificado.nome !== DED.nome && usuarioVerificado.email !== DED.email){
      throw new UnauthorizedException(`Usuario requirente: ${usuarioVerificado.nome} com email: ${usuarioVerificado.email}, Token usado pertence a outro usuario de nome e email diferente, crie o seu propio em Entrar/login!`)
    } 
    
    try{
      const {usuario, exp } = await this.jwtService.verifyAsync(jwt)
      return { usuario, exp}
      
    } catch(error){
      
      throw new UnauthorizedException("token invalido")
    }
  }

}
