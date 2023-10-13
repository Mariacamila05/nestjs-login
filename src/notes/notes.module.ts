import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Note]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

  ],
})
export class NotesModule { }
