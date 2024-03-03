/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsStrongPassword, IsUUID, MinLength } from 'class-validator'
export class CriaUsuarioDTO {
  @IsUUID()
  id: string;

  @MinLength(4, {message: 'esse campo deve ter pelo menos 4 caracteres.'})
  @IsNotEmpty()
  nome: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword({minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 2, minSymbols: 1})
  senha: string;
  @IsNotEmpty()
  idade: number;
}
