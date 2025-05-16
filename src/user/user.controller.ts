import { Controller, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDTO } from './dto/user.dto';
import { IdentityMSG } from 'src/common/constants/constants';
import { IUser } from 'src/common/interfaces/user.interface';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { IUserPermissions } from 'src/common/interfaces/userPermission.interface';


@Controller('')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @MessagePattern(IdentityMSG.CREATE)
    async create(@Payload() registerDTO: RegisterDTO): Promise<IUser> {
        console.log("ctrl - creando usuario ", registerDTO);
        const user = await this.userService.create(registerDTO);
        return user;
    }

    @MessagePattern(IdentityMSG.FIND_ALL)
    async findAll() {
        console.log("c revisando todos")
        const user = await this.userService.findAll();
        return user;
    }

    @MessagePattern(IdentityMSG.VALID_USER)
    async validateUser(@Payload() loginDTO: LoginDTO): Promise<IUserPermissions | null> {
        console.log("ctrl - Buscando usuario por correo");

        try {
            const user = await this.userService.findOneByEmailWithPermissionsSQL(loginDTO.email);

            if (!user) {
                console.log("ctrl - Usuario no encontrado");
                return null;
            }

            const isValidPassword = await this.userService.checkPassword(loginDTO.password, user.user_password);

            if (!isValidPassword) {
                console.log("ctrl - Contraseña inválida");
                return null;
            }

            console.log("ctrl - Usuario validado correctamente", user);
            return user;
        } catch (error) {
            console.error("ctrl - Error en validación de usuario:", error);
            return null;
        }
    }





}
