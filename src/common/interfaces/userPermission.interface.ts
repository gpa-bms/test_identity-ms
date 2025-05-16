// interface/IUserPermissions.ts
export interface IUserPermissions {
    user_password: string;
    user_id: number;
    user_email: string;
    user_role: string; // <--- CAMBIO AQUÍ: Ahora es un array de strings
    permission_name: string[];
}