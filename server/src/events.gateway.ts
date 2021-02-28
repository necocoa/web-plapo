import { Logger } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private logger = new Logger('AppGateway')

  afterInit() {
    this.logger.log('Initialized!')
  }

  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(`Client connected:    ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): WsResponse<string> {
    this.logger.log(`Send message: ${JSON.stringify(data)}`)
    return { event: 'message', data }
  }

  @SubscribeMessage('room')
  handleRoom(@MessageBody() data: any): WsResponse<string> {
    this.logger.log(`${JSON.stringify(data)}`)
    return { event: 'room', data }
  }
}
