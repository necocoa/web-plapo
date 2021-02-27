import { Logger } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { Server } from 'http'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server

  private logger = new Logger('AppGateway')

  afterInit() {
    this.logger.log('Initialized!')
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): WsResponse<string> {
    return { event: 'message', data: data }
  }
}
