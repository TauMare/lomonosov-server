import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    public login: string;

    @Column()
    public password: string;
}