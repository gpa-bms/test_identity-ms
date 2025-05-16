import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, Post, Res, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxyBMS } from 'src/common/proxy/proxy.client';
import { LoginDTO } from './dto/login.dto';
import { IdentityMSG } from 'src/common/constants/constants';
import { RegisterDTO } from './dto/register.dto';

import { IUser } from 'src/common/interfaces/user.interface';
import { IToken } from 'src/common/interfaces/token.interface';

@ApiTags('Autentificación (auth)')
@Controller('auth')
export class AuthController {

    private clientProxyIdentity;
    constructor(private readonly jwtService: JwtService, private readonly clientProxyBMS: ClientProxyBMS) {
        this.clientProxyIdentity = clientProxyBMS.clientProxyIdentity();
    }

    // Login
    @Post('login')
    async login(@Body() loginDTO: LoginDTO): Promise<{ token: string; user?: Partial<IToken> }> {
        console.log("ctrl - Intentando autenticar usuario:", loginDTO);

        try {
            const user = await this.clientProxyIdentity.send(IdentityMSG.VALID_USER, loginDTO).toPromise();

            if (!user) {
                console.warn("ctrl - Usuario no encontrado o contraseña incorrecta");
                throw new UnprocessableEntityException({
                    message: 'No existe el usuario especificado o la contraseña es incorrecta.',
                    errorCode: 'INVALID_CREDENTIALS',
                    timestamp: new Date().toISOString(),
                    providedEmail: loginDTO.email
                });
            }

            console.log("ctrl - Usuario autenticado:", user);

            // Construcción del payload antes de generar el token
            const payload = {
                id: user.id ?? 0,
                email: user.email ?? '',
                role: user.role ?? 'user',
                permissions: user.permission_name
            };

            console.log("ctrl - Token generado con:", payload);

            return {
                token: await this.jwtService.sign(payload),
            };
        } catch (error) {
            console.error("ctrl - Error en proceso de login:", error);

            throw new InternalServerErrorException({
                message: 'Error interno durante la autenticación.',
                errorCode: 'AUTH_PROCESS_FAILED',
                timestamp: new Date().toISOString(),
                details: error.response || error.message
            });
        }
    }



    // Register
    @Post('register')
    async register(@Body() registerDTO: RegisterDTO): Promise<IUser> {
        console.log("ctrl - registrando usuario: ", registerDTO);
        const user = await this.clientProxyIdentity.send(IdentityMSG.CREATE, registerDTO).toPromise();
        if (user) {
            console.log("ctrl - usuario registrado ", user);
            return user;
        } else {
            throw new UnprocessableEntityException('Ya existe un usuario con ese correo electrónico');
        }
    }

}
