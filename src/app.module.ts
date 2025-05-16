import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql', 
      host: 'localhost',
      port: 1433, 
      username: 'admin',
      password: 'admin',
      database: 'prueba4', 
      entities: [User],
      synchronize: true,
      options: {
        encrypt: false, 
        trustServerCertificate: true, 
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
