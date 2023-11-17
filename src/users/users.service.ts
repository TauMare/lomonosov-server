import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createUserDto';
import { User } from 'src/model/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }
  public async getAll(user:CreateUserDto) {
    // const newUser = new CreateUserDto()
    // newUser.login = "testName"
    // newUser.password = "testPassword"
    const newUser = new User()
    newUser.login = user.login
    newUser.password = user.password
    // this.repo.create(newUser)
    return await this.repo.save(newUser);
  }
  public async registerOne(user:CreateUserDto) {
    const newUser = new User()
    newUser.login = user.login
    newUser.password = user.password
    return await this.repo.save(newUser);
  }

  public async findByLogin(login:string){
    const result = await this.repo.findOne({
      login: login
    })
    return result
  }
  // private readonly users: User[];

  // constructor() {
  //   this.users = [
  //     {
  //       userId: 1,
  //       username: 'john',
  //       password: 'changeme',
  //     },
  //     {
  //       userId: 2,
  //       username: 'chris',
  //       password: 'secret',
  //     },
  //     {
  //       userId: 3,
  //       username: 'maria',
  //       password: 'guess',
  //     },
  //   ];
  // }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find(user => user.username === username);
  // }
}