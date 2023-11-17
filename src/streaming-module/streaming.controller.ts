import { Controller, Get, Body, UseGuards, Request, Headers, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Stream } from 'src/model/streams.entity';
import { StreamingService } from './streaming.service';

@Controller('streams')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('someHello')
  getHello(): string {
    return this.streamingService.getHello();
  };

  @UseGuards(JwtAuthGuard)
  @Get('getKey')
  async getKey(
    // @Req() request: Request
    @Headers() headers
  ): Promise<string> {
      return await this.streamingService.getStreamKey(headers);
  }

  @Post('validateKey')
  async validateKey(@Body() data:{key:string}){
    return await this.streamingService.validateKey(data)
  }

  @Post('startStream')
  async startStream(@Body() data:{inSystemID:string, streamKey:string}){
    return await this.streamingService.startStream(data)
  }

  @Post('endStream')
  async endStream(@Body() data:{inSystemID:string}){
    return await this.streamingService.endStream(data)
  }

  @UseGuards(JwtAuthGuard)
  @Get('getStreams')
  async getStreams(): Promise<Stream[]> {
      return await this.streamingService.getStreams();
  }

  @UseGuards(JwtAuthGuard)
  @Post('getStream')
  async getStream(
    @Body() data:{inSystemID:string}
    ): Promise<Stream[]> {
      return await this.streamingService.getStream(data.inSystemID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getStreamAccessURL')
  async getStreamAccessURL(
    @Body() data:{inSystemID:string}
  ): Promise<string> {
      return await this.streamingService.getStreamAccessURL(data.inSystemID);
  }
}
