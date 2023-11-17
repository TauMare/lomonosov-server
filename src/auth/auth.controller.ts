import { Body, Controller, Get, Post, UseGuards, Request, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUserDto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // login(
  //   @Body() data: { login: string, password: string }
  // ): object {
  //   //   @HttpCode(HttpCode)
  //     return this.authService.pong(data);
  // }
  @Post('register')
  register(
    @Body() data: { login: string, password: string }
  ): object{
    //   @HttpCode(HttpCode)
      const newUser = new CreateUserDto()
      newUser.login = data.login;
      newUser.password = data.password
      console.log(newUser);
      return this.authService.register(newUser);
  }
  @Post('login')
  login(
    @Body() data: { login: string, password: string }
  ): object{
    //   @HttpCode(HttpCode)
      const newUser = new CreateUserDto()
      newUser.login = data.login;
      newUser.password = data.password
      console.log(newUser);
      return this.authService.login(newUser);
  }
  @HttpCode(200)
  @Post('verify')
  verifyToken( 
    @Body() data:{token:string}
    ){
    // console.log(request);
    return this.authService.verify(data.token);
     
  }
  // @Get('testGet')
  // async testBobo(){
  //   return await this.authService.pib()
  // }
  
  // @UseGuards(JwtAuthGuard)---
  // @Get('login')----------------------------
  // async login2() {    -
  //   return this.authService.login();--------------
  // }

  // @Post('test/login2')
  // async login3(@Request() req) {    
  //   return this.authService.validateUser(req.body.user, req.body.pass);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('test')
  // getProfile(@Request() req) {
  //   return req.user;
  // }


}
