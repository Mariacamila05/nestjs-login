import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('RevokedTokens')
export class RevokedToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    token: string;
}