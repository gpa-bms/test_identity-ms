import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User)
    private userRepository: Repository<User>) {
    }

    async create(userDTO: UserDTO): Promise<IUser> {
        const user = this.userRepository.create(userDTO);
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<IUser[]> {
        const users = this.userRepository.find();
        return users;
    }
}
