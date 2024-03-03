/* eslint-disable prettier/prettier */

import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsuarioEntidade } from "../Usuario.entity";
import { recomendSorN } from "../arrayF/enum/Enum";

@Entity('opniao')
export class OpniaoEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({name: 'opniao', nullable: false})
    opniao: string

    @Column({name: 'nota', nullable: false})
    nota: number

    @Column({name: 'recomendaria', nullable: false, type: "enum", enum: recomendSorN})
    recomendaria: recomendSorN 

    @Column({name: 'melhorar', nullable: false})
    melhorar: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @ManyToOne(() => UsuarioEntidade, (usuario) => usuario.opniao, {
        cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'
    })
    usuario: UsuarioEntidade

}
