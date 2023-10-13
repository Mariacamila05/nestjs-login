import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notes')
export class Note {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('text')
    created_by: string;
    
    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column('timestamp', { nullable: true })
    deleted_at: Date;
    
}