/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from 'class-validator';
import { recomendSorN } from '../../arrayF/enum/Enum';

/* eslint-disable prettier/prettier */
export class criarOpniaoDTO {
    @IsUUID()
    id: string
    
    @IsNotEmpty({message: 'Campo opniao nao pode estar vazio'})
    opniao: string

    @IsNotEmpty({message: 'Campo nota nao pode estar vazio'})
    nota: number

    @IsNotEmpty({message: 'Campo recomendaria nao pode estar vazio'})
    recomendaria: recomendSorN

    @IsNotEmpty({message: 'Campo melhorar nao pode estar vazio'})
    melhorar: string
}
