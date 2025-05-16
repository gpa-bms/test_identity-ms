import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { IUserPermissions } from 'src/common/interfaces/userPermission.interface';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User)
    private userRepository: Repository<User>) {
    }

    async create(userDTO: UserDTO): Promise<IUser> {
        const user = this.userRepository.create({
            name: userDTO.name,
            email: userDTO.email,
            password: userDTO.password
        });

        return await this.userRepository.save(user);
    }

    async findAll(): Promise<IUser[]> {
        const users = this.userRepository.find();
        return users;
    }

    async findOneByEmail(email: string): Promise<IUser | null> {
        console.log("srv - buscando usuario por email");
        const user = await this.userRepository.findOne({
            where: { email: email }
        });
        if (!user) return null;
        return user;
    }

    async findOneByEmailWithPermissions(email: string): Promise<IUserPermissions[] | null> {
        return await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("permission_header", "ph", "ph.id_user = user.id_user")
            .leftJoinAndSelect("permission_detail", "pd", "pd.id_permission = ph.id_permission")
            .where("user.email = :email", { email })
            .select([
                "user.id_user as user_id",
                "user.name as user_name",
                "user.email as user_email",
                "pd.name as permission_name",
                "user.password as user_password"
            ])
            .getRawMany();
    }

    async findOneByEmailWithPermissionsSQL(email: string): Promise<IUserPermissions | null> {
        try {
            const userWithPermissions = await this.userRepository.query(`
                SELECT DISTINCT
                    userd.id_user AS user_id,
                    userd.name AS user_name,
                    userd.email AS user_email,
                    userd.password AS user_password,
                    pd.name AS permission_name
                FROM user_detail AS userd
                LEFT JOIN permission_header AS ph ON ph.id_user = userd.id_user
                LEFT JOIN permission_detail AS pd ON pd.id_permission = ph.id_permission
                WHERE userd.email = @0
            `, [email]);

            if (!userWithPermissions || userWithPermissions.length === 0) {
                return null;
            }
            
            const user: IUserPermissions = {
                user_password: userWithPermissions[0].user_password,
                user_id: userWithPermissions[0].user_id,
                user_email: userWithPermissions[0].user_email,
                user_role: userWithPermissions[0].permission_name,  
                permission_name: userWithPermissions.map(permission => permission.permission_name)
            };

            return user;
        } catch (error) {
            console.error("Error al obtener usuario con permisos:", error);
            return null;
        }
    }


    async checkPassword(password: string, passwordDB: string): Promise<boolean> {
        console.log("srv - comparando contraseñas", password, passwordDB);
        return password == passwordDB;
        //return await bcrypt.compare(password, passwordDB);
    }


}
