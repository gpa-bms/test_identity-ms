import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDTO } from './dto/user.dto';
import { UserMSG } from 'src/common/constants/constants';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @MessagePattern(UserMSG.CREATE)
    async create(@Payload() userDTO: UserDTO) {

        const user = await this.userService.create(userDTO);
        return user;
    }

    @MessagePattern(UserMSG.FIND_ALL)
    async findAll() {

        const user = await this.userService.findAll();
        return user;
    }


}
