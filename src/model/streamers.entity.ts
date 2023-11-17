import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('streamers')
export class Streamer{
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    public login: string;

    @Column()
    public streamKey: string;
}