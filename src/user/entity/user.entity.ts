import { Column, Entity, PrimaryGeneratedColumn, Generated } from "typeorm";

@Entity({ name: 'user_detail', schema: 'dbo', synchronize: false })
export class User {
    @PrimaryGeneratedColumn('increment')
    id_user: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
