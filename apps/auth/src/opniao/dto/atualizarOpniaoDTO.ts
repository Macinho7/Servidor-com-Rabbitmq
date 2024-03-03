/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { criarOpniaoDTO } from './criarOpniaoDTO';

export class atualizacaoOpniaoDTO extends PartialType(criarOpniaoDTO) {}
