import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './identity/user/user.module';
import { AuthModule } from './identity/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development'],
    isGlobal: true
  }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
