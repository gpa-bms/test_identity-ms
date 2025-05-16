import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// autoamticamente usamos la estrategia del jwt al extenderla
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}