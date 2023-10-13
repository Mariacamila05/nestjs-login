import { IsString, MaxLength, MinLength } from 'class-validator';


export class CreateNoteDto {

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    title: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    description: string;

}