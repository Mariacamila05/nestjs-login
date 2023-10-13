import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces';
import { RevokedToken } from './entities';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RevokedToken)
        private readonly revokedTokenRepository: Repository<RevokedToken>,
        private readonly jwtService: JwtService,
    ) { }

    private userToken: string;

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepository.save(user);
            delete user.password;

            const token = this.getJwtToken({ id: user.id });

            this.userToken = token;

            return {
                token,
                ...user,
            };
        } catch (error: any) {
            this.handleDbErrors(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true, fullName: true, roles: true },
        });

        if (!user || !bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException('Invalid credentials');

        const token = this.getJwtToken({ id: user.id });

        this.userToken = token;

        return {
            token,
            ...user,
        };
    }

    async logout(token: string) {
        const revokedToken = await this.revokedTokenRepository.save({ token });
        await this.revokedTokenRepository.save(revokedToken);

        return {
            message: 'Logout successful',
        };
    }

    async checkAuthStatus(user: User) {
        const isTokenBlacklisted = await this.isTokenBlacklisted(this.userToken);

        if (isTokenBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        return {
            ...user,
            token: this.getJwtToken({ id: user.id }),
        };
    }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);

        return token;
    }

    private async isTokenBlacklisted(token: string): Promise<boolean> {
        const revokedToken = await this.revokedTokenRepository.findOne({
            where: { token },
        });
        return !!revokedToken;
    }

    private handleDbErrors(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        console.log(error);

        throw new InternalServerErrorException('Please check server logs');
    }
}
