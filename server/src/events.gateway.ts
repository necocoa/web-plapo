import { Logger } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server

  private logger = new Logger('AppGateway')

  afterInit() {
    this.logger.log('Initialized!')
  }

  handleConnection(_client: Socket, ..._args: any[]) {
    // this.logger.log(`Client connected:    ${client.id}`)
  }

  handleDisconnect(_client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`)
  }

  // WsResponse<string>

  @SubscribeMessage('room')
  handleRoom(@MessageBody() data: any): void {
    this.logger.log(`${JSON.stringify(data)}`)
    this.wss.emit('room', data)
  }

  @SubscribeMessage('member')
  handleMember(@MessageBody() data: any): void {
    this.wss.emit('member', data)
  }
}
