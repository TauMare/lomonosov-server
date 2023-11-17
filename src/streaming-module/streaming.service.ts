import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AES } from 'crypto-ts';
import { enc } from 'crypto-ts';
import NodeMediaServer = require('node-media-server');
import axios from 'axios';
import { Streamer } from "src/model/streamers.entity";
import cryptoConfig from '../config/cryptoConfig'
import { JwtService } from '@nestjs/jwt';
import { Stream } from 'src/model/streams.entity';
import { MD5 } from 'crypto-js';

// interface IHeaders{
//   authorization: string
// }

declare class NodeRtmpSession {
  constructor(config, socket);
  run(): void;
  stop(): void;
  reject(): void;
  flush(): void;
  onSocketClose(): void;
  onSocketError(): void;
  onSocketTimeout(): void;
  onSocketData(): any;
  rtmpChunkBasicHeaderCreate(): any;
  rtmpChunkMessageHeaderCreate(): any;
  rtmpChunksCreate(): any;
  rtmpChunkRead(): any;
  rtmpPacketParse(): void;
  sendStatusMessage(): void;
}

const config = {
  logType: 3,

  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
  auth: {
    api: true,
    api_user: 'systemAdmininstrator',
    api_pass: cryptoConfig.streamApiPass,
    play: true,
    publish: true,
    secret: cryptoConfig.streamAuthSecret,
  },
};

interface keyInterface {
  status: boolean;
  key?: string;
}

function getKey(StreamPath: string): keyInterface {
  const key = StreamPath.match(/\/live\/.{0,}/gm);
  if (key !== null) {
    if (key[0].length >= 5) {
      // console.log(key[0].split('/live/'));
      // return key[0].split('/live/')[1];
      return { status: true, key: key[0].split('/live/')[1] };
    }
  } else {
    return { status: false };
  }
  // return key[0];
}

const nms = new NodeMediaServer(config);

nms.check('prePublish', async (data) => {
  const keyData: keyInterface = getKey(data['streamPath']);
  if(keyData.status === true){
    console.log(keyData);
    const result = await axios.post('http://localhost:3001/streams/validateKey', {key:keyData.key});
    if(result.data){
      const result = await axios.post('http://localhost:3001/streams/startStream', {
        inSystemID: data['id'],
        streamKey: keyData.key
      });
      return true
    }
    return false
  } else {
    return false
  }
});

// nms.check('rtmp disconnect', async (data) => {
//   console.log('asdasdasdasdasdasd', data);
//   return true;
//   // const keyData: keyInterface = getKey(data['streamPath']);
//   // if(keyData.status === true){
//   //   console.log(keyData);
//   //   const result = await axios.post('http://localhost:3001/streams/validateKey', {key:keyData.key});
//   //   if(result.data){
//   //     return true
//   //   }
//   //   return false
//   // } else {
//   //   return false
//   // }
// });
nms.on('doneConnect', async (id, args) => {
  if (args['method']){
    return
  }
  console.log('=========================DONE CONNECT================================================');
  
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
  const result = await axios.post('http://localhost:3001/streams/endStream', {
        inSystemID: id,
      });
  console.log('=========================================================================');

  // const session:NodeRtmpSession = nms.getSession(id)
  // console.log(session);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.run();

async function createNewStreamKey(decodedJWT, repository){
  const newStreamer = new Streamer()
  const key = AES.encrypt(decodedJWT['login'], cryptoConfig.streamKeyGenSecret).toString();
  newStreamer.login = decodedJWT['login']
  newStreamer.streamKey = key
  await repository.save(newStreamer)
  return key         
}

async function findExistingStreamKeyByLogin(login, repository) {
  const result = await repository.findOne({
    login: login
  })
  return result
}

@Injectable()

export class StreamingService {
    constructor(
        @InjectRepository(Streamer) private repo: Repository<Streamer>,
        @InjectRepository(Stream) private streamsRepo: Repository<Stream>,
        private readonly jwtService: JwtService
    ) {}

    getHello(): string {
      return 'boob1';
    }

    async getStreamKey(headers):Promise<string> {
        const dirtyToken = headers.authorization;
        const clearToken = dirtyToken.split('Bearer ')[1]
        const decodedJWT = this.jwtService.decode(clearToken)

        const existingKey = await findExistingStreamKeyByLogin(decodedJWT['login'], this.repo)
        if(existingKey !== undefined){
          console.log('Returned existing key');
          return existingKey.streamKey
        }
        console.log('Returned generated key');
        return await createNewStreamKey(decodedJWT, this.repo)
        
        // return 'key'
    }

    async validateKey(data){
      if(data.key){
        const result = await this.repo.findOne({
          streamKey: data.key
        })
        if(result !== undefined){
          return true
        } 
        return false
      } else{
        throw new HttpException('No key provided', HttpStatus.BAD_REQUEST)
      }
    }

    async startStream(data){
      if(data.inSystemID && data.streamKey){
        const newStream = new Stream()
        newStream.inSystemID = data.inSystemID
        newStream.status = 'started'
        const bytes = AES.decrypt(data.streamKey, cryptoConfig.streamKeyGenSecret)
        const login = bytes.toString(enc.Utf8)
        newStream.login = login;
        newStream.streamKey = data.streamKey;
        newStream.createdAt = new Date(Date.now())
              
        return await this.streamsRepo.save(newStream)
      }
    }

    async endStream(data){
      const currentStream = await this.streamsRepo.findOne({
        inSystemID:data.inSystemID
      })
      if(currentStream === undefined){
        throw new HttpException('No stream found', HttpStatus.NOT_FOUND)
      } else{
        currentStream.status = 'ended'
        currentStream.endedAt = new Date(Date.now())
        return await this.streamsRepo.save(currentStream)
      }
    }

    async getStreams(){
      const streams = await this.streamsRepo.find({
        status: 'started'
      })
      return streams
    }

    async getStream(id:string){
      const stream = await this.streamsRepo.find({
        inSystemID: id,
        status: 'started'
      })
      return stream
    }

    async getStreamAccessURL(id:string){
      const streams = await this.streamsRepo.find({
        inSystemID: id
      })      
      /// live/stream-1503458721-nodemedia2017privatekey
      //cryptoConfig.streamAuthSecret
      const dateNow = new Date(Date.now())
      const expireAt = dateNow.setDate(dateNow.getDate() + 1)
      const hashingURL = "/live/" + streams[0].streamKey + '-' + expireAt.toString() + '-' + cryptoConfig.streamAuthSecret
      const hashedURL = MD5(hashingURL)
      const finalURL = "/live/" + streams[0].streamKey + ".flv?sign=" + expireAt.toString() + '-' + hashedURL
      console.log('==============FINAL URL=================');
      console.log(finalURL);
      return finalURL
    }
  }