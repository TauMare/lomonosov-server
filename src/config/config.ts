/* eslint-disable prettier/prettier */
import { Streamer } from "src/model/streamers.entity";
import { User } from "src/model/users.entity";
import { Stream } from "src/model/streams.entity";
export const postgresConfig:object = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'testUser',
  password: '1',
  database: 'streamDb',
  entities: [User, Streamer, Stream],
  synchronize: true,
};