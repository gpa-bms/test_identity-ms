import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientProxyBMS } from 'src/common/proxy/proxy.client';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { Observable } from 'rxjs';
import { IdentityMSG } from 'src/common/constants/constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Microservicio usuarios')
@Controller('api/user')
export class UserController {

    private clientProxyIdentity;
    constructor(private readonly clientProxyBMS: ClientProxyBMS) {
        this.clientProxyIdentity = clientProxyBMS.clientProxyIdentity();
    }

    @Post('/create')
    @ApiOperation({ summary: 'Crear usuario' })
    create(@Body() userDTO: UserDTO): Promise<IUser> {
        return this.clientProxyIdentity.send(IdentityMSG.CREATE, userDTO);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(['read'])
    @Get('/find/all')
    @ApiOperation({ summary: 'buscar usuarios' })
    findAll(): Promise<IUser> {
        console.log("Intentando obtener todos los usuarios");
        return this.clientProxyIdentity.send(IdentityMSG.FIND_ALL, '');
    }

}
