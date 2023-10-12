import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async create(createUserDto: CreateUserDto){
        try {
            const {password, ...userData} = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password
            });

            await this.userRepository.save(user)
            delete user.password;

            return {
                ...user
            }

        } catch (error: any) {
            console.log(error);
        }
    }
}
