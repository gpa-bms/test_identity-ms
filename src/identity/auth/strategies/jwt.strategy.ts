import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    // si token es valido entonces aplicamos esta función (se asigna automaticamente a req.user)
    async validate(payload: any) {
        return await {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions
        }
    }

}

