/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CriaUsuarioDTO } from './criaUsuarioDTO';

export class atualizaUsuarioDTO extends PartialType(CriaUsuarioDTO) {}
