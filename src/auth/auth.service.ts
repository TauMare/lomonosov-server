import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/createUserDto';
import * as bcrypt from 'bcrypt';
import cryptoConfig from 'src/config/cryptoConfig';

@Injectable()

export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
    ) {}

    async register(user:CreateUserDto): Promise<object> {
      const result = await this.usersService.findByLogin(user.login)
      if (result === undefined){
        const salt = bcrypt.genSaltSync(10);
        const cryptedPass = bcrypt.hashSync(user.password, salt);
        
        const newData = {
          login: user.login,
          password: cryptedPass
        }
        const dbUser = await this.usersService.registerOne(newData);
        const payload = { login: dbUser.login, id: dbUser.id };
        return {
              access_token: this.jwtService.sign(payload),
            };
      } else {
        throw new HttpException('Такой аккаунт уже зарегистрирован', HttpStatus.CONFLICT)
      }
      
    }
    
    async login(user:CreateUserDto): Promise<object> {
      const dbUser = await this.usersService.findByLogin(user.login)
      if (dbUser !== undefined){
        if (bcrypt.compareSync(user.password, dbUser.password)){
          const payload = { login: dbUser.login, id: dbUser.id };
          return {
            access_token: this.jwtService.sign(payload, {expiresIn: '1 day', secret: cryptoConfig.jwtSecret}),
          };
        } else {
          throw new HttpException('Пароль введён не верно', HttpStatus.FORBIDDEN)
        }
      } else {
        throw new HttpException('Такого аккаунта не существует', HttpStatus.NOT_FOUND)
      }
    }

    verify(token:string):any {
      try{
        this.jwtService.verify(token, {secret:cryptoConfig.jwtSecret})
        return true 
      } catch{
        return false
      }
    }
    // async validateUser(username: string, pass: string): Promise<any> {
    //   const user = await this.usersService.findOne(username);
    //   if (user && user.password === pass) {
    //     const { password, ...result } = user;
    //     return result;
    //   }
    //   return null;
    // }
  }