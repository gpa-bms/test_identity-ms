import { SetMetadata } from '@nestjs/common';
// metadata es ocomo nuestro localstorage
export const Permissions = (permissions: string[]) => SetMetadata('permissions', permissions);
