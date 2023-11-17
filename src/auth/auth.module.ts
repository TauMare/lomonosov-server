import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import cryptoConfig from '../config/cryptoConfig';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
        secret: cryptoConfig.jwtSecret,
        signOptions: { expiresIn: '1 day' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy], 
    exports: [AuthService]
})
export class AuthModule {}
