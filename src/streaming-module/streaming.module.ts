import { Module } from '@nestjs/common';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../model/users.entity';
import { Stream } from 'src/model/streams.entity';
import { Streamer } from '../model/streamers.entity';
import { JwtModule } from '@nestjs/jwt';
import cryptoConfig from 'src/config/cryptoConfig';

@Module({
    imports: [
        TypeOrmModule.forFeature([Streamer, Stream]),
        JwtModule.register({
            secret: cryptoConfig.jwtSecret,
            signOptions: { expiresIn: '1 day' },
            }),
    ],
    controllers: [StreamingController],
    providers: [StreamingService],
})
export class StreamingModule {}
