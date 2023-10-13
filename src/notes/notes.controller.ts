import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { CreateNoteDto } from './dto';

@Controller('notes')
export class NotesController {

    constructor(
        private readonly notesService: NotesService,
    ) { }

    @Get('/')
    @Auth()
    findAll(@GetUser() user: User) {
        return this.notesService.findAll(user.id);
    }

    @Get(':id')
    @Auth()
    findOne(@Param('id') id: string) {
        return this.notesService.findOne(id);
    }

    @Post('/')
    @Auth()
    create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: User) {
        return this.notesService.create(createNoteDto, user.id);
    }

    @Patch(':id')
    @Auth()
    update(@Param('id') id: string, @Body() updateNoteDto: CreateNoteDto) {
        return this.notesService.update(id, updateNoteDto);
    }

    @Delete(':id')
    @Auth()
    remove(@Param('id') id: string) {
        return this.notesService.remove(id);
    }
}
