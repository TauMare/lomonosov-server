import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('streams')
export class Stream{
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    public inSystemID: string;

    @Column()
    public status: string;

    @Column()
    public login: string;

    @Column()
    public streamKey: string;

    @Column({ type: 'timestamptz', nullable: true })
    public createdAt: Date;

    @Column({ type: 'timestamptz', nullable: true })
    public endedAt: Date;
}