import { Logger } from '@nestjs/common'
import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'

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
    return { event: 'message', data: data }
  }
}
