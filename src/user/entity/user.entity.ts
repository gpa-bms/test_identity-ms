import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Users', schema: 'Users', synchronize: false })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nombre: string;
    @Column()
    contraseña: string;
}
