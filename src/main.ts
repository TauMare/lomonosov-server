import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import NodeMediaServer = require('node-media-server');

// declare class NodeRtmpSession {
//   constructor(config, socket);
//   run(): void;
//   stop(): void;
//   reject(): void;
//   flush(): void;
//   onSocketClose(): void;
//   onSocketError(): void;
//   onSocketTimeout(): void;
//   onSocketData(): any;
//   rtmpChunkBasicHeaderCreate(): any;
//   rtmpChunkMessageHeaderCreate(): any;
//   rtmpChunksCreate(): any;
//   rtmpChunkRead(): any;
//   rtmpPacketParse(): void;
// }

// const config = {
//   logType: 3,

//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60,
//   },
//   http: {
//     port: 8000,
//     allow_origin: '*',
//   },
//   auth: {
//     api: true,
//     api_user: 'admin',
//     api_pass: 'nms2018',
//     play: true,
//     publish: true,
//     secret: 'nodemedia2017privatekey',
//   },
// };

// interface keyInterface {
//   status: boolean;
//   key?: string;
// }

// function getKey(StreamPath: string): keyInterface {
//   const key = StreamPath.match(/\/live\/.{0,}/gm);
//   if (key !== null) {
//     if (key[0].length >= 5) {
//       // console.log(key[0].split('/live/'));
//       // return key[0].split('/live/')[1];
//       return { status: true, key: key[0].split('/live/')[1] };
//     }
//   } else {
//     return { status: false };
//   }
//   // return key[0];
// }
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
  // const nms = new NodeMediaServer(config);

  // nms.on('prePublish', (id, StreamPath, args) => {
  //   console.log('_______________________________________________');
  //   console.log({ id, args });
  //   const session: NodeRtmpSession = nms.getSession(id);
  //   // console.log(session);
  //   // console.log(StreamPath);
  //   // session.reject();
  //   const keyData: keyInterface = getKey(StreamPath);
  //   if (keyData.status === false) {
  //     session.reject();
  //   } else {
  //     console.log(keyData);
  //   }
  // });
  // nms.run();
}

bootstrap();
