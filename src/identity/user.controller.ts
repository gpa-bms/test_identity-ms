import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientProxyBMS } from 'src/common/proxy/proxy.client';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { Observable } from 'rxjs';
import { UserMSG } from 'src/common/constants/constants';

@ApiTags('Microservicio usuarios')
@Controller('api/user')
export class UserController {

    private clientProxyUser;
    constructor(private readonly clientProxyBMS: ClientProxyBMS) {
        this.clientProxyUser = clientProxyBMS.clientProxyUser();
    }

    @Post('/create')
    @ApiOperation({ summary: 'Crear usuario' })
    create(@Body() userDTO: UserDTO): Observable<IUser> {
        return this.clientProxyUser.send(UserMSG.CREATE, userDTO);
    }

    @Get('/find/all')
    @ApiOperation({ summary: 'buscar usuarios' })
    findAll(): Observable<IUser> {
        console.log("Intentando obtener todos los usuarios");
        return this.clientProxyUser.send(UserMSG.FIND_ALL, '');
    }


}
