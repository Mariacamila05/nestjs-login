import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>,
    ) { }

    async create(createNoteDto: CreateNoteDto, created_by: string) {
        try {
            const { title, description } = createNoteDto;

            const note = this.noteRepository.create({
                title,
                description,
                created_by,
            });

            await this.noteRepository.save(note);

            return note;
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }

    async findAll(created_by: string) {
        try {
            const notes = await this.noteRepository.find({
                where: { isActive: true, created_by },
            });

            return notes;
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }

    async findOne(id: string) {
        try {
            const note = await this.noteRepository.findOne({
                where: { id, isActive: true },
            });

            return note;
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }

    async update(id: string, updateNoteDto: CreateNoteDto) {
        try {
            const { title, description } = updateNoteDto;

            const note = await this.noteRepository.findOne({
                where: { id, isActive: true },
            });

            note.title = title;
            note.description = description;

            await this.noteRepository.save(note);

            return note;
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }


    async remove(id: string) {
        try {
            const note = await this.noteRepository.findOne({
                where: { id, isActive: true },
            });

            note.isActive = false;
            note.deleted_at = new Date();

            await this.noteRepository.save(note);

            return {
                message: 'Note deleted successfully',
            }
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }

    private handleDbErrors(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        console.log(error);

        throw new InternalServerErrorException('Please check server logs');
    }
}
