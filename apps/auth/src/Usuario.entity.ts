/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OpniaoEntidade } from './opniao/opniao.entity';
@Entity('Usuario')
export class UsuarioEntidade {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    nome: string

    @Column()
    email: string
    
    @Column()
    senha: string
    
    @Column()
    idade: number
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @OneToMany(() => OpniaoEntidade, (opniao) => opniao.usuario, {
        onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true
    })
    opniao: OpniaoEntidade[]
}
