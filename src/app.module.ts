import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamingModule } from './streaming-module/streaming.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig as dbConfig } from './config/config'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

console.log(dbConfig)
@Module({
  imports: [StreamingModule, TypeOrmModule.forRoot(dbConfig), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  
}


